package com.capstone.rebyu.controllers;

import com.capstone.rebyu.dto.MiddleCategoryDto;
import com.capstone.rebyu.services.MiddleCategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/middle-categories")
@RequiredArgsConstructor
public class MiddleCategoryController {
    private final MiddleCategoryService middleCategoryService;

    @GetMapping
    public List<MiddleCategoryDto> getAll() {
        return middleCategoryService.getAll();
    }

    @GetMapping("/{id}")
    public MiddleCategoryDto getById(@PathVariable Long id) {
        return middleCategoryService.getById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MiddleCategoryDto create(@Valid @RequestBody MiddleCategoryDto dto) {
        return middleCategoryService.create(dto);
    }

    @PutMapping("/{id}")
    public MiddleCategoryDto update(@PathVariable Long id, @Valid @RequestBody MiddleCategoryDto dto) {
        return middleCategoryService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        middleCategoryService.delete(id);
    }
}
