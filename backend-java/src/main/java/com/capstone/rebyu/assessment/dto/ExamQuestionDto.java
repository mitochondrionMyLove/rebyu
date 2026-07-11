package com.capstone.rebyu.assessment.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExamQuestionDto {
    private Long examQuestionId;

    @NotNull
    private Long examId;

    @NotNull
    private Long questionId;

    @NotNull
    @Min(1)
    private Integer displayOrder;

    // Optional per-assessment point value; null means use the question's default.
    @DecimalMin("0.0")
    private BigDecimal points;
}
