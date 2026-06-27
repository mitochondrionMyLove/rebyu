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

    @GetMapping("/{learnerId}/{certificationId}")
    public LearnerCertificationDto getById(@PathVariable Long learnerId, @PathVariable Long certificationId) {
        return learnerCertificationService.getById(learnerId, certificationId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public LearnerCertificationDto create(@Valid @RequestBody LearnerCertificationDto dto) {
        return learnerCertificationService.create(dto);
    }

    @PutMapping("/{learnerId}/{certificationId}")
    public LearnerCertificationDto update(@PathVariable Long learnerId, @PathVariable Long certificationId,
                                           @Valid @RequestBody LearnerCertificationDto dto) {
        return learnerCertificationService.update(learnerId, certificationId, dto);
    }

    @DeleteMapping("/{learnerId}/{certificationId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long learnerId, @PathVariable Long certificationId) {
        learnerCertificationService.delete(learnerId, certificationId);
    }
}
