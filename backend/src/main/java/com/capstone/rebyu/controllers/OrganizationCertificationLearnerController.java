package com.capstone.rebyu.controllers;

import com.capstone.rebyu.dto.OrganizationCertificationLearnerDto;
import com.capstone.rebyu.services.OrganizationCertificationLearnerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/organization-certification-learners")
@RequiredArgsConstructor
public class OrganizationCertificationLearnerController {
    private final OrganizationCertificationLearnerService organizationCertificationLearnerService;

    @GetMapping
    public List<OrganizationCertificationLearnerDto> getAll() {
        return organizationCertificationLearnerService.getAll();
    }

    @GetMapping("/{id}")
    public OrganizationCertificationLearnerDto getById(@PathVariable Long id) {
        return organizationCertificationLearnerService.getById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public OrganizationCertificationLearnerDto create(@Valid @RequestBody OrganizationCertificationLearnerDto dto) {
        return organizationCertificationLearnerService.create(dto);
    }

    @PutMapping("/{id}")
    public OrganizationCertificationLearnerDto update(@PathVariable Long id,
                                                        @Valid @RequestBody OrganizationCertificationLearnerDto dto) {
        return organizationCertificationLearnerService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        organizationCertificationLearnerService.delete(id);
    }
}
