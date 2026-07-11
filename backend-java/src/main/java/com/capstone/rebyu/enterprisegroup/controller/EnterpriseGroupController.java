package com.capstone.rebyu.enterprisegroup.controller;

import com.capstone.rebyu.enterprisegroup.dto.EnterpriseGroupDto;
import com.capstone.rebyu.enterprisegroup.service.EnterpriseGroupService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/enterprise-groups")
@RequiredArgsConstructor
public class EnterpriseGroupController {

    private final EnterpriseGroupService enterpriseGroupService;

    @GetMapping
    public List<EnterpriseGroupDto> getAll(
            @RequestParam(required = false) Long enterpriseId,
            @RequestParam(required = false) Long orgCertId) {
        return enterpriseGroupService.getAll(enterpriseId, orgCertId);
    }

    @GetMapping("/{id}")
    public EnterpriseGroupDto getById(@PathVariable Long id) {
        return enterpriseGroupService.getById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public EnterpriseGroupDto create(@Valid @RequestBody EnterpriseGroupDto dto) {
        return enterpriseGroupService.create(dto);
    }

    @PutMapping("/{id}")
    public EnterpriseGroupDto update(@PathVariable Long id, @Valid @RequestBody EnterpriseGroupDto dto) {
        return enterpriseGroupService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        enterpriseGroupService.delete(id);
    }
}
