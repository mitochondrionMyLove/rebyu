package com.capstone.rebyu.enrollment.controller;

import com.capstone.rebyu.enrollment.dto.LearnerCertificationDto;
import com.capstone.rebyu.enrollment.service.LearnerCertificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/learner-certifications")
@RequiredArgsConstructor
public class LearnerCertificationController {
    private final LearnerCertificationService learnerCertificationService;

    @GetMapping
    public List<LearnerCertificationDto> getAll() {
        return learnerCertificationService.getAll();
    }

    @GetMapping("/{id}")
    public LearnerCertificationDto getById(@PathVariable Long id) {
        return learnerCertificationService.getById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public LearnerCertificationDto create(@Valid @RequestBody LearnerCertificationDto dto) {
        return learnerCertificationService.create(dto);
    }

    @PutMapping("/{id}")
    public LearnerCertificationDto update(@PathVariable Long id, @Valid @RequestBody LearnerCertificationDto dto) {
        return learnerCertificationService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        learnerCertificationService.delete(id);
    }
}
