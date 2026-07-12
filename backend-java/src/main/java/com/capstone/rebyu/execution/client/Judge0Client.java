package com.capstone.rebyu.execution.client;

import com.capstone.rebyu.execution.config.Judge0Properties;
import com.capstone.rebyu.execution.dto.Judge0SubmissionRequestDto;
import com.capstone.rebyu.execution.dto.Judge0SubmissionResultDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Typed, blocking client for the Judge0 code-execution API. Uses the
 * synchronous batch endpoint (wait=true) so one call returns every test
 * case's result — no polling required for the CPU-time-bounded submissions
 * this project sends.
 */
@Slf4j
@Component
public class Judge0Client {

    private final WebClient webClient;
    private final Judge0Properties properties;

    public Judge0Client(WebClient judge0WebClient, Judge0Properties properties) {
        this.webClient = judge0WebClient;
        this.properties = properties;
    }

    public List<Judge0SubmissionResultDto> submitBatch(List<Judge0SubmissionRequestDto> submissions) {
        String correlationId = UUID.randomUUID().toString();
        try {
            Judge0SubmissionResultDto[] results = webClient.post()
                    .uri(uriBuilder -> uriBuilder
                            .path("/submissions/batch")
                            .queryParam("base64_encoded", "true")
                            .queryParam("wait", "true")
                            .build())
                    .bodyValue(Map.of("submissions", submissions))
                    .retrieve()
                    .bodyToMono(Judge0SubmissionResultDto[].class)
                    .block();
            return results == null ? List.of() : List.of(results);
        } catch (WebClientResponseException e) {
            throw new Judge0ServiceException(
                    "Judge0 rejected the submission with status " + e.getStatusCode()
                            + " (correlationId=" + correlationId + ")", e);
        } catch (Exception e) {
            throw new Judge0ServiceException(
                    "Judge0 service unavailable (correlationId=" + correlationId + ")", e);
        }
    }
}
