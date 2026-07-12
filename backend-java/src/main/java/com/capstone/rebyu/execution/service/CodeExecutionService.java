package com.capstone.rebyu.execution.service;

import com.capstone.rebyu.execution.client.Judge0Client;
import com.capstone.rebyu.execution.client.Judge0ServiceException;
import com.capstone.rebyu.execution.config.Judge0Properties;
import com.capstone.rebyu.execution.dto.CodeExecutionRequestDto;
import com.capstone.rebyu.execution.dto.CodeExecutionRequestDto.TestCaseInputDto;
import com.capstone.rebyu.execution.dto.CodeExecutionResultDto;
import com.capstone.rebyu.execution.dto.CodeExecutionResultDto.TestCaseResultDto;
import com.capstone.rebyu.execution.dto.Judge0SubmissionRequestDto;
import com.capstone.rebyu.execution.dto.Judge0SubmissionResultDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Locale;
import java.util.Map;

/**
 * Deterministic, non-AI programming grader: runs a learner's code through
 * Judge0 for each test case and compares stdout to the expected output
 * exactly (trailing-whitespace tolerant). Never invents a result — Judge0
 * failures/unavailability surface as status UNAVAILABLE.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class CodeExecutionService {

    // Stable Judge0 CE language ids for the languages this project offers.
    private static final Map<String, Integer> LANGUAGE_IDS = Map.of(
            "C", 50,
            "C++", 54,
            "JAVA", 62,
            "JAVASCRIPT", 63,
            "PYTHON", 71,
            "C#", 51,
            "SQL", 82
    );

    private static final int STATUS_COMPILATION_ERROR = 6;
    private static final int STATUS_TIME_LIMIT_EXCEEDED = 5;
    private static final int STATUS_ACCEPTED_THRESHOLD = 4; // >=4 means Judge0 itself flagged an issue

    private final Judge0Client judge0Client;
    private final Judge0Properties properties;

    public CodeExecutionResultDto execute(CodeExecutionRequestDto request) {
        Integer languageId = resolveLanguageId(request.language());
        if (languageId == null) {
            return new CodeExecutionResultDto(
                    "UNSUPPORTED_LANGUAGE",
                    null,
                    "\"" + request.language() + "\" cannot be executed automatically.",
                    null, null, null, null, List.of());
        }
        if (!properties.isEnabled()) {
            return unavailable("Code execution is temporarily disabled.");
        }

        List<TestCaseInputDto> testCases = request.testCases() == null || request.testCases().isEmpty()
                ? List.of(new TestCaseInputDto(1, true, "", null))
                : request.testCases();

        List<Judge0SubmissionRequestDto> submissions = new ArrayList<>();
        for (TestCaseInputDto testCase : testCases) {
            submissions.add(new Judge0SubmissionRequestDto(
                    encode(request.sourceCode()),
                    languageId,
                    encode(testCase.inputData()),
                    properties.getCpuTimeLimitSeconds(),
                    properties.getMemoryLimitKb()));
        }

        List<Judge0SubmissionResultDto> results;
        try {
            results = judge0Client.submitBatch(submissions);
        } catch (Judge0ServiceException e) {
            log.warn("Judge0 execution failed: {}", e.getMessage());
            return unavailable("Code execution is temporarily unavailable. Please try again shortly.");
        }
        if (results.size() != testCases.size()) {
            log.warn("Judge0 returned {} result(s) for {} submitted test case(s)",
                    results.size(), testCases.size());
            return unavailable("Code execution returned an unexpected response. Please try again.");
        }

        return aggregate(testCases, results, request.testCases() == null || request.testCases().isEmpty());
    }

    private CodeExecutionResultDto aggregate(
            List<TestCaseInputDto> testCases,
            List<Judge0SubmissionResultDto> results,
            boolean syntheticSingleRun) {

        List<TestCaseResultDto> testResults = new ArrayList<>();
        int passed = 0;
        long maxTimeMs = 0;
        long maxMemoryKb = 0;
        String firstCompileError = null;
        String firstRuntimeError = null;
        String firstOutput = null;

        for (int i = 0; i < testCases.size(); i++) {
            TestCaseInputDto testCase = testCases.get(i);
            Judge0SubmissionResultDto result = results.get(i);
            int statusId = result.status() == null ? -1 : result.status().id();
            String stdout = decode(result.stdout());
            String compileOutput = decode(result.compileOutput());
            String stderr = decode(result.stderr());
            String message = decode(result.message());

            if (firstOutput == null && stdout != null && !stdout.isBlank()) {
                firstOutput = stdout;
            }

            long timeMs = parseSecondsToMillis(result.time());
            maxTimeMs = Math.max(maxTimeMs, timeMs);
            if (result.memory() != null) {
                maxMemoryKb = Math.max(maxMemoryKb, result.memory());
            }

            if (statusId == STATUS_COMPILATION_ERROR) {
                if (firstCompileError == null) {
                    firstCompileError = compileOutput != null && !compileOutput.isBlank()
                            ? compileOutput : "Compilation failed.";
                }
                testResults.add(new TestCaseResultDto(
                        testCase.index(), testCase.sample(), false, "COMPILE_ERROR", null));
                continue;
            }

            if (statusId == STATUS_TIME_LIMIT_EXCEEDED) {
                testResults.add(new TestCaseResultDto(
                        testCase.index(), testCase.sample(), false, "TIME_LIMIT_EXCEEDED", null));
                continue;
            }

            if (statusId >= STATUS_ACCEPTED_THRESHOLD) {
                // Runtime error, internal error, or exec-format error.
                if (firstRuntimeError == null) {
                    firstRuntimeError = firstNonBlank(stderr, message,
                            result.status() == null ? "Runtime error." : result.status().description());
                }
                testResults.add(new TestCaseResultDto(
                        testCase.index(), testCase.sample(), false, "RUNTIME_ERROR", null));
                continue;
            }

            // statusId 1-3: queued/processing/accepted — with wait=true this is
            // always a completed run by the time we read it, so compare stdout.
            boolean testPassed = testCase.expectedOutput() == null
                    || stripTrailingWhitespace(stdout).equals(stripTrailingWhitespace(testCase.expectedOutput()));
            if (testPassed) passed++;
            testResults.add(new TestCaseResultDto(
                    testCase.index(), testCase.sample(), testPassed,
                    testPassed ? "PASSED" : "FAILED", stdout));
        }

        if (firstCompileError != null) {
            return new CodeExecutionResultDto(
                    "COMPILE_ERROR", null, firstCompileError,
                    maxTimeMs, maxMemoryKb, 0, testCases.size(), testResults);
        }

        Integer totalTests = syntheticSingleRun ? null : testCases.size();
        Integer passedTests = syntheticSingleRun ? null : passed;
        return new CodeExecutionResultDto(
                "COMPLETED",
                firstOutput,
                firstRuntimeError,
                maxTimeMs,
                maxMemoryKb,
                passedTests,
                totalTests,
                syntheticSingleRun ? List.of() : testResults);
    }

    private CodeExecutionResultDto unavailable(String message) {
        return new CodeExecutionResultDto(
                "UNAVAILABLE", null, message, null, null, null, null, List.of());
    }

    private Integer resolveLanguageId(String language) {
        if (language == null) return null;
        return LANGUAGE_IDS.get(language.trim().toUpperCase(Locale.ROOT));
    }

    private String encode(String value) {
        if (value == null) value = "";
        return Base64.getEncoder().encodeToString(value.getBytes(StandardCharsets.UTF_8));
    }

    private String decode(String base64) {
        if (base64 == null || base64.isBlank()) return null;
        try {
            return new String(Base64.getDecoder().decode(base64), StandardCharsets.UTF_8);
        } catch (IllegalArgumentException e) {
            return base64;
        }
    }

    private String stripTrailingWhitespace(String value) {
        if (value == null) return "";
        return value.replace("\r\n", "\n").replaceAll("\\s+$", "");
    }

    private long parseSecondsToMillis(String seconds) {
        if (seconds == null || seconds.isBlank()) return 0;
        try {
            return Math.round(Double.parseDouble(seconds) * 1000);
        } catch (NumberFormatException e) {
            return 0;
        }
    }

    private String firstNonBlank(String... values) {
        for (String value : values) {
            if (value != null && !value.isBlank()) return value;
        }
        return "An error occurred while running the code.";
    }
}
