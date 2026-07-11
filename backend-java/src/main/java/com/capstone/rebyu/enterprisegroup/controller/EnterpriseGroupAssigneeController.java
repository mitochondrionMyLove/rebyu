package com.capstone.rebyu.enterprisegroup.controller;

import com.capstone.rebyu.enterprisegroup.dto.EnterpriseGroupAssigneeDto;
import com.capstone.rebyu.enterprisegroup.service.EnterpriseGroupAssigneeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/enterprise-group-assignees")
@RequiredArgsConstructor
public class EnterpriseGroupAssigneeController {

    private final EnterpriseGroupAssigneeService enterpriseGroupAssigneeService;

    @GetMapping
    public List<EnterpriseGroupAssigneeDto> getAll(@RequestParam(required = false) Long groupId) {
        return enterpriseGroupAssigneeService.getAll(groupId);
    }

    @GetMapping("/{id}")
    public EnterpriseGroupAssigneeDto getById(@PathVariable Long id) {
        return enterpriseGroupAssigneeService.getById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public EnterpriseGroupAssigneeDto create(@Valid @RequestBody EnterpriseGroupAssigneeDto dto) {
        return enterpriseGroupAssigneeService.create(dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        enterpriseGroupAssigneeService.delete(id);
    }
}
