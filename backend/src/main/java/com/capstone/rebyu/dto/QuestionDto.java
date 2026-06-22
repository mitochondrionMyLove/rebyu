package com.capstone.rebyu.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuestionDto {
    private Long questionId;

    @NotNull
    private Long questionTypeId;

    @NotNull
    private Long difficultyLevelId;

    @NotBlank
    private String questionText;

    @Size(max = 255)
    private String imageKey;

    private boolean hasNoChoices = false;

    @NotNull
    private Long lessonId;
}
