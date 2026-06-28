package com.capstone.rebyu.assessment.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

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

    @NotBlank
    private String explanation;

    @NotBlank
    @Size(max = 10)
    private String difficultyLevel;

    @NotBlank
    @Size(max = 30)
    private String questionType;

    private List<SubQuestionDto> subQuestions;
}
