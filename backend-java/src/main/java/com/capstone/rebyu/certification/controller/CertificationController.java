package com.capstone.rebyu.certification.controller;

import com.capstone.rebyu.ai.service.CurriculumGenerationService;
import com.capstone.rebyu.certification.dto.CertificationDto;
import com.capstone.rebyu.certification.service.CertificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/certifications")
@RequiredArgsConstructor
@Slf4j
public class CertificationController {

    private final CertificationService certificationService;
    private final CurriculumGenerationService curriculumGenerationService;

    @GetMapping
    public List<CertificationDto> getAll() {
        return certificationService.getAll();
    }

    @GetMapping("/{id}")
    public CertificationDto getById(@PathVariable Long id) {
        return certificationService.getById(id);
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public CertificationDto create(@Valid @RequestBody CertificationDto dto) {
        return certificationService.create(dto);
    }


    @PostMapping(value = "/generate", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public CertificationDto createWithAi(
            @RequestPart("data") @Valid CertificationDto dto,
            @RequestPart(value = "files", required = false) List<MultipartFile> files,
            @RequestParam(value = "additionalInstructions", required = false) String additionalInstructions
    ) throws IOException {
        log.info("AI certification creation requested for '{}'", dto.getTitle());
        return curriculumGenerationService.generateForNewCertification(
                dto, files, additionalInstructions
        );
    }

    @PutMapping("/{id}")
    public CertificationDto update(@PathVariable Long id, @Valid @RequestBody CertificationDto dto) {
        return certificationService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        certificationService.delete(id);
        log.info("Deleted certification with ID: {}", id);
    }
}
