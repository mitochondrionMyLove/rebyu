package com.capstone.rebyu.assessment.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuestionDto {
    private Long questionId;

    @NotBlank
    @Size(max = 30)
    private String questionType;

    @NotBlank
    @Size(max = 10)
    private String difficultyLevel;

    @NotBlank
    private String questionText;

    @Size(max = 255)
    private String imageKey;

    @NotNull
    private Long lessonId;

    private List<ChoiceDto> choices;
}
