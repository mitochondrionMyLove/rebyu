package com.capstone.rebyu.bkt.service;

import com.capstone.rebyu.assessment.entity.AssessmentAttempt;
import com.capstone.rebyu.assessment.entity.AssessmentAttemptAnswer;
import com.capstone.rebyu.assessment.entity.AssessmentAttemptQuestion;
import com.capstone.rebyu.assessment.entity.Question;
import com.capstone.rebyu.bkt.config.BktProperties;
import com.capstone.rebyu.bkt.dto.BktMasteryEvent;
import com.capstone.rebyu.certification.entity.Lesson;
import com.capstone.rebyu.certification.entity.MajorCategory;
import com.capstone.rebyu.certification.entity.MiddleCategory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Set;

/**
 * Builds deterministic, contract-shaped BKT evidence events from a submitted
 * attempt. Every question updates only its own mapped lesson; the overall exam
 * score is never applied across lessons.
 */
@RequiredArgsConstructor
@Component
public class BktEventFactory {

    private final BktProperties properties;

    /** FastAPI accepts exactly these guess/slip classes. */
    private static final Set<String> KNOWN_DIFFICULTY = Set.of("EASY", "AVERAGE", "HARD");

    /** FastAPI accepts exactly these learn/forget classes. */
    private static final Set<String> KNOWN_ASSESSMENT = Set.of(
            "DIAGNOSTIC", "LESSON_QUIZ", "MIDDLE_EXAM", "MOCK_EXAM");

    /** Maps the project's exam-type vocabulary onto the FastAPI class set. */
    private static final Map<String, String> ASSESSMENT_ALIASES = Map.ofEntries(
            Map.entry("DIAGNOSTIC", "DIAGNOSTIC"),
            Map.entry("DIAGNOSTIC_EXAM", "DIAGNOSTIC"),
            Map.entry("QUIZ", "LESSON_QUIZ"),
            Map.entry("LESSON_QUIZ", "LESSON_QUIZ"),
            Map.entry("PRACTICE", "LESSON_QUIZ"),
            Map.entry("REVIEW", "LESSON_QUIZ"),
            Map.entry("BATTLE", "LESSON_QUIZ"),
            Map.entry("CHALLENGE", "LESSON_QUIZ"),
            Map.entry("CUSTOM", "LESSON_QUIZ"),
            Map.entry("MODULE_EXAM", "MIDDLE_EXAM"),
            Map.entry("MIDDLE_EXAM", "MIDDLE_EXAM"),
            Map.entry("MIDDLE_CATEGORY_QUIZ", "MIDDLE_EXAM"),
            Map.entry("MAJOR_EXAM", "MOCK_EXAM"),
            Map.entry("MAJOR_CATEGORY_QUIZ", "MOCK_EXAM"),
            Map.entry("MOCK", "MOCK_EXAM"),
            Map.entry("MOCK_EXAM", "MOCK_EXAM"));

    /**
     * Deterministic event identity. {@code attemptId} already encodes learner +
     * exam + attempt number; combined with the attempt-question id and a grade
     * version it is stable across retries and re-enqueues.
     */
    public String buildEventId(Long attemptId, Long attemptQuestionId, int gradeVersion) {
        return "rebyu-attempt:" + attemptId + ":" + attemptQuestionId + ":v" + gradeVersion;
    }

    /**
     * Builds a final evidence event for one graded answer, or {@code null} when
     * the answer must not become evidence (unanswered, pending manual grading,
     * missing lesson mapping, or non-final grade).
     */
    public BktMasteryEvent buildEvent(
            AssessmentAttempt attempt,
            AssessmentAttemptQuestion question,
            AssessmentAttemptAnswer answer,
            Question sourceQuestion,
            Long certificationId,
            String rawAssessmentType) {

        if (answer == null || answer.isPendingManualEvaluation()) {
            return null; // grading pending or unanswered -> not final evidence
        }
        Long lessonId = question.getLessonId();
        if (lessonId == null) {
            return null; // cannot attribute evidence without a lesson mapping
        }

        boolean correct = resolveCorrectness(answer, question.getPoints());
        String occurredAt = (answer.getAnsweredAt() != null
                ? answer.getAnsweredAt() : LocalDateTime.now()).toString();

        // Resolve the curriculum path (lesson -> middle -> major) so FastAPI can
        // aggregate priorities without touching the curriculum tables.
        String rawDifficulty = null;
        String lessonTitle = null;
        Long middleCategoryId = null;
        String middleCategoryTitle = null;
        Long majorCategoryId = null;
        String majorCategoryTitle = null;
        if (sourceQuestion != null) {
            rawDifficulty = sourceQuestion.getDifficultyLevel();
            Lesson lesson = sourceQuestion.getLesson();
            if (lesson != null) {
                lessonTitle = lesson.getName();
                MiddleCategory middle = lesson.getMiddleCategory();
                if (middle != null) {
                    middleCategoryId = middle.getMiddleCategoryId();
                    middleCategoryTitle = middle.getTitle();
                    MajorCategory major = middle.getMajorCategory();
                    if (major != null) {
                        majorCategoryId = major.getMajorCategoryId();
                        majorCategoryTitle = major.getTitle();
                    }
                }
            }
        }

        return new BktMasteryEvent(
                buildEventId(attempt.getAssessmentAttemptId(), question.getAttemptQuestionId(), 1),
                attempt.getLearnerId(),
                certificationId,
                majorCategoryId,
                middleCategoryId,
                lessonId,
                lessonTitle,
                middleCategoryTitle,
                majorCategoryTitle,
                question.getSourceQuestionId(),
                correct,
                normalizeDifficulty(rawDifficulty),
                normalizeAssessmentType(rawAssessmentType),
                occurredAt);
    }

    /**
     * Objective answers carry an explicit {@code isCorrect}. Partial-credit
     * answers convert via the configurable awarded/max threshold. Never divides
     * by zero.
     */
    private boolean resolveCorrectness(AssessmentAttemptAnswer answer, BigDecimal maxPoints) {
        if (answer.getIsCorrect() != null) {
            return Boolean.TRUE.equals(answer.getIsCorrect());
        }
        BigDecimal earned = answer.getEarnedPoints();
        if (earned == null || maxPoints == null || maxPoints.signum() <= 0) {
            return false;
        }
        double ratio = earned.doubleValue() / maxPoints.doubleValue();
        return ratio >= properties.getPartialCreditCorrectThreshold();
    }

    /** Normalizes a raw difficulty string to a known guess/slip class. */
    public String normalizeDifficulty(String rawDifficulty) {
        if (rawDifficulty == null) {
            return properties.getFallbackDifficulty();
        }
        String value = rawDifficulty.trim().toUpperCase().replace("-", "_").replace(" ", "_");
        return KNOWN_DIFFICULTY.contains(value) ? value : properties.getFallbackDifficulty();
    }

    /** Normalizes a raw exam-type string to a known learn/forget class. */
    public String normalizeAssessmentType(String rawAssessmentType) {
        if (rawAssessmentType == null) {
            return properties.getFallbackAssessmentType();
        }
        String value = rawAssessmentType.trim().toUpperCase().replace("-", "_").replace(" ", "_");
        String mapped = ASSESSMENT_ALIASES.get(value);
        if (mapped != null) {
            return mapped;
        }
        return KNOWN_ASSESSMENT.contains(value) ? value : properties.getFallbackAssessmentType();
    }
}
