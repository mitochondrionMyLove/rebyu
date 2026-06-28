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
public class CodingTestCaseDto {
    private Long codingTestCaseId;

    @NotNull
    private Long noChoiceQuestionId;

    @NotBlank
    @Size(max = 100)
    private String testCase;
}
