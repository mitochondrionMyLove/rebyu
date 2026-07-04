package com.capstone.rebyu.ai.controller;

import com.capstone.rebyu.ai.dto.AiQuestionGenerationRequest;
import com.capstone.rebyu.ai.dto.QuestionTypeRequest;
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

@RestController
@RequestMapping("/api/ai/questions")
@RequiredArgsConstructor
public class QuestionGenerationController {

    private final QuestionGenerationService questionGenerationService;
    private final ObjectMapper objectMapper;

    /**
     * Generate questions and save them to the lesson's question bank.
     *
     * Form params:
     *   certificationId         (required) — the certification this lesson belongs to
     *   lessonId                (required) — the lesson whose question bank receives the questions
     *   questionTypesJson       (required) — JSON array of QuestionTypeRequest objects, e.g.:
     *                           [{"questionType":"MCQ","count":5,"difficulty":"easy"},
     *                            {"questionType":"PROGRAMMING","count":1,"difficulty":"hard"}]
     *   files                   (optional) — PDF/DOCX/TXT reference documents for RAG context
     *   additionalInstructions  (optional) — extra guidance for the AI
     */
    @PostMapping(value = "/generate", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public List<QuestionDto> generate(
            @RequestParam("certificationId") Long certificationId,
            @RequestParam("lessonId") Long lessonId,
            @RequestParam("questionTypesJson") String questionTypesJson,
            @RequestParam(value = "files", required = false) List<MultipartFile> files,
            @RequestParam(value = "additionalInstructions", required = false) String additionalInstructions
    ) throws IOException {
        String cleanedJson = questionTypesJson.replaceAll("[\\r\\n\\t]", " ").trim();
        List<QuestionTypeRequest> questionTypes = objectMapper.readValue(
                cleanedJson, new TypeReference<>() {}
        );

        AiQuestionGenerationRequest request = new AiQuestionGenerationRequest(
                certificationId, lessonId, questionTypes, additionalInstructions
        );

        return questionGenerationService.generateAndSave(request, files);
    }
}
