package com.capstone.rebyu.assessment.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

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
}
