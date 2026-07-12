package com.capstone.rebyu.ai.service;

import com.capstone.rebyu.ai.assistant.AnswerGradingAssistant;
import com.capstone.rebyu.ai.dto.AnswerGradingRequestDto;
import com.capstone.rebyu.ai.dto.AnswerGradingRequestDto.SubQuestionGradingRequestDto;
import com.capstone.rebyu.ai.dto.AnswerGradingResultDto;
import com.capstone.rebyu.ai.dto.AnswerGradingResultDto.SubAnswerGradeDto;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Automatic grading for descriptive and critical-thinking answers (spec: AI
 * only for these two types; MCQ/short-answer are exact rules, programming
 * uses Judge0, diagrams use structural grading). The score and feedback are
 * finalized immediately — there is no admin review step. When the AI cannot
 * be parsed into a trustworthy score after retrying, this returns empty so
 * the caller leaves the answer pending rather than fabricating a score.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AiAnswerGradingService {

    private static final int MAX_ATTEMPTS = 2;

    private final AnswerGradingAssistant answerGradingAssistant;
    private final ObjectMapper objectMapper;

    public Optional<AnswerGradingResultDto> grade(AnswerGradingRequestDto request) {
        String requestJson;
        try {
            requestJson = objectMapper.writeValueAsString(request);
        } catch (Exception e) {
            log.error("Failed to serialize AI grading request", e);
            return Optional.empty();
        }

        for (int attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
            try {
                String response = answerGradingAssistant.gradeAnswer(requestJson);
                AnswerGradingResultDto parsed = parseAndClamp(response, request);
                if (parsed != null) {
                    return Optional.of(parsed);
                }
                log.warn("Attempt {}/{}: AI grading response could not be validated against the request.",
                        attempt, MAX_ATTEMPTS);
            } catch (Exception e) {
                log.warn("Attempt {}/{}: AI grading call failed: {}", attempt, MAX_ATTEMPTS, e.getMessage());
            }
        }
        log.error("AI grading failed after {} attempt(s); leaving the answer pending.", MAX_ATTEMPTS);
        return Optional.empty();
    }

    /**
     * Parses the AI's JSON object and cross-checks it against the request:
     * every requested sub-question must have a matching subScore, and every
     * awarded value is clamped into [0, maxPoints]. Returns null (never a
     * fabricated score) when the response cannot be trusted.
     */
    private AnswerGradingResultDto parseAndClamp(String response, AnswerGradingRequestDto request) {
        JsonNode root = parseJsonObject(response);
        if (root == null) {
            return null;
        }

        List<SubQuestionGradingRequestDto> requestedSubs =
                request.subQuestions() == null ? List.of() : request.subQuestions();

        if (!requestedSubs.isEmpty()) {
            Map<Long, JsonNode> subScoreById = new LinkedHashMap<>();
            JsonNode subScoresNode = root.get("subScores");
            if (subScoresNode != null && subScoresNode.isArray()) {
                for (JsonNode node : subScoresNode) {
                    if (node.hasNonNull("subQuestionId")) {
                        subScoreById.put(node.get("subQuestionId").asLong(), node);
                    }
                }
            }

            List<SubAnswerGradeDto> subScores = new ArrayList<>();
            BigDecimal total = BigDecimal.ZERO;
            for (SubQuestionGradingRequestDto sub : requestedSubs) {
                JsonNode scored = subScoreById.get(sub.subQuestionId());
                if (scored == null) {
                    // A sub-question the AI silently skipped: don't guess its score.
                    return null;
                }
                BigDecimal earned = clamp(
                        readDecimal(scored, "earnedPoints"),
                        sub.maxPoints() == null ? BigDecimal.ZERO : sub.maxPoints());
                String feedback = scored.path("feedback").asText("");
                subScores.add(new SubAnswerGradeDto(sub.subQuestionId(), earned, feedback));
                total = total.add(earned);
            }

            BigDecimal overallMax = request.maxPoints() == null ? BigDecimal.ZERO : request.maxPoints();
            // Sum of the (already-clamped) sub-scores, capped to the item's
            // configured total in case per-sub rounding nudges it over.
            BigDecimal overallEarned = clamp(total, overallMax);
            String overallFeedback = root.path("feedback").asText("");
            return new AnswerGradingResultDto(overallEarned, overallFeedback, subScores);
        }

        BigDecimal maxPoints = request.maxPoints() == null ? BigDecimal.ZERO : request.maxPoints();
        BigDecimal earned = clamp(readDecimal(root, "earnedPoints"), maxPoints);
        String feedback = root.path("feedback").asText("");
        if (feedback.isBlank()) {
            return null;
        }
        return new AnswerGradingResultDto(earned, feedback, List.of());
    }

    private BigDecimal readDecimal(JsonNode node, String field) {
        JsonNode value = node.get(field);
        if (value == null || !value.isNumber()) {
            return null;
        }
        return value.decimalValue();
    }

    private BigDecimal clamp(BigDecimal value, BigDecimal max) {
        if (value == null) {
            return null;
        }
        BigDecimal upper = max == null ? BigDecimal.ZERO : max;
        BigDecimal clamped = value.max(BigDecimal.ZERO).min(upper);
        return clamped.setScale(2, RoundingMode.HALF_UP);
    }

    private JsonNode parseJsonObject(String response) {
        if (response == null || response.isBlank()) {
            return null;
        }
        String cleaned = response.trim();
        if (cleaned.startsWith("```")) {
            cleaned = cleaned.replaceFirst("```[a-zA-Z]*\\n?", "").replaceAll("```$", "").trim();
        }
        int start = cleaned.indexOf('{');
        int end = cleaned.lastIndexOf('}');
        if (start < 0 || end <= start) {
            return null;
        }
        try {
            JsonNode node = objectMapper.readTree(cleaned.substring(start, end + 1));
            return node.isObject() ? node : null;
        } catch (Exception e) {
            return null;
        }
    }
}
