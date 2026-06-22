package com.capstone.rebyu.dto;

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
}
