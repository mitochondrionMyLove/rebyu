package com.capstone.rebyu.assessment.dto.attempt;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Learner-safe programming Run/Check DTOs. Never carry expected outputs for
 * hidden test cases, and never carry a fabricated score.
 */
public final class ProgrammingAttemptDtos {

    private ProgrammingAttemptDtos() {
    }

    public record ProgrammingRunRequestDto(
            @NotNull Long learnerId,
            String code,
            String language
    ) {
    }

    /** One test case as the learner may see it. `input` is null for hidden cases. */
    public record LearnerTestCaseDto(
            int index,
            String label,
            boolean sample,
            String input,
            String status
    ) {
    }

    public record ExecutionResultDto(
            Long executionId,
            String mode,
            String status,
            String message,
            String language,
            Integer passedTests,
            Integer totalTests,
            LocalDateTime createdAt,
            List<LearnerTestCaseDto> tests
    ) {
    }

    public record ExecutionHistoryItemDto(
            Long executionId,
            String mode,
            String language,
            String status,
            Integer passedTests,
            Integer totalTests,
            LocalDateTime createdAt
    ) {
    }
}
