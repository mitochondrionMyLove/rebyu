package com.capstone.rebyu.organization.controller;

import com.capstone.rebyu.organization.dto.EnterpriseDto;
import com.capstone.rebyu.organization.service.EnterpriseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/enterprises")
@RequiredArgsConstructor
public class EnterpriseController {
    private final EnterpriseService enterpriseService;

    @GetMapping
    public List<EnterpriseDto> getAll() {
        return enterpriseService.getAll();
    }

    @GetMapping("/{id}")
    public EnterpriseDto getById(@PathVariable Long id) {
        return enterpriseService.getById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public EnterpriseDto create(@Valid @RequestBody EnterpriseDto dto) {
        return enterpriseService.create(dto);
    }

    @PutMapping("/{id}")
    public EnterpriseDto update(@PathVariable Long id, @Valid @RequestBody EnterpriseDto dto) {
        return enterpriseService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        enterpriseService.delete(id);
    }
}
