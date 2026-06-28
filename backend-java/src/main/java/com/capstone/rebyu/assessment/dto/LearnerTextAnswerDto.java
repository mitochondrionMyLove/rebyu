package com.capstone.rebyu.assessment.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LearnerTextAnswerDto {
    private Long learnerTextAnswerId;

    @NotNull
    private Long learnerExamDetailId;

    @NotBlank
    private String answerText;
}
