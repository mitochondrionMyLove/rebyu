package com.capstone.rebyu.assessment.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExamChoiceDto {
    @NotNull
    private Long examQuestionId;

    @NotNull
    private Long choiceId;

    @NotNull
    @Min(1)
    private Integer displayOrder;
}
