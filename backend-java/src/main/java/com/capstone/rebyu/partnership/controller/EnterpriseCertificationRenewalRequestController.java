package com.capstone.rebyu.partnership.controller;

import com.capstone.rebyu.partnership.dto.EnterpriseCertificationRenewalRequestDto;
import com.capstone.rebyu.partnership.service.EnterpriseCertificationRenewalRequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/enterprise-certification-renewal-requests")
@RequiredArgsConstructor
public class EnterpriseCertificationRenewalRequestController {
    private final EnterpriseCertificationRenewalRequestService renewalRequestService;

    @GetMapping
    public List<EnterpriseCertificationRenewalRequestDto> getAll() {
        return renewalRequestService.getAll();
    }

    @GetMapping("/org-cert/{orgCertId}")
    public List<EnterpriseCertificationRenewalRequestDto> getByOrgCertId(@PathVariable Long orgCertId) {
        return renewalRequestService.getByOrgCertId(orgCertId);
    }

    @GetMapping("/{id}")
    public EnterpriseCertificationRenewalRequestDto getById(@PathVariable Long id) {
        return renewalRequestService.getById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public EnterpriseCertificationRenewalRequestDto create(@Valid @RequestBody EnterpriseCertificationRenewalRequestDto dto) {
        return renewalRequestService.create(dto);
    }

    @PutMapping("/{id}")
    public EnterpriseCertificationRenewalRequestDto update(@PathVariable Long id,
                                                           @Valid @RequestBody EnterpriseCertificationRenewalRequestDto dto) {
        return renewalRequestService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        renewalRequestService.delete(id);
    }
}
