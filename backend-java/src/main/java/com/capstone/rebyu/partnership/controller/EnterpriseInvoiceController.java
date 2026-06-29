package com.capstone.rebyu.partnership.controller;

import com.capstone.rebyu.partnership.dto.EnterpriseInvoiceDto;
import com.capstone.rebyu.partnership.service.EnterpriseInvoiceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/enterprise-invoices")
@RequiredArgsConstructor
public class EnterpriseInvoiceController {
    private final EnterpriseInvoiceService service;

    @GetMapping
    public List<EnterpriseInvoiceDto> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public EnterpriseInvoiceDto getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public EnterpriseInvoiceDto create(@Valid @RequestBody EnterpriseInvoiceDto dto) {
        return service.create(dto);
    }

    @PutMapping("/{id}")
    public EnterpriseInvoiceDto update(@PathVariable Long id, @Valid @RequestBody EnterpriseInvoiceDto dto) {
        return service.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
