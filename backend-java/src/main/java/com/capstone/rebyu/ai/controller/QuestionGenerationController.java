package com.capstone.rebyu.ai.controller;

import com.capstone.rebyu.ai.dto.AiQuestionGenerationRequest;
import com.capstone.rebyu.ai.service.QuestionGenerationService;
import com.capstone.rebyu.assessment.dto.QuestionDto;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ai/questions")
@RequiredArgsConstructor
public class QuestionGenerationController {

    private final QuestionGenerationService questionGenerationService;
    private final ObjectMapper objectMapper;









    @PostMapping(value = "/generate", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public List<QuestionDto> generate(
            @RequestParam("certificationId") Long certificationId,
            @RequestParam("questionCountsJson") String questionCountsJson,
            @RequestParam(value = "files", required = false) List<MultipartFile> files,
            @RequestParam(value = "additionalInstructions", required = false) String additionalInstructions
    ) throws IOException {
        Map<String, Integer> questionCounts;
        try {
            questionCounts = objectMapper.readValue(
                    questionCountsJson.replaceAll("[\\r\\n\\t]", " ").trim(),
                    new TypeReference<>() {}
            );
        } catch (Exception e) {
            throw new IllegalArgumentException(
                    "questionCountsJson must be a JSON object mapping question types to counts."
            );
        }

        AiQuestionGenerationRequest request = new AiQuestionGenerationRequest(
                certificationId, questionCounts, additionalInstructions
        );

        return questionGenerationService.generateAndSave(request, files);
    }
}
