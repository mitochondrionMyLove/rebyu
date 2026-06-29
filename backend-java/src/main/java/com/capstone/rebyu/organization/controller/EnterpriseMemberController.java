package com.capstone.rebyu.organization.controller;

import com.capstone.rebyu.organization.dto.EnterpriseMemberDto;
import com.capstone.rebyu.organization.service.EnterpriseMemberService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/enterprise-members")
@RequiredArgsConstructor
public class EnterpriseMemberController {
    private final EnterpriseMemberService enterpriseMemberService;

    @GetMapping
    public List<EnterpriseMemberDto> getAll() {
        return enterpriseMemberService.getAll();
    }

    @GetMapping("/enterprise/{enterpriseId}")
    public List<EnterpriseMemberDto> getByEnterpriseId(@PathVariable Long enterpriseId) {
        return enterpriseMemberService.getByEnterpriseId(enterpriseId);
    }

    @GetMapping("/{id}")
    public EnterpriseMemberDto getById(@PathVariable Long id) {
        return enterpriseMemberService.getById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public EnterpriseMemberDto create(@Valid @RequestBody EnterpriseMemberDto dto) {
        return enterpriseMemberService.create(dto);
    }

    @PutMapping("/{id}")
    public EnterpriseMemberDto update(@PathVariable Long id, @Valid @RequestBody EnterpriseMemberDto dto) {
        return enterpriseMemberService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        enterpriseMemberService.delete(id);
    }
}
