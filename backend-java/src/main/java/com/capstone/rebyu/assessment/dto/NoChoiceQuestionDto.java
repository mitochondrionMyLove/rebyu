package com.capstone.rebyu.assessment.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NoChoiceQuestionDto {
    private Long noChoiceQuestionId;

    @NotBlank
    private String questionText;

    @NotBlank
    private String answerText;

    @Size(max = 255)
    private String imageKey;

    private String explanation;
}
