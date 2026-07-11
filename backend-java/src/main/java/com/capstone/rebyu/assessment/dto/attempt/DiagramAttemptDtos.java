package com.capstone.rebyu.assessment.dto.attempt;

import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.List;

/**
 * Learner-safe diagram Check DTOs. Never carry the reference diagram or the
 * private evaluation logic; awarded points appear only after evaluation.
 */
public final class DiagramAttemptDtos {

    private DiagramAttemptDtos() {
    }

    public record DiagramCheckRequestDto(
            @NotNull Long learnerId,
            String diagramData,
            String diagramType
    ) {
    }

    /** One rubric line. `awardedPoints`/`feedback` stay null until evaluated. */
    public record RubricCriterionDto(
            String name,
            BigDecimal maxPoints,
            BigDecimal awardedPoints,
            String feedback,
            String status
    ) {
    }

    public record DiagramCheckResultDto(
            String status,
            String message,
            List<RubricCriterionDto> rubric
    ) {
    }
}
