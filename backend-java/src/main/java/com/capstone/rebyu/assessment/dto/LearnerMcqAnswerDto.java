package com.capstone.rebyu.assessment.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LearnerMcqAnswerDto {
    private Long learnerMcqAnswerId;

    @NotNull
    private Long learnerExamDetailId;

    @NotNull
    private Long choiceId;
}
