package com.capstone.rebyu.assessment.service;

import com.capstone.rebyu.assessment.dto.AddExamQuestionsRequest;
import com.capstone.rebyu.assessment.dto.ExamDto;
import com.capstone.rebyu.assessment.mapper.ExamMapper;
import com.capstone.rebyu.assessment.entity.Exam;
import com.capstone.rebyu.assessment.entity.ExamQuestion;
import com.capstone.rebyu.assessment.entity.ExamType;
import com.capstone.rebyu.assessment.entity.Question;
import com.capstone.rebyu.assessment.repository.ExamQuestionRepository;
import com.capstone.rebyu.assessment.repository.ExamRepository;
import com.capstone.rebyu.assessment.repository.ExamTypeRepository;
import com.capstone.rebyu.assessment.repository.QuestionRepository;
import com.capstone.rebyu.certification.entity.Certification;
import com.capstone.rebyu.certification.entity.Lesson;
import com.capstone.rebyu.certification.entity.MajorCategory;
import com.capstone.rebyu.certification.entity.MiddleCategory;
import com.capstone.rebyu.certification.repository.CertificationRepository;
import com.capstone.rebyu.certification.repository.LessonRepository;
import com.capstone.rebyu.certification.repository.MajorCategoryRepository;
import com.capstone.rebyu.certification.repository.MiddleCategoryRepository;
import com.capstone.rebyu.common.BusinessRuleException;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class ExamService {
    private final ExamRepository examRepository;
    private final ExamQuestionRepository examQuestionRepository;
    private final QuestionRepository questionRepository;
    private final ExamTypeRepository examTypeRepository;
    private final CertificationRepository certificationRepository;
    private final MajorCategoryRepository majorCategoryRepository;
    private final MiddleCategoryRepository middleCategoryRepository;
    private final LessonRepository lessonRepository;
    private final ExamMapper examMapper;

    public List<ExamDto> getAll() {
        log.debug("Fetching all exams");
        return examRepository.findAll().stream().map(this::toDtoWithQuestions).toList();
    }

    public ExamDto getById(Long id) {
        log.debug("Fetching exam id: {}", id);
        return toDtoWithQuestions(findEntity(id));
    }

    public ExamDto create(ExamDto dto) {
        log.info("Creating new exam");
        Exam entity = examMapper.toEntity(dto);
        entity.setExamId(null);
        normalizeForSave(entity, dto);
        if (entity.getStatus() == null) {
            entity.setStatus(Exam.Status.DRAFT);
        }
        entity.setUpdatedAt(LocalDateTime.now());
        Exam saved = examRepository.save(entity);
        if (dto.getQuestionIds() != null) {
            syncExamQuestions(saved, dto.getQuestionIds());
            saved.setTotalQuestions(dto.getQuestionIds().size());
            saved = examRepository.save(saved);
        }
        ExamDto result = toDtoWithQuestions(saved);
        log.info("Exam created with id: {}", result.getExamId());
        return result;
    }

    public ExamDto update(Long id, ExamDto dto) {
        log.info("Updating exam id: {}", id);
        Exam existing = findEntity(id);
        Exam entity = examMapper.toEntity(dto);
        entity.setExamId(id);
        normalizeForSave(entity, dto);
        // Lifecycle fields are managed via publish/archive, not the edit form.
        if (entity.getStatus() == null) {
            entity.setStatus(existing.getStatus());
        }
        entity.setPublishedAt(existing.getPublishedAt());
        entity.setUpdatedAt(LocalDateTime.now());
        Exam saved = examRepository.save(entity);
        if (dto.getQuestionIds() != null) {
            syncExamQuestions(saved, dto.getQuestionIds());
            saved.setTotalQuestions(dto.getQuestionIds().size());
            saved = examRepository.save(saved);
        }
        ExamDto result = toDtoWithQuestions(saved);
        log.info("Exam id: {} updated", id);
        return result;
    }

    public ExamDto publish(Long id) {
        Exam exam = findEntity(id);

        if (exam.getTitle() == null || exam.getTitle().isBlank()) {
            throw new BusinessRuleException.InvalidAssessmentSubmissionException(
                    "The assessment needs a title before it can be published.");
        }

        List<ExamQuestion> examQuestions =
                examQuestionRepository.findByExam_ExamIdOrderByDisplayOrderAsc(id);
        if (examQuestions.isEmpty()) {
            throw new BusinessRuleException.InvalidAssessmentSubmissionException(
                    "Add at least one question before publishing this assessment.");
        }

        Long certificationId = exam.getCertification().getCertificationId();
        for (ExamQuestion examQuestion : examQuestions) {
            Question question = examQuestion.getQuestion();
            Long questionCertId = question.getLesson()
                    .getMiddleCategory().getMajorCategory()
                    .getCertification().getCertificationId();
            if (!certificationId.equals(questionCertId)) {
                throw new BusinessRuleException.QuestionNotEligibleForAssessmentException();
            }
            if (exam.getLesson() != null
                    && !exam.getLesson().getLessonId()
                            .equals(question.getLesson().getLessonId())) {
                throw new BusinessRuleException.QuestionNotEligibleForAssessmentException();
            }
        }

        exam.setStatus(Exam.Status.PUBLISHED);
        exam.setPublishedAt(LocalDateTime.now());
        exam.setUpdatedAt(LocalDateTime.now());
        log.info("Exam id: {} published with {} question(s)", id, examQuestions.size());
        return toDtoWithQuestions(examRepository.save(exam));
    }

    public void delete(Long id) {
        log.info("Deleting exam id: {}", id);
        examRepository.delete(findEntity(id));
        log.info("Exam id: {} deleted", id);
    }

    public ExamDto archive(Long id) {
        Exam exam = findEntity(id);
        exam.setStatus(Exam.Status.ARCHIVED);
        exam.setUpdatedAt(LocalDateTime.now());
        log.info("Exam id: {} archived", id);
        return toDtoWithQuestions(examRepository.save(exam));
    }

    /**
     * Adds questions to an assessment with per-question points and display order
     * (spec §18). Rejects duplicates, already-assigned questions, sub-questions,
     * and questions outside the assessment's certification. Transactional.
     */
    public ExamDto addQuestions(Long examId, AddExamQuestionsRequest request) {
        Exam exam = findEntity(examId);

        Set<Long> requestedIds = new LinkedHashSet<>();
        for (AddExamQuestionsRequest.Item item : request.questions()) {
            if (!requestedIds.add(item.questionId())) {
                throw new BusinessRuleException.InvalidAssessmentSubmissionException(
                        "The same question cannot be added more than once.");
            }
        }

        List<ExamQuestion> existing =
                examQuestionRepository.findByExam_ExamIdOrderByDisplayOrderAsc(examId);
        Set<Long> assigned = existing.stream()
                .map(examQuestion -> examQuestion.getQuestion().getQuestionId())
                .collect(Collectors.toSet());
        int nextOrder = existing.stream()
                .map(ExamQuestion::getDisplayOrder)
                .filter(Objects::nonNull)
                .max(Integer::compareTo)
                .orElse(0) + 1;

        List<Question> questions = questionRepository.findAllById(requestedIds);
        if (questions.size() != requestedIds.size()) {
            throw new BusinessRuleException.InvalidAssessmentSubmissionException(
                    "One or more selected questions no longer exist.");
        }
        Map<Long, Question> questionById = questions.stream()
                .collect(Collectors.toMap(Question::getQuestionId, question -> question));

        Long certificationId = exam.getCertification().getCertificationId();
        for (AddExamQuestionsRequest.Item item : request.questions()) {
            if (assigned.contains(item.questionId())) {
                throw new BusinessRuleException.InvalidAssessmentSubmissionException(
                        "A selected question is already assigned to this assessment.");
            }
            Question question = questionById.get(item.questionId());
            if (question.getParentQuestion() != null) {
                throw new BusinessRuleException.InvalidAssessmentSubmissionException(
                        "Sub-questions are included with their parent and cannot be added directly.");
            }
            Long questionCertId = question.getLesson()
                    .getMiddleCategory().getMajorCategory()
                    .getCertification().getCertificationId();
            if (!certificationId.equals(questionCertId)) {
                throw new BusinessRuleException.QuestionNotEligibleForAssessmentException();
            }
            int order = item.displayOrder() != null ? item.displayOrder() : nextOrder++;
            examQuestionRepository.save(ExamQuestion.builder()
                    .exam(exam)
                    .question(question)
                    .displayOrder(order)
                    .points(item.points())
                    .build());
        }

        exam.setTotalQuestions((int) examQuestionRepository.countByExam_ExamId(examId));
        exam.setUpdatedAt(LocalDateTime.now());
        examRepository.save(exam);
        return toDtoWithQuestions(exam);
    }

    private Exam findEntity(Long id) {
        return examRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Exam not found: " + id));
    }

    private ExamDto toDtoWithQuestions(Exam exam) {
        ExamDto dto = examMapper.toDto(exam);
        List<Long> questionIds = examQuestionRepository
                .findByExam_ExamIdOrderByDisplayOrderAsc(exam.getExamId())
                .stream()
                .map(examQuestion -> examQuestion.getQuestion().getQuestionId())
                .toList();
        dto.setQuestionIds(questionIds);
        return dto;
    }

    private void normalizeForSave(Exam entity, ExamDto dto) {
        if (dto.getQuestionIds() != null) {
            entity.setTotalQuestions(dto.getQuestionIds().size());
        } else if (entity.getTotalQuestions() == null) {
            entity.setTotalQuestions(0);
        }

        if (entity.getPassingScore() == null) {
            entity.setPassingScore(new BigDecimal("70.00"));
        }

        // The title is always derived from the scope + type on the server; a
        // title submitted by the frontend is never trusted.
        String generated = generateTitle(dto);
        if (generated != null) {
            entity.setTitle(generated);
        }
    }

    /**
     * Derives the read-only assessment title from its curriculum scope and type,
     * e.g. "{lesson} Quiz", "{middle} Middle Exam", "{major} Major Exam",
     * "{certification} Diagnostic Exam"/"Mock Exam". Returns null when the scope
     * cannot be resolved, leaving whatever title the entity already carries.
     */
    private String generateTitle(ExamDto dto) {
        String scope = dto.getTargetScope();
        if ("LESSON".equals(scope) && dto.getLessonId() != null) {
            return lessonRepository.findById(dto.getLessonId())
                    .map(Lesson::getName).map(name -> name + " Quiz").orElse(null);
        }
        if ("MIDDLE_CATEGORY".equals(scope) && dto.getMiddleCategoryId() != null) {
            return middleCategoryRepository.findById(dto.getMiddleCategoryId())
                    .map(MiddleCategory::getTitle).map(title -> title + " Middle Exam").orElse(null);
        }
        if ("MAJOR_CATEGORY".equals(scope) && dto.getMajorCategoryId() != null) {
            return majorCategoryRepository.findById(dto.getMajorCategoryId())
                    .map(MajorCategory::getTitle).map(title -> title + " Major Exam").orElse(null);
        }
        // Certification scope: the exam type distinguishes diagnostic vs mock.
        if (dto.getCertificationId() != null) {
            String certTitle = certificationRepository.findById(dto.getCertificationId())
                    .map(Certification::getTitle).orElse(null);
            if (certTitle == null) {
                return null;
            }
            String typeText = dto.getExamTypeId() == null ? "" : examTypeRepository
                    .findById(dto.getExamTypeId()).map(ExamType::getExamTypeText).orElse("");
            String upper = typeText.toUpperCase(java.util.Locale.ROOT);
            if (upper.contains("MOCK")) {
                return certTitle + " Mock Exam";
            }
            if (upper.contains("DIAGNOSTIC")) {
                return certTitle + " Diagnostic Exam";
            }
            return null; // non-cert-scoped type with no category scope — leave as-is
        }
        return null;
    }

    /**
     * Rebuilds the exam's question records from the admin's selection. Only the
     * selected (parent/standalone) questions become exam_questions rows — a
     * parent's sub-questions travel with it via the snapshot at attempt time,
     * so they must NOT be added here as separate standalone items.
     */
    private void syncExamQuestions(Exam exam, List<Long> questionIds) {
        List<Long> orderedQuestionIds = new ArrayList<>(questionIds);
        Set<Long> uniqueQuestionIds = new LinkedHashSet<>(orderedQuestionIds);
        if (uniqueQuestionIds.size() != orderedQuestionIds.size()) {
            throw new BusinessRuleException.InvalidAssessmentSubmissionException(
                    "The same question cannot be added to an assessment more than once.");
        }

        // Reject sub-questions selected on their own: they can only enter an
        // assessment grouped under their parent, never as standalone items.
        List<Question> questions = questionRepository.findAllById(orderedQuestionIds);
        if (questions.size() != orderedQuestionIds.size()) {
            throw new BusinessRuleException.InvalidAssessmentSubmissionException(
                    "One or more selected questions no longer exist.");
        }
        Map<Long, Question> questionById = questions.stream()
                .collect(Collectors.toMap(Question::getQuestionId, question -> question));

        Long certificationId = exam.getCertification().getCertificationId();
        Long lessonId = exam.getLesson() == null ? null : exam.getLesson().getLessonId();

        for (Long questionId : orderedQuestionIds) {
            Question question = questionById.get(questionId);
            if (question.getParentQuestion() != null) {
                throw new BusinessRuleException.InvalidAssessmentSubmissionException(
                        "Sub-questions are included automatically with their parent question "
                                + "and cannot be added on their own.");
            }
            Long questionCertId = question.getLesson()
                    .getMiddleCategory().getMajorCategory()
                    .getCertification().getCertificationId();
            if (!certificationId.equals(questionCertId)) {
                throw new BusinessRuleException.QuestionNotEligibleForAssessmentException();
            }
            if (lessonId != null && !lessonId.equals(question.getLesson().getLessonId())) {
                throw new BusinessRuleException.QuestionNotEligibleForAssessmentException();
            }
        }

        examQuestionRepository.deleteByExam_ExamId(exam.getExamId());
        int displayOrder = 1;
        for (Long questionId : orderedQuestionIds) {
            examQuestionRepository.save(ExamQuestion.builder()
                    .exam(exam)
                    .question(questionById.get(questionId))
                    .displayOrder(displayOrder++)
                    .build());
        }
    }
}
