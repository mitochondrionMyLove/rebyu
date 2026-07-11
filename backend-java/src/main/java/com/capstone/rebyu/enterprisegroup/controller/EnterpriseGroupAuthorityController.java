package com.capstone.rebyu.enterprisegroup.controller;

import com.capstone.rebyu.enterprisegroup.dto.EnterpriseGroupAuthorityDto;
import com.capstone.rebyu.enterprisegroup.service.EnterpriseGroupAuthorityService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/enterprise-group-authorities")
@RequiredArgsConstructor
public class EnterpriseGroupAuthorityController {

    private final EnterpriseGroupAuthorityService enterpriseGroupAuthorityService;

    @GetMapping
    public List<EnterpriseGroupAuthorityDto> getAll(
            @RequestParam(required = false) Long groupId,
            @RequestParam(required = false) Long userId) {
        return enterpriseGroupAuthorityService.getAll(groupId, userId);
    }

    @GetMapping("/{id}")
    public EnterpriseGroupAuthorityDto getById(@PathVariable Long id) {
        return enterpriseGroupAuthorityService.getById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public EnterpriseGroupAuthorityDto create(@Valid @RequestBody EnterpriseGroupAuthorityDto dto) {
        return enterpriseGroupAuthorityService.create(dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        enterpriseGroupAuthorityService.delete(id);
    }
}
