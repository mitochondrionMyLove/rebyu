package com.capstone.rebyu.ai.controller;

import com.capstone.rebyu.ai.service.LessonGenerationService;
import com.capstone.rebyu.certification.dto.LessonComponentResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/ai/lessons")
@RequiredArgsConstructor
public class LessonGenerationController {

    private final LessonGenerationService lessonGenerationService;

    /**
     * Regenerate content for a single existing lesson using AI.
     * Use POST /api/ai/curriculum/generate to build an entire curriculum from scratch.
     *
     * Form params:
     *   lessonId               (required) — the lesson to regenerate content for
     *   files                  (optional) — PDF/DOCX/TXT reference documents
     *   additionalInstructions (optional) — any extra guidance for the AI
     */
    @PostMapping(value = "/generate", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public LessonComponentResponseDto generate(
            @RequestParam("lessonId") Long lessonId,
            @RequestParam(value = "files", required = false) List<MultipartFile> files,
            @RequestParam(value = "additionalInstructions", required = false) String additionalInstructions
    ) throws IOException {
        return lessonGenerationService.generateAndSave(lessonId, files, additionalInstructions);
    }
}
