package com.capstone.rebyu.assessment.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LearnerProgrammingAnswerDto {
    private Long learnerProgrammingAnswerId;

    @NotNull
    private Long learnerExamDetailId;

    @NotBlank
    @Size(max = 30)
    private String programmingLanguage;

    @NotBlank
    private String submittedCode;
}
