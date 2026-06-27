package com.capstone.rebyu.organization.controller;

import com.capstone.rebyu.organization.dto.OrganizationCertificateDto;
import com.capstone.rebyu.organization.service.OrganizationCertificateService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/organization-certificates")
@RequiredArgsConstructor
public class OrganizationCertificateController {
    private final OrganizationCertificateService organizationCertificateService;

    @GetMapping
    public List<OrganizationCertificateDto> getAll() {
        return organizationCertificateService.getAll();
    }

    @GetMapping("/{id}")
    public OrganizationCertificateDto getById(@PathVariable Long id) {
        return organizationCertificateService.getById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public OrganizationCertificateDto create(@Valid @RequestBody OrganizationCertificateDto dto) {
        return organizationCertificateService.create(dto);
    }

    @PutMapping("/{id}")
    public OrganizationCertificateDto update(@PathVariable Long id, @Valid @RequestBody OrganizationCertificateDto dto) {
        return organizationCertificateService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        organizationCertificateService.delete(id);
    }
}
