package com.capstone.rebyu.assessment.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SubQuestionDto {
    private Long subQuestionId;

    @NotNull
    private Long noChoiceQuestionId;

    @NotBlank
    private String questionText;
}
