package com.capstone.rebyu.assessment.service;

import com.capstone.rebyu.assessment.dto.attempt.DiagramAttemptDtos.*;
import com.capstone.rebyu.assessment.dto.attempt.LearnerAttemptDtos.*;
import com.capstone.rebyu.assessment.dto.attempt.ProgrammingAttemptDtos.*;
import com.capstone.rebyu.assessment.entity.*;
import com.capstone.rebyu.assessment.repository.*;
import com.capstone.rebyu.billing.entitlement.Entitlements;
import com.capstone.rebyu.billing.service.LearnerEntitlementService;
import com.capstone.rebyu.certification.entity.Lesson;
import com.capstone.rebyu.certification.repository.LessonRepository;
import com.capstone.rebyu.common.BusinessRuleException;
import com.capstone.rebyu.enrollment.entity.LearnerCertification;
import com.capstone.rebyu.enrollment.repository.LearnerCertificationRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

/**
 * Transaction Two: assessment attempt lifecycle. Starts snapshot-based
 * attempts, autosaves drafts, and scores submissions server-side. Learner
 * input is never trusted for correctness or points.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AssessmentAttemptService {

    private static final Duration SUBMIT_GRACE = Duration.ofSeconds(30);
    private static final String TYPE_DIAGNOSTIC = "DIAGNOSTIC";
    private static final String TYPE_QUIZ = "QUIZ";
    private static final String TYPE_MOCK = "MOCK_EXAM";

    private final ExamRepository examRepository;
    private final ExamQuestionRepository examQuestionRepository;
    private final QuestionRepository questionRepository;
    private final TextQuestionConfigRepository textQuestionConfigRepository;
    private final ProgrammingQuestionConfigRepository programmingQuestionConfigRepository;
    private final DiagramQuestionConfigRepository diagramQuestionConfigRepository;
    private final AssessmentAttemptRepository attemptRepository;
    private final AssessmentAttemptQuestionRepository attemptQuestionRepository;
    private final AssessmentAttemptAnswerRepository attemptAnswerRepository;
    private final LearnerCertificationRepository learnerCertificationRepository;
    private final ExamResultRepository examResultRepository;
    private final AssessmentAttemptExecutionRepository executionRepository;
    private final QuestionRubricCriterionRepository rubricCriterionRepository;
    private final LessonRepository lessonRepository;
    private final LearnerEntitlementService learnerEntitlementService;
    private final ObjectMapper objectMapper;

    private static final int MAX_EXECUTION_HISTORY = 20;
    private static final String EXECUTION_UNAVAILABLE_MESSAGE =
            "Code execution is not available yet. Your code has been saved and will be "
                    + "evaluated when the runner is enabled.";

    // ------------------------------------------------------------------
    // Learner-safe assessment listing
    // ------------------------------------------------------------------

    @Transactional(readOnly = true)
    public LearnerAssessmentDto getLearnerAssessment(Long examId, Long learnerId) {
        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new EntityNotFoundException("Assessment not found: " + examId));
        if (exam.effectiveStatus() != Exam.Status.PUBLISHED) {
            throw new BusinessRuleException.AssessmentNotPublishedException();
        }
        String lockReason = resolveLockReason(exam, learnerId);
        long questionCount = examQuestionRepository.countByExam_ExamId(examId);
        return new LearnerAssessmentDto(
                exam.getExamId(),
                exam.getTitle(),
                exam.getExamType().getExamTypeText(),
                exam.getDescription(),
                exam.getInstructions(),
                exam.getDurationMinutes(),
                (int) questionCount,
                exam.getPassingScore(),
                lockReason == null,
                lockReason
        );
    }

    // ------------------------------------------------------------------
    // Start
    // ------------------------------------------------------------------

    @Transactional
    public AssessmentAttemptStartResponseDto startAttempt(
            Long examId, Long learnerId, String idempotencyKey) {

        if (learnerId == null) {
            throw new BusinessRuleException.InvalidAssessmentSubmissionException(
                    "A learner profile is required to start an assessment.");
        }

        if (idempotencyKey != null && !idempotencyKey.isBlank()) {
            Optional<AssessmentAttempt> byKey = attemptRepository.findByIdempotencyKey(idempotencyKey);
            if (byKey.isPresent()) {
                return buildStartResponse(byKey.get(), true);
            }
        }

        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new EntityNotFoundException("Assessment not found: " + examId));
        if (exam.effectiveStatus() != Exam.Status.PUBLISHED) {
            throw new BusinessRuleException.AssessmentNotPublishedException();
        }

        // Mock exams are a premium feature: require personal Pro or an
        // institution-sponsored MOCK_EXAM_ACCESS entitlement for this
        // certification before an attempt can be created (structured 403).
        if (TYPE_MOCK.equals(exam.getExamType().getExamTypeText())) {
            learnerEntitlementService.requireLearnerEntitlement(
                    learnerId, Entitlements.MOCK_EXAM_ACCESS,
                    exam.getCertification().getCertificationId());
        }

        String lockReason = resolveLockReason(exam, learnerId);
        if (lockReason != null) {
            throw new BusinessRuleException.AssessmentLockedException(lockReason);
        }

        // Resume an open attempt instead of forking a second one.
        Optional<AssessmentAttempt> inProgress = attemptRepository
                .findFirstByExam_ExamIdAndLearnerIdAndStatus(
                        examId, learnerId, AssessmentAttempt.Status.IN_PROGRESS);
        if (inProgress.isPresent()) {
            AssessmentAttempt attempt = inProgress.get();
            if (attempt.getExpiresAt() == null
                    || LocalDateTime.now().isBefore(attempt.getExpiresAt())) {
                return buildStartResponse(attempt, true);
            }
            attempt.setStatus(AssessmentAttempt.Status.EXPIRED);
            attemptRepository.save(attempt);
        }

        List<ExamQuestion> examQuestions =
                examQuestionRepository.findByExam_ExamIdOrderByDisplayOrderAsc(examId);
        if (examQuestions.isEmpty()) {
            throw new BusinessRuleException.AssessmentNotPublishedException();
        }

        int nextAttemptNumber = attemptRepository
                .findTopByExam_ExamIdAndLearnerIdOrderByAttemptNumberDesc(examId, learnerId)
                .map(previous -> previous.getAttemptNumber() + 1)
                .orElse(1);

        LocalDateTime now = LocalDateTime.now();
        AssessmentAttempt attempt = AssessmentAttempt.builder()
                .exam(exam)
                .learnerId(learnerId)
                .enrollmentId(findEnrollmentId(exam, learnerId))
                .attemptNumber(nextAttemptNumber)
                .status(AssessmentAttempt.Status.IN_PROGRESS)
                .startedAt(now)
                .expiresAt(exam.getDurationMinutes() != null
                        ? now.plusMinutes(exam.getDurationMinutes())
                        : null)
                .idempotencyKey(idempotencyKey != null && !idempotencyKey.isBlank()
                        ? idempotencyKey
                        : UUID.randomUUID().toString())
                .build();
        attempt = attemptRepository.save(attempt);

        int order = 1;
        for (ExamQuestion examQuestion : examQuestions) {
            Question question = examQuestion.getQuestion();
            // Snapshot the per-assessment point value so this attempt scores by
            // what the question is worth in THIS exam; fall back to the
            // question's own total when no override was set.
            BigDecimal points = examQuestion.getPoints() != null
                    ? examQuestion.getPoints()
                    : question.getTotalPoints();
            attemptQuestionRepository.save(AssessmentAttemptQuestion.builder()
                    .attempt(attempt)
                    .sourceQuestionId(question.getQuestionId())
                    .questionType(normalizeQuestionType(question.getQuestionType()))
                    .questionTextSnapshot(question.getQuestionText())
                    .questionDataSnapshot(buildLearnerSafeSnapshot(question))
                    .displayOrder(order++)
                    .points(points)
                    .lessonId(question.getLesson().getLessonId())
                    .build());
        }

        log.info("Started attempt {} (#{}) of exam {} for learner {}",
                attempt.getAssessmentAttemptId(), nextAttemptNumber, examId, learnerId);
        return buildStartResponse(attempt, false);
    }

    // ------------------------------------------------------------------
    // Autosave
    // ------------------------------------------------------------------

    @Transactional
    public void autosaveAnswers(Long attemptId, AutosaveAnswersRequestDto request) {
        AssessmentAttempt attempt = requireOwnedAttempt(attemptId, request.learnerId());
        requireEditable(attempt);
        upsertAnswers(attempt, request.answers());
    }

    // ------------------------------------------------------------------
    // Per-item learner actions: flag, skip, current item
    // ------------------------------------------------------------------

    @Transactional
    public void setFlag(Long attemptId, Long attemptQuestionId, Long learnerId, boolean flagged) {
        AssessmentAttempt attempt = requireOwnedAttempt(attemptId, learnerId);
        requireEditable(attempt);
        AssessmentAttemptQuestion question = requireAttemptQuestion(attempt, attemptQuestionId);
        question.setFlagged(flagged);
        attemptQuestionRepository.save(question);
    }

    @Transactional
    public void setSkip(Long attemptId, Long attemptQuestionId, Long learnerId, boolean skipped) {
        AssessmentAttempt attempt = requireOwnedAttempt(attemptId, learnerId);
        requireEditable(attempt);
        AssessmentAttemptQuestion question = requireAttemptQuestion(attempt, attemptQuestionId);
        question.setSkipped(skipped);
        attemptQuestionRepository.save(question);
    }

    @Transactional
    public void setCurrentItem(Long attemptId, Long attemptQuestionId, Long learnerId) {
        AssessmentAttempt attempt = requireOwnedAttempt(attemptId, learnerId);
        requireEditable(attempt);
        // Validate the item belongs to this attempt before recording it.
        requireAttemptQuestion(attempt, attemptQuestionId);
        attempt.setCurrentQuestionId(attemptQuestionId);
        attemptRepository.save(attempt);
    }

    private AssessmentAttemptQuestion requireAttemptQuestion(AssessmentAttempt attempt, Long attemptQuestionId) {
        AssessmentAttemptQuestion question = attemptQuestionRepository.findById(attemptQuestionId)
                .orElseThrow(() -> new BusinessRuleException.InvalidAssessmentSubmissionException(
                        "That item does not belong to this attempt."));
        if (!question.getAttempt().getAssessmentAttemptId().equals(attempt.getAssessmentAttemptId())) {
            throw new BusinessRuleException.InvalidAssessmentSubmissionException(
                    "That item does not belong to this attempt.");
        }
        return question;
    }

    /** Rejects edits once an attempt is submitted or its server clock expired. */
    private void requireEditable(AssessmentAttempt attempt) {
        if (attempt.getStatus() != AssessmentAttempt.Status.IN_PROGRESS) {
            throw new BusinessRuleException.AssessmentAttemptAlreadySubmittedException();
        }
        if (attempt.getExpiresAt() != null
                && LocalDateTime.now().isAfter(attempt.getExpiresAt().plus(SUBMIT_GRACE))) {
            throw new BusinessRuleException.AssessmentLockedException(
                    "The time limit for this assessment has passed.");
        }
    }

    // ------------------------------------------------------------------
    // Submit
    // ------------------------------------------------------------------

    @Transactional
    public AssessmentAttemptResultDto submitAttempt(
            Long attemptId, SubmitAssessmentAttemptRequestDto request) {

        AssessmentAttempt attempt = requireOwnedAttempt(attemptId, request.learnerId());

        // Idempotent second submit returns the existing result.
        if (attempt.getStatus() == AssessmentAttempt.Status.SUBMITTED) {
            return getResult(attemptId, request.learnerId());
        }
        if (attempt.getStatus() != AssessmentAttempt.Status.IN_PROGRESS) {
            throw new BusinessRuleException.AssessmentAttemptAlreadySubmittedException();
        }
        if (attempt.getExpiresAt() != null
                && LocalDateTime.now().isAfter(attempt.getExpiresAt().plus(SUBMIT_GRACE))) {
            attempt.setStatus(AssessmentAttempt.Status.EXPIRED);
        }

        if (request.answers() != null && !request.answers().isEmpty()) {
            upsertAnswers(attempt, request.answers());
        }

        List<AssessmentAttemptQuestion> questions = attemptQuestionRepository
                .findByAttempt_AssessmentAttemptIdOrderByDisplayOrderAsc(attemptId);
        Map<Long, AssessmentAttemptAnswer> answersByQuestion = new HashMap<>();
        for (AssessmentAttemptAnswer answer :
                attemptAnswerRepository.findByAttempt_AssessmentAttemptId(attemptId)) {
            answersByQuestion.put(answer.getAttemptQuestion().getAttemptQuestionId(), answer);
        }

        BigDecimal totalPoints = BigDecimal.ZERO;
        BigDecimal earnedPoints = BigDecimal.ZERO;

        for (AssessmentAttemptQuestion attemptQuestion : questions) {
            BigDecimal points = attemptQuestion.getPoints() == null
                    ? BigDecimal.ONE
                    : attemptQuestion.getPoints();
            totalPoints = totalPoints.add(points);

            AssessmentAttemptAnswer answer =
                    answersByQuestion.get(attemptQuestion.getAttemptQuestionId());
            if (answer == null) {
                continue;
            }
            scoreAnswer(attemptQuestion, answer, points);
            attemptAnswerRepository.save(answer);
            if (Boolean.TRUE.equals(answer.getIsCorrect()) && answer.getEarnedPoints() != null) {
                earnedPoints = earnedPoints.add(answer.getEarnedPoints());
            }
        }

        BigDecimal percentage = totalPoints.signum() > 0
                ? earnedPoints.multiply(BigDecimal.valueOf(100))
                        .divide(totalPoints, 2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;
        BigDecimal passingScore = attempt.getExam().getPassingScore() == null
                ? BigDecimal.ZERO
                : attempt.getExam().getPassingScore();

        LocalDateTime now = LocalDateTime.now();
        attempt.setStatus(AssessmentAttempt.Status.SUBMITTED);
        attempt.setSubmittedAt(now);
        attempt.setTotalPoints(totalPoints);
        attempt.setEarnedPoints(earnedPoints);
        attempt.setPercentage(percentage);
        attempt.setPassed(percentage.compareTo(passingScore) >= 0);
        attempt.setDurationSeconds((int) Duration
                .between(attempt.getStartedAt(), now).getSeconds());
        attemptRepository.save(attempt);

        recordLegacyExamResult(attempt);
        completeDiagnosticGateIfApplicable(attempt);

        log.info("Attempt {} submitted: {}% ({} / {} points)",
                attemptId, percentage, earnedPoints, totalPoints);
        return getResult(attemptId, request.learnerId());
    }

    // ------------------------------------------------------------------
    // Result
    // ------------------------------------------------------------------

    @Transactional(readOnly = true)
    public AssessmentAttemptResultDto getResult(Long attemptId, Long learnerId) {
        AssessmentAttempt attempt = requireOwnedAttempt(attemptId, learnerId);
        if (attempt.getStatus() == AssessmentAttempt.Status.IN_PROGRESS) {
            throw new BusinessRuleException.InvalidAssessmentSubmissionException(
                    "This attempt has not been submitted yet.");
        }

        List<AssessmentAttemptQuestion> questions = attemptQuestionRepository
                .findByAttempt_AssessmentAttemptIdOrderByDisplayOrderAsc(attemptId);
        Map<Long, AssessmentAttemptAnswer> answersByQuestion = new HashMap<>();
        for (AssessmentAttemptAnswer answer :
                attemptAnswerRepository.findByAttempt_AssessmentAttemptId(attemptId)) {
            answersByQuestion.put(answer.getAttemptQuestion().getAttemptQuestionId(), answer);
        }

        List<AttemptAnswerReviewDto> reviews = new ArrayList<>();
        int correct = 0;
        int incorrect = 0;
        int pending = 0;
        int unanswered = 0;

        // Per-lesson performance for strengths / weak-area analysis (diagnostics).
        Map<Long, BigDecimal> lessonPossible = new LinkedHashMap<>();
        Map<Long, BigDecimal> lessonEarned = new LinkedHashMap<>();
        Map<Long, Integer> lessonPending = new LinkedHashMap<>();

        for (AssessmentAttemptQuestion attemptQuestion : questions) {
            AssessmentAttemptAnswer answer =
                    answersByQuestion.get(attemptQuestion.getAttemptQuestionId());
            Question source = questionRepository
                    .findById(attemptQuestion.getSourceQuestionId()).orElse(null);

            Long lessonId = attemptQuestion.getLessonId();
            if (lessonId != null) {
                BigDecimal points = attemptQuestion.getPoints() == null
                        ? BigDecimal.ZERO : attemptQuestion.getPoints();
                lessonPossible.merge(lessonId, points, BigDecimal::add);
                BigDecimal earned = (answer != null && answer.getEarnedPoints() != null)
                        ? answer.getEarnedPoints() : BigDecimal.ZERO;
                lessonEarned.merge(lessonId, earned, BigDecimal::add);
                if (answer != null && answer.isPendingManualEvaluation()) {
                    lessonPending.merge(lessonId, 1, Integer::sum);
                }
            }

            String selectedChoiceText = null;
            String correctChoiceText = null;
            String explanation = null;
            if (source != null && isMultipleChoice(source.getQuestionType())) {
                Choice correctChoice = source.getChoices().stream()
                        .filter(Choice::isCorrect).findFirst().orElse(null);
                if (correctChoice != null) {
                    correctChoiceText = correctChoice.getChoiceText();
                    explanation = correctChoice.getExplanation();
                }
                if (answer != null && answer.getSelectedChoiceId() != null) {
                    selectedChoiceText = source.getChoices().stream()
                            .filter(c -> c.getChoiceId().equals(answer.getSelectedChoiceId()))
                            .map(Choice::getChoiceText).findFirst().orElse(null);
                }
            }

            if (answer == null) {
                unanswered++;
            } else if (answer.isPendingManualEvaluation()) {
                pending++;
            } else if (Boolean.TRUE.equals(answer.getIsCorrect())) {
                correct++;
            } else {
                incorrect++;
            }

            reviews.add(new AttemptAnswerReviewDto(
                    attemptQuestion.getAttemptQuestionId(),
                    attemptQuestion.getDisplayOrder(),
                    attemptQuestion.getQuestionType(),
                    attemptQuestion.getQuestionTextSnapshot(),
                    answer == null ? null : answer.getIsCorrect(),
                    answer != null && answer.isPendingManualEvaluation(),
                    answer == null ? null : answer.getEarnedPoints(),
                    attemptQuestion.getPoints(),
                    answer == null ? null : answer.getLearnerAnswer(),
                    answer == null ? null : answer.getSelectedChoiceId(),
                    selectedChoiceText,
                    correctChoiceText,
                    explanation,
                    answer == null ? null : answer.getSubmittedCode(),
                    answer == null ? null : answer.getProgrammingLanguage(),
                    answer != null && answer.getDiagramSubmissionData() != null
            ));
        }

        List<LessonPerformanceDto> lessonBreakdown = new ArrayList<>();
        for (Map.Entry<Long, BigDecimal> entry : lessonPossible.entrySet()) {
            Long lessonId = entry.getKey();
            BigDecimal possible = entry.getValue();
            BigDecimal earned = lessonEarned.getOrDefault(lessonId, BigDecimal.ZERO);
            BigDecimal lessonPercentage = possible.signum() > 0
                    ? earned.multiply(BigDecimal.valueOf(100)).divide(possible, 2, RoundingMode.HALF_UP)
                    : BigDecimal.ZERO;
            String title = lessonRepository.findById(lessonId)
                    .map(Lesson::getName).orElse("Lesson " + lessonId);
            lessonBreakdown.add(new LessonPerformanceDto(
                    lessonId, title, possible, earned, lessonPercentage,
                    lessonPending.getOrDefault(lessonId, 0)));
        }

        Exam exam = attempt.getExam();
        return new AssessmentAttemptResultDto(
                attempt.getAssessmentAttemptId(),
                exam.getExamId(),
                exam.getTitle(),
                exam.getExamType().getExamTypeText(),
                attempt.getAttemptNumber(),
                attempt.getSubmittedAt(),
                attempt.getDurationSeconds(),
                attempt.getPercentage(),
                attempt.getPassed(),
                exam.getPassingScore(),
                attempt.getTotalPoints(),
                attempt.getEarnedPoints(),
                correct, incorrect, pending, unanswered,
                reviews,
                lessonBreakdown
        );
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> listAttempts(Long learnerId) {
        List<Map<String, Object>> summaries = new ArrayList<>();
        for (AssessmentAttempt attempt :
                attemptRepository.findByLearnerIdOrderByStartedAtDesc(learnerId)) {
            Map<String, Object> summary = new LinkedHashMap<>();
            summary.put("assessmentAttemptId", attempt.getAssessmentAttemptId());
            summary.put("assessmentId", attempt.getExam().getExamId());
            summary.put("assessmentTitle", attempt.getExam().getTitle());
            summary.put("attemptNumber", attempt.getAttemptNumber());
            summary.put("status", attempt.getStatus().name());
            summary.put("startedAt", attempt.getStartedAt());
            summary.put("submittedAt", attempt.getSubmittedAt());
            summary.put("percentage", attempt.getPercentage());
            summary.put("passed", attempt.getPassed());
            summaries.add(summary);
        }
        return summaries;
    }

    // ------------------------------------------------------------------
    // Internals
    // ------------------------------------------------------------------

    private AssessmentAttempt requireOwnedAttempt(Long attemptId, Long learnerId) {
        AssessmentAttempt attempt = attemptRepository.findById(attemptId)
                .orElseThrow(() -> new EntityNotFoundException("Attempt not found: " + attemptId));
        if (learnerId == null || !attempt.getLearnerId().equals(learnerId)) {
            throw new EntityNotFoundException("Attempt not found: " + attemptId);
        }
        return attempt;
    }

    private String resolveLockReason(Exam exam, Long learnerId) {
        Long certificationId = exam.getCertification().getCertificationId();
        Optional<LearnerCertification> enrollment = learnerCertificationRepository
                .findFirstByLearner_LearnerIdAndCertification_CertificationIdAndStatus(
                        learnerId, certificationId, LearnerCertification.Status.active);
        if (enrollment.isEmpty()) {
            return "Enroll in this certification before taking its assessments.";
        }
        String type = exam.getExamType().getExamTypeText();
        // Mock exams are premium: lock them for learners without personal Pro or
        // an eligible institution-sponsored entitlement (shown as locked upfront;
        // startAttempt also hard-blocks with a structured 403).
        if (TYPE_MOCK.equals(type)
                && !learnerEntitlementService.hasLearnerEntitlement(
                        learnerId, Entitlements.MOCK_EXAM_ACCESS, certificationId)) {
            return "This mock exam requires REBYU Pro or an eligible institutional license.";
        }
        if (!TYPE_DIAGNOSTIC.equals(type)
                && enrollment.get().getDiagnosticCompletedAt() == null
                && publishedDiagnosticExists(certificationId)) {
            return "Complete the diagnostic assessment before studying lessons.";
        }
        return null;
    }

    private boolean publishedDiagnosticExists(Long certificationId) {
        return examRepository.findAll().stream()
                .anyMatch(exam -> exam.getCertification().getCertificationId().equals(certificationId)
                        && TYPE_DIAGNOSTIC.equals(exam.getExamType().getExamTypeText())
                        && exam.effectiveStatus() == Exam.Status.PUBLISHED);
    }

    private Long findEnrollmentId(Exam exam, Long learnerId) {
        return learnerCertificationRepository
                .findFirstByLearner_LearnerIdAndCertification_CertificationIdAndStatus(
                        learnerId,
                        exam.getCertification().getCertificationId(),
                        LearnerCertification.Status.active)
                .map(LearnerCertification::getLearnerCertificationId)
                .orElse(null);
    }

    private void completeDiagnosticGateIfApplicable(AssessmentAttempt attempt) {
        if (!TYPE_DIAGNOSTIC.equals(attempt.getExam().getExamType().getExamTypeText())) {
            return;
        }
        if (attempt.getEnrollmentId() == null) {
            return;
        }
        learnerCertificationRepository.findById(attempt.getEnrollmentId())
                .ifPresent(enrollment -> {
                    if (enrollment.getDiagnosticCompletedAt() == null) {
                        enrollment.setDiagnosticCompletedAt(LocalDateTime.now());
                        enrollment.setDiagnosticAttemptId(attempt.getAssessmentAttemptId());
                        learnerCertificationRepository.save(enrollment);
                    }
                });
    }

    /** Keeps the pre-existing exam_results analytics table in sync. */
    private void recordLegacyExamResult(AssessmentAttempt attempt) {
        try {
            ExamResultId id = new ExamResultId();
            id.setLearnerId(attempt.getLearnerId());
            id.setExamId(attempt.getExam().getExamId());
            id.setAttemptNo(attempt.getAttemptNumber());
            if (examResultRepository.existsById(id)) {
                return;
            }
            com.capstone.rebyu.user.entity.Learner learnerRef =
                    new com.capstone.rebyu.user.entity.Learner();
            learnerRef.setLearnerId(attempt.getLearnerId());
            examResultRepository.save(ExamResult.builder()
                    .id(id)
                    .learner(learnerRef)
                    .exam(attempt.getExam())
                    .takenAt(attempt.getSubmittedAt())
                    .score(attempt.getPercentage())
                    .durationSeconds(attempt.getDurationSeconds() == null
                            ? 0 : attempt.getDurationSeconds())
                    .isPassed(Boolean.TRUE.equals(attempt.getPassed()))
                    .build());
        } catch (Exception e) {
            // Analytics sync must not fail the submission transaction result.
            log.warn("Could not record legacy exam result for attempt {}: {}",
                    attempt.getAssessmentAttemptId(), e.getMessage());
        }
    }

    private void upsertAnswers(AssessmentAttempt attempt, List<AttemptAnswerDraftDto> drafts) {
        if (drafts == null) {
            return;
        }
        for (AttemptAnswerDraftDto draft : drafts) {
            if (draft == null || draft.attemptQuestionId() == null) {
                continue;
            }
            AssessmentAttemptQuestion attemptQuestion = attemptQuestionRepository
                    .findById(draft.attemptQuestionId())
                    .orElseThrow(() -> new BusinessRuleException.InvalidAssessmentSubmissionException(
                            "One of the answers does not belong to this attempt."));
            if (!attemptQuestion.getAttempt().getAssessmentAttemptId()
                    .equals(attempt.getAssessmentAttemptId())) {
                throw new BusinessRuleException.InvalidAssessmentSubmissionException(
                        "One of the answers does not belong to this attempt.");
            }

            AssessmentAttemptAnswer answer = attemptAnswerRepository
                    .findByAttempt_AssessmentAttemptIdAndAttemptQuestion_AttemptQuestionId(
                            attempt.getAssessmentAttemptId(), draft.attemptQuestionId())
                    .orElseGet(() -> AssessmentAttemptAnswer.builder()
                            .attempt(attempt)
                            .attemptQuestion(attemptQuestion)
                            .build());

            boolean unchanged =
                    equalsNullable(answer.getLearnerAnswer(), draft.learnerAnswer())
                            && equalsNullable(answer.getSelectedChoiceId(), draft.selectedChoiceId())
                            && equalsNullable(answer.getSubmittedCode(), draft.submittedCode())
                            && equalsNullable(answer.getProgrammingLanguage(), draft.programmingLanguage())
                            && equalsNullable(answer.getDiagramSubmissionData(), draft.diagramSubmissionData());
            if (unchanged && answer.getAttemptAnswerId() != null) {
                continue;
            }

            answer.setLearnerAnswer(draft.learnerAnswer());
            answer.setSelectedChoiceId(draft.selectedChoiceId());
            answer.setSubmittedCode(draft.submittedCode());
            answer.setProgrammingLanguage(draft.programmingLanguage());
            answer.setDiagramSubmissionData(draft.diagramSubmissionData());
            LocalDateTime now = LocalDateTime.now();
            answer.setAnsweredAt(now);
            answer.setLastSavedAt(now);
            attemptAnswerRepository.save(answer);

            // A real answer clears any prior "skipped" state on that item.
            if (attemptQuestion.isSkipped() && hasAnswerContent(draft)) {
                attemptQuestion.setSkipped(false);
                attemptQuestionRepository.save(attemptQuestion);
            }
        }
    }

    private boolean hasAnswerContent(AttemptAnswerDraftDto draft) {
        return (draft.learnerAnswer() != null && !draft.learnerAnswer().isBlank())
                || draft.selectedChoiceId() != null
                || (draft.submittedCode() != null && !draft.submittedCode().isBlank())
                || (draft.diagramSubmissionData() != null && !draft.diagramSubmissionData().isBlank());
    }

    private static boolean equalsNullable(Object a, Object b) {
        return a == null ? b == null : a.equals(b);
    }

    private static boolean isMultipleChoice(String questionType) {
        return "MULTIPLE_CHOICE".equalsIgnoreCase(questionType)
                || "MCQ".equalsIgnoreCase(questionType);
    }

    private static String normalizeQuestionType(String questionType) {
        return isMultipleChoice(questionType) ? "MULTIPLE_CHOICE" : questionType;
    }

    private void scoreAnswer(
            AssessmentAttemptQuestion attemptQuestion,
            AssessmentAttemptAnswer answer,
            BigDecimal points) {

        String type = attemptQuestion.getQuestionType();
        Question source = questionRepository
                .findById(attemptQuestion.getSourceQuestionId()).orElse(null);

        if (isMultipleChoice(type) && source != null) {
            boolean correct = answer.getSelectedChoiceId() != null
                    && source.getChoices().stream()
                            .anyMatch(choice -> choice.getChoiceId()
                                    .equals(answer.getSelectedChoiceId())
                                    && choice.isCorrect());
            answer.setIsCorrect(correct);
            answer.setEarnedPoints(correct ? points : BigDecimal.ZERO);
            answer.setPendingManualEvaluation(false);
            return;
        }

        if ("SHORT_ANSWER".equals(type) && source != null) {
            Optional<TextQuestionConfig> config = textQuestionConfigRepository
                    .findByQuestion_QuestionId(source.getQuestionId());
            if (config.isPresent()
                    && "EXACT_MATCH".equalsIgnoreCase(config.get().getCheckingMethod())
                    && answer.getLearnerAnswer() != null) {
                boolean correct = normalize(answer.getLearnerAnswer())
                        .equals(normalize(config.get().getCorrectAnswer()));
                answer.setIsCorrect(correct);
                answer.setEarnedPoints(correct ? points : BigDecimal.ZERO);
                answer.setPendingManualEvaluation(false);
                return;
            }
        }

        // Descriptive, programming, diagram, and non-exact short answers have
        // no automatic evaluator — never fabricate a score for them.
        answer.setIsCorrect(null);
        answer.setEarnedPoints(null);
        answer.setPendingManualEvaluation(true);
    }

    private static String normalize(String value) {
        return value == null ? "" : value.trim().toLowerCase();
    }

    private AssessmentAttemptStartResponseDto buildStartResponse(
            AssessmentAttempt attempt, boolean resumed) {

        List<AssessmentAttemptQuestion> questions = attemptQuestionRepository
                .findByAttempt_AssessmentAttemptIdOrderByDisplayOrderAsc(
                        attempt.getAssessmentAttemptId());

        List<LearnerAttemptQuestionDto> questionDtos = new ArrayList<>();
        List<Long> flaggedIds = new ArrayList<>();
        List<Long> skippedIds = new ArrayList<>();
        for (AssessmentAttemptQuestion attemptQuestion : questions) {
            questionDtos.add(toLearnerQuestion(attemptQuestion));
            if (attemptQuestion.isFlagged()) {
                flaggedIds.add(attemptQuestion.getAttemptQuestionId());
            }
            if (attemptQuestion.isSkipped()) {
                skippedIds.add(attemptQuestion.getAttemptQuestionId());
            }
        }

        Map<Long, AttemptAnswerDraftDto> savedAnswers = new LinkedHashMap<>();
        for (AssessmentAttemptAnswer answer :
                attemptAnswerRepository.findByAttempt_AssessmentAttemptId(
                        attempt.getAssessmentAttemptId())) {
            savedAnswers.put(
                    answer.getAttemptQuestion().getAttemptQuestionId(),
                    new AttemptAnswerDraftDto(
                            answer.getAttemptQuestion().getAttemptQuestionId(),
                            answer.getLearnerAnswer(),
                            answer.getSelectedChoiceId(),
                            answer.getSubmittedCode(),
                            answer.getProgrammingLanguage(),
                            answer.getDiagramSubmissionData()));
        }

        Exam exam = attempt.getExam();
        return new AssessmentAttemptStartResponseDto(
                attempt.getAssessmentAttemptId(),
                exam.getExamId(),
                exam.getTitle(),
                exam.getExamType().getExamTypeText(),
                attempt.getAttemptNumber(),
                attempt.getStartedAt(),
                attempt.getExpiresAt(),
                resumed,
                questionDtos,
                savedAnswers,
                attempt.getCurrentQuestionId(),
                flaggedIds,
                skippedIds
        );
    }

    /**
     * Builds the learner-safe snapshot JSON for one question: choices without
     * correct flags/explanations, starter code, diagram type + instructions,
     * and sub-question prompts. Answer keys never enter the snapshot.
     */
    private String buildLearnerSafeSnapshot(Question question) {
        Map<String, Object> data = new LinkedHashMap<>();
        data.put("questionImageKey", question.getImageKey());

        if (isMultipleChoice(question.getQuestionType())) {
            List<Map<String, Object>> choices = new ArrayList<>();
            for (Choice choice : question.getChoices()) {
                Map<String, Object> safe = new LinkedHashMap<>();
                safe.put("choiceId", choice.getChoiceId());
                safe.put("choiceText", choice.getChoiceText());
                safe.put("imageKey", choice.getImageKey());
                choices.add(safe);
            }
            data.put("choices", choices);
        }

        if ("CRITICAL_THINKING".equals(question.getQuestionType())) {
            programmingQuestionConfigRepository
                    .findByQuestion_QuestionId(question.getQuestionId())
                    .ifPresent(config -> {
                        data.put("criticalThinkingType", "PROGRAMMING");
                        data.put("starterCode", config.getStarterCode());
                        // Learner-safe test metadata: sample inputs may show;
                        // hidden cases are label-only, never expected output.
                        List<Map<String, Object>> tests = new ArrayList<>();
                        int index = 1;
                        int sampleNo = 1;
                        int hiddenNo = 1;
                        for (ProgrammingTestCase testCase : config.getTestCases()) {
                            Map<String, Object> safe = new LinkedHashMap<>();
                            boolean sample = testCase.isSample();
                            safe.put("index", index++);
                            safe.put("sample", sample);
                            safe.put("label", sample ? "Sample " + (sampleNo++) : "Hidden " + (hiddenNo++));
                            safe.put("input", sample ? testCase.getInputData() : null);
                            tests.add(safe);
                        }
                        data.put("testCases", tests);
                    });
            diagramQuestionConfigRepository
                    .findByQuestion_QuestionId(question.getQuestionId())
                    .ifPresent(config -> {
                        data.put("criticalThinkingType", "DIAGRAM");
                        data.put("diagramType", config.getDiagramType());
                        data.put("instructions", config.getInstructions());
                        // reference diagram XML/JSON is the answer key — excluded
                    });

            List<Map<String, Object>> subQuestions = new ArrayList<>();
            for (Question sub : questionRepository
                    .findByParentQuestion_QuestionId(question.getQuestionId())) {
                Map<String, Object> safe = new LinkedHashMap<>();
                safe.put("subQuestionId", sub.getQuestionId());
                safe.put("questionText", sub.getQuestionText());
                subQuestions.add(safe);
            }
            data.put("subQuestions", subQuestions);
        }

        // Backend-driven rubric (diagram/descriptive): learner-safe name + max
        // points only. Awarded points are never snapshotted.
        List<QuestionRubricCriterion> criteria = rubricCriterionRepository
                .findByQuestion_QuestionIdOrderByDisplayOrderAsc(question.getQuestionId());
        if (!criteria.isEmpty()) {
            List<Map<String, Object>> rubric = new ArrayList<>();
            for (QuestionRubricCriterion criterion : criteria) {
                Map<String, Object> safe = new LinkedHashMap<>();
                safe.put("name", criterion.getName());
                safe.put("maxPoints", criterion.getMaxPoints());
                rubric.add(safe);
            }
            data.put("rubric", rubric);
        }

        try {
            return objectMapper.writeValueAsString(data);
        } catch (Exception e) {
            log.warn("Could not serialize snapshot for question {}", question.getQuestionId());
            return "{}";
        }
    }

    @SuppressWarnings("unchecked")
    private LearnerAttemptQuestionDto toLearnerQuestion(AssessmentAttemptQuestion attemptQuestion) {
        Map<String, Object> data = Map.of();
        try {
            if (attemptQuestion.getQuestionDataSnapshot() != null) {
                data = objectMapper.readValue(
                        attemptQuestion.getQuestionDataSnapshot(),
                        new TypeReference<Map<String, Object>>() {});
            }
        } catch (Exception e) {
            log.warn("Could not parse snapshot for attempt question {}",
                    attemptQuestion.getAttemptQuestionId());
        }

        List<LearnerChoiceDto> choices = new ArrayList<>();
        Object rawChoices = data.get("choices");
        if (rawChoices instanceof List<?> list) {
            for (Object item : list) {
                if (item instanceof Map<?, ?> map) {
                    choices.add(new LearnerChoiceDto(
                            map.get("choiceId") == null
                                    ? null : Long.valueOf(map.get("choiceId").toString()),
                            (String) map.get("choiceText"),
                            (String) map.get("imageKey")));
                }
            }
        }

        // Repair learner-safe output for attempts created before MCQ was
        // normalized to MULTIPLE_CHOICE. Only choice text/media is copied;
        // correct flags and explanations remain server-side.
        if (choices.isEmpty() && isMultipleChoice(attemptQuestion.getQuestionType())) {
            questionRepository.findById(attemptQuestion.getSourceQuestionId())
                    .ifPresent(source -> source.getChoices().forEach(choice ->
                            choices.add(new LearnerChoiceDto(
                                    choice.getChoiceId(),
                                    choice.getChoiceText(),
                                    choice.getImageKey()))));
        }

        List<LearnerSubQuestionDto> subQuestions = new ArrayList<>();
        Object rawSubs = data.get("subQuestions");
        if (rawSubs instanceof List<?> list) {
            for (Object item : list) {
                if (item instanceof Map<?, ?> map) {
                    subQuestions.add(new LearnerSubQuestionDto(
                            map.get("subQuestionId") == null
                                    ? null : Long.valueOf(map.get("subQuestionId").toString()),
                            (String) map.get("questionText")));
                }
            }
        }

        return new LearnerAttemptQuestionDto(
                attemptQuestion.getAttemptQuestionId(),
                attemptQuestion.getDisplayOrder(),
                normalizeQuestionType(attemptQuestion.getQuestionType()),
                (String) data.get("criticalThinkingType"),
                attemptQuestion.getQuestionTextSnapshot(),
                (String) data.get("questionImageKey"),
                choices,
                (String) data.get("starterCode"),
                (String) data.get("diagramType"),
                (String) data.get("instructions"),
                subQuestions,
                attemptQuestion.getPoints(),
                parseLearnerTestCases(data),
                parseRubric(data)
        );
    }

    // ------------------------------------------------------------------
    // Diagram Check (evaluator stubbed — never fabricates a score)
    // ------------------------------------------------------------------

    @Transactional
    public DiagramCheckResultDto checkDiagram(
            Long attemptId, Long attemptQuestionId, DiagramCheckRequestDto request) {

        AssessmentAttempt attempt = requireOwnedAttempt(attemptId, request.learnerId());
        requireEditable(attempt);
        AssessmentAttemptQuestion question = requireAttemptQuestion(attempt, attemptQuestionId);
        if (!"CRITICAL_THINKING".equals(question.getQuestionType())) {
            throw new BusinessRuleException.InvalidAssessmentSubmissionException(
                    "This item is not a diagram question.");
        }

        // Persist the latest diagram before "checking" (spec requirement).
        upsertAnswers(attempt, List.of(new AttemptAnswerDraftDto(
                attemptQuestionId, null, null, null, null, request.diagramData())));

        // No diagram auto-grader yet — return the rubric as PENDING and never
        // expose the reference diagram or private evaluation logic.
        return new DiagramCheckResultDto(
                "PENDING",
                "Your diagram has been saved. It will be evaluated against the rubric "
                        + "after you submit the assessment.",
                readSnapshotRubric(question));
    }

    private List<RubricCriterionDto> readSnapshotRubric(AssessmentAttemptQuestion attemptQuestion) {
        try {
            if (attemptQuestion.getQuestionDataSnapshot() == null) {
                return List.of();
            }
            Map<String, Object> data = objectMapper.readValue(
                    attemptQuestion.getQuestionDataSnapshot(),
                    new TypeReference<Map<String, Object>>() {});
            return parseRubric(data);
        } catch (Exception e) {
            return List.of();
        }
    }

    private List<RubricCriterionDto> parseRubric(Map<String, Object> data) {
        List<RubricCriterionDto> rubric = new ArrayList<>();
        Object raw = data.get("rubric");
        if (raw instanceof List<?> list) {
            for (Object item : list) {
                if (item instanceof Map<?, ?> map) {
                    Object maxPoints = map.get("maxPoints");
                    rubric.add(new RubricCriterionDto(
                            (String) map.get("name"),
                            maxPoints == null ? null : new java.math.BigDecimal(maxPoints.toString()),
                            null,
                            null,
                            "PENDING"));
                }
            }
        }
        return rubric;
    }

    // ------------------------------------------------------------------
    // Programming Run / Check (executor stubbed — never fabricates a score)
    // ------------------------------------------------------------------

    @Transactional
    public ExecutionResultDto runProgramming(
            Long attemptId, Long attemptQuestionId, ProgrammingRunRequestDto request) {
        return executeProgramming(
                attemptId, attemptQuestionId, request, AssessmentAttemptExecution.Mode.RUN);
    }

    @Transactional
    public ExecutionResultDto checkProgramming(
            Long attemptId, Long attemptQuestionId, ProgrammingRunRequestDto request) {
        return executeProgramming(
                attemptId, attemptQuestionId, request, AssessmentAttemptExecution.Mode.CHECK);
    }

    private ExecutionResultDto executeProgramming(
            Long attemptId, Long attemptQuestionId,
            ProgrammingRunRequestDto request, AssessmentAttemptExecution.Mode mode) {

        AssessmentAttempt attempt = requireOwnedAttempt(attemptId, request.learnerId());
        requireEditable(attempt);
        AssessmentAttemptQuestion question = requireAttemptQuestion(attempt, attemptQuestionId);
        if (!"CRITICAL_THINKING".equals(question.getQuestionType())) {
            throw new BusinessRuleException.InvalidAssessmentSubmissionException(
                    "This item is not a programming question.");
        }

        // Run/Check always saves the current code first (spec requirement).
        upsertAnswers(attempt, List.of(new AttemptAnswerDraftDto(
                attemptQuestionId, null, null, request.code(), request.language(), null)));

        // No sandbox is wired yet — record the attempt with an UNAVAILABLE
        // status and never fabricate a pass/fail or score.
        List<LearnerTestCaseDto> tests = readSnapshotTestCases(question);
        Integer totalTests = tests.isEmpty() ? null : tests.size();
        LocalDateTime now = LocalDateTime.now();

        AssessmentAttemptExecution execution = executionRepository.save(
                AssessmentAttemptExecution.builder()
                        .attempt(attempt)
                        .attemptQuestion(question)
                        .mode(mode)
                        .language(request.language())
                        .submittedCode(request.code())
                        .status(AssessmentAttemptExecution.Status.UNAVAILABLE)
                        .passedTests(null)
                        .totalTests(totalTests)
                        .output(EXECUTION_UNAVAILABLE_MESSAGE)
                        .createdAt(now)
                        .build());

        // CHECK only reveals sample inputs; hidden expected outputs never leave
        // the server. All statuses stay NOT_RUN since nothing executed.
        return new ExecutionResultDto(
                execution.getExecutionId(),
                mode.name(),
                execution.getStatus().name(),
                EXECUTION_UNAVAILABLE_MESSAGE,
                request.language(),
                null,
                totalTests,
                now,
                tests);
    }

    @Transactional(readOnly = true)
    public List<ExecutionHistoryItemDto> listExecutions(
            Long attemptId, Long attemptQuestionId, Long learnerId) {
        AssessmentAttempt attempt = requireOwnedAttempt(attemptId, learnerId);
        requireAttemptQuestion(attempt, attemptQuestionId);
        return executionRepository
                .findByAttemptQuestion_AttemptQuestionIdOrderByCreatedAtDesc(
                        attemptQuestionId, PageRequest.of(0, MAX_EXECUTION_HISTORY))
                .stream()
                .map(execution -> new ExecutionHistoryItemDto(
                        execution.getExecutionId(),
                        execution.getMode().name(),
                        execution.getLanguage(),
                        execution.getStatus().name(),
                        execution.getPassedTests(),
                        execution.getTotalTests(),
                        execution.getCreatedAt()))
                .toList();
    }

    /** Reads the learner-safe test metadata already stored in the snapshot. */
    @SuppressWarnings("unchecked")
    private List<LearnerTestCaseDto> readSnapshotTestCases(AssessmentAttemptQuestion attemptQuestion) {
        try {
            if (attemptQuestion.getQuestionDataSnapshot() == null) {
                return List.of();
            }
            Map<String, Object> data = objectMapper.readValue(
                    attemptQuestion.getQuestionDataSnapshot(),
                    new TypeReference<Map<String, Object>>() {});
            return parseLearnerTestCases(data);
        } catch (Exception e) {
            return List.of();
        }
    }

    private List<LearnerTestCaseDto> parseLearnerTestCases(Map<String, Object> data) {
        List<LearnerTestCaseDto> tests = new ArrayList<>();
        Object raw = data.get("testCases");
        if (raw instanceof List<?> list) {
            for (Object item : list) {
                if (item instanceof Map<?, ?> map) {
                    Object indexValue = map.get("index");
                    tests.add(new LearnerTestCaseDto(
                            indexValue == null ? tests.size() + 1
                                    : Integer.parseInt(indexValue.toString()),
                            (String) map.get("label"),
                            Boolean.TRUE.equals(map.get("sample")),
                            (String) map.get("input"),
                            "NOT_RUN"));
                }
            }
        }
        return tests;
    }
}
