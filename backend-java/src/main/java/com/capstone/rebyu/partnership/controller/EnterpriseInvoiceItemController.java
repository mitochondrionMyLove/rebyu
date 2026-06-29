package com.capstone.rebyu.partnership.controller;

import com.capstone.rebyu.partnership.dto.EnterpriseInvoiceItemDto;
import com.capstone.rebyu.partnership.service.EnterpriseInvoiceItemService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/enterprise-invoice-items")
@RequiredArgsConstructor
public class EnterpriseInvoiceItemController {
    private final EnterpriseInvoiceItemService service;

    @GetMapping
    public List<EnterpriseInvoiceItemDto> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public EnterpriseInvoiceItemDto getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public EnterpriseInvoiceItemDto create(@Valid @RequestBody EnterpriseInvoiceItemDto dto) {
        return service.create(dto);
    }

    @PutMapping("/{id}")
    public EnterpriseInvoiceItemDto update(@PathVariable Long id, @Valid @RequestBody EnterpriseInvoiceItemDto dto) {
        return service.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
