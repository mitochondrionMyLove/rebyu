package com.capstone.rebyu.execution.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

/** One Judge0 submission (base64-encoded fields). */
@JsonInclude(JsonInclude.Include.NON_NULL)
public record Judge0SubmissionRequestDto(
        @JsonProperty("source_code") String sourceCode,
        @JsonProperty("language_id") int languageId,
        @JsonProperty("stdin") String stdin,
        @JsonProperty("cpu_time_limit") double cpuTimeLimit,
        @JsonProperty("memory_limit") int memoryLimit
) {}
