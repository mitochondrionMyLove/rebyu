package com.capstone.rebyu.ai.controller;

import com.capstone.rebyu.ai.service.CurriculumGenerationService;
import com.capstone.rebyu.certification.dto.CertificationDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/ai/curriculum")
@RequiredArgsConstructor
public class CurriculumGenerationController {

    private final CurriculumGenerationService curriculumGenerationService;

    /**
     * Upload a certification document and let the AI generate the full curriculum:
     * major categories → middle categories → lessons → lesson content.
     *
     * @param certificationId  the existing certification to build the curriculum under
     * @param files            reviewer / coverage document(s) (optional but recommended)
     * @param additionalInstructions  free-form prompt additions (optional)
     */
    @PostMapping("/generate")
    public ResponseEntity<CertificationDto> generate(
            @RequestParam("certificationId") Long certificationId,
            @RequestParam(value = "files", required = false) List<MultipartFile> files,
            @RequestParam(value = "additionalInstructions", required = false) String additionalInstructions
    ) throws IOException {
        log.info("Curriculum generation requested for certificationId={}", certificationId);
        CertificationDto result = curriculumGenerationService.generateCurriculum(
                certificationId, files, additionalInstructions
        );
        return ResponseEntity.ok(result);
    }
}
