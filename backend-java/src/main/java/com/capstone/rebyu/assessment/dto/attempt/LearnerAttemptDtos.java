package com.capstone.rebyu.assessment.dto.attempt;

import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * Learner-safe attempt DTOs. Nothing in this file may ever carry a correct
 * answer, correct-choice flag, rubric, reference diagram, or authoring note
 * before submission.
 */
public final class LearnerAttemptDtos {

    private LearnerAttemptDtos() {
    }

    public record LearnerAssessmentDto(
            Long assessmentId,
            String title,
            String assessmentType,
            String description,
            String instructions,
            Integer durationMinutes,
            Integer totalItems,
            BigDecimal passingScore,
            Boolean canStart,
            String lockReason
    ) {
    }

    public record LearnerChoiceDto(
            Long choiceId,
            String choiceText,
            String imageKey
    ) {
    }

    public record LearnerSubQuestionDto(
            Long subQuestionId,
            String questionText
    ) {
    }

    public record LearnerAttemptQuestionDto(
            Long attemptQuestionId,
            Integer displayOrder,
            String questionType,
            String criticalThinkingType,
            String question,
            String questionImageKey,
            List<LearnerChoiceDto> choices,
            String starterCode,
            String diagramType,
            String instructions,
            List<LearnerSubQuestionDto> subQuestions,
            BigDecimal points,
            List<ProgrammingAttemptDtos.LearnerTestCaseDto> testCases,
            List<DiagramAttemptDtos.RubricCriterionDto> rubric
    ) {
    }

    public record AssessmentAttemptStartRequestDto(
            @NotNull Long learnerId,
            String idempotencyKey
    ) {
    }

    public record AssessmentAttemptStartResponseDto(
            Long assessmentAttemptId,
            Long assessmentId,
            String assessmentTitle,
            String assessmentType,
            Integer attemptNumber,
            LocalDateTime startedAt,
            LocalDateTime expiresAt,
            boolean resumed,
            List<LearnerAttemptQuestionDto> questions,
            Map<Long, AttemptAnswerDraftDto> savedAnswers,
            Long currentAttemptQuestionId,
            List<Long> flaggedAttemptQuestionIds,
            List<Long> skippedAttemptQuestionIds
    ) {
    }

    public record FlagRequestDto(
            @NotNull Long learnerId,
            boolean flagged
    ) {
    }

    public record SkipRequestDto(
            @NotNull Long learnerId,
            boolean skipped
    ) {
    }

    public record CurrentItemRequestDto(
            @NotNull Long learnerId,
            @NotNull Long attemptQuestionId
    ) {
    }

    public record AttemptAnswerDraftDto(
            Long attemptQuestionId,
            String learnerAnswer,
            Long selectedChoiceId,
            String submittedCode,
            String programmingLanguage,
            String diagramSubmissionData
    ) {
    }

    public record AutosaveAnswersRequestDto(
            @NotNull Long learnerId,
            List<AttemptAnswerDraftDto> answers
    ) {
    }

    public record SubmitAssessmentAttemptRequestDto(
            @NotNull Long learnerId,
            List<AttemptAnswerDraftDto> answers
    ) {
    }

    public record AttemptAnswerReviewDto(
            Long attemptQuestionId,
            Integer displayOrder,
            String questionType,
            String question,
            Boolean isCorrect,
            boolean pendingManualEvaluation,
            BigDecimal earnedPoints,
            BigDecimal points,
            String learnerAnswer,
            Long selectedChoiceId,
            String selectedChoiceText,
            String correctChoiceText,
            String explanation,
            String submittedCode,
            String programmingLanguage,
            boolean diagramSubmitted
    ) {
    }

    public record LessonPerformanceDto(
            Long lessonId,
            String lessonTitle,
            BigDecimal possiblePoints,
            BigDecimal earnedPoints,
            BigDecimal percentage,
            Integer pendingCount
    ) {
    }

    public record AssessmentAttemptResultDto(
            Long assessmentAttemptId,
            Long assessmentId,
            String assessmentTitle,
            String assessmentType,
            Integer attemptNumber,
            LocalDateTime submittedAt,
            Integer durationSeconds,
            BigDecimal percentage,
            Boolean passed,
            BigDecimal passingScore,
            BigDecimal totalPoints,
            BigDecimal earnedPoints,
            Integer correctCount,
            Integer incorrectCount,
            Integer pendingCount,
            Integer unansweredCount,
            List<AttemptAnswerReviewDto> answers,
            List<LessonPerformanceDto> lessonBreakdown
    ) {
    }
}
