package com.capstone.rebyu.certification.controller;


import com.capstone.rebyu.certification.entity.Certification;
import com.capstone.rebyu.certification.dto.CertificationDto;
import com.capstone.rebyu.certification.service.CertificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/certifications")
@RequiredArgsConstructor
@Slf4j
public class CertificationController {
    private final CertificationService certificationService;

    @GetMapping
    public List<CertificationDto> getAll() {
        return certificationService.getAll();
    }

    @GetMapping("/{id}")
    public CertificationDto getById(@PathVariable Long id) {
        return certificationService.getById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CertificationDto create(@Valid @RequestBody CertificationDto dto) {
        return certificationService.create(dto);
    }

    @PutMapping("/{id}")
    public CertificationDto update(@PathVariable Long id, @Valid @RequestBody CertificationDto dto) {
        return certificationService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        certificationService.delete(id);
        log.info("inside controlleer");
    }
}
