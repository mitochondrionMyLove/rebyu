package com.capstone.rebyu.execution.dto;

import java.util.List;

/** One code-execution request: a learner's source against a set of test cases. */
public record CodeExecutionRequestDto(
        String language,
        String sourceCode,
        List<TestCaseInputDto> testCases
) {
    public record TestCaseInputDto(
            int index,
            boolean sample,
            String inputData,
            String expectedOutput
    ) {}
}
