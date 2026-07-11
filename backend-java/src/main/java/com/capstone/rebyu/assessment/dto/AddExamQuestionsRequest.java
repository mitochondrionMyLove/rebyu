package com.capstone.rebyu.assessment.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.List;

/**
 * Adds questions to an assessment with their per-question points and order
 * (spec §18). Points must be greater than zero; the backend validates scope,
 * duplicates, and already-assigned questions.
 */
public record AddExamQuestionsRequest(
        @NotEmpty @Valid List<Item> questions
) {
    public record Item(
            @NotNull Long questionId,
            @NotNull @DecimalMin(value = "0.0", inclusive = false) BigDecimal points,
            Integer displayOrder
    ) {
    }
}
