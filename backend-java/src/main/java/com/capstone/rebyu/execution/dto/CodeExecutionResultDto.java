package com.capstone.rebyu.execution.dto;

import java.util.List;

/**
 * Deterministic, non-AI code-execution result. {@code status} is one of
 * COMPLETED (ran; check testResults for pass/fail), COMPILE_ERROR,
 * RUNTIME_ERROR, TIME_LIMIT_EXCEEDED, UNSUPPORTED_LANGUAGE, or UNAVAILABLE
 * (Judge0 unreachable — never a fabricated result).
 */
public record CodeExecutionResultDto(
        String status,
        String output,
        String error,
        Long executionTimeMs,
        Long memoryKb,
        Integer passedTests,
        Integer totalTests,
        List<TestCaseResultDto> testResults
) {
    public record TestCaseResultDto(
            int index,
            boolean sample,
            boolean passed,
            String status,
            String actualOutput
    ) {}
}
