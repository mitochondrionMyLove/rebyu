package com.capstone.rebyu.organization.controller;

import com.capstone.rebyu.organization.dto.EnterpriseVerificationDocumentDto;
import com.capstone.rebyu.organization.service.EnterpriseVerificationDocumentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/enterprise-verification-documents")
@RequiredArgsConstructor
public class EnterpriseVerificationDocumentController {
    private final EnterpriseVerificationDocumentService service;

    @GetMapping
    public List<EnterpriseVerificationDocumentDto> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public EnterpriseVerificationDocumentDto getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public EnterpriseVerificationDocumentDto create(@Valid @RequestBody EnterpriseVerificationDocumentDto dto) {
        return service.create(dto);
    }

    @PutMapping("/{id}")
    public EnterpriseVerificationDocumentDto update(@PathVariable Long id, @Valid @RequestBody EnterpriseVerificationDocumentDto dto) {
        return service.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
