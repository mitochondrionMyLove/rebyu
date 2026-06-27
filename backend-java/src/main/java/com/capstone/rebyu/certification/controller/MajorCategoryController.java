package com.capstone.rebyu.certification.controller;


import com.capstone.rebyu.certification.entity.Certification;
import com.capstone.rebyu.certification.dto.MajorCategoryDto;
import com.capstone.rebyu.certification.service.MajorCategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/major-categories")
@RequiredArgsConstructor
public class MajorCategoryController {
    private final MajorCategoryService majorCategoryService;

    @GetMapping
    public List<MajorCategoryDto> getAll() {
        return majorCategoryService.getAll();
    }

    @GetMapping("/{id}")
    public MajorCategoryDto getById(@PathVariable Long id) {
        return majorCategoryService.getById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MajorCategoryDto create(@Valid @RequestBody MajorCategoryDto dto) {
        return majorCategoryService.create(dto);
    }

    @PutMapping("/{id}")
    public MajorCategoryDto update(@PathVariable Long id, @Valid @RequestBody MajorCategoryDto dto) {
        return majorCategoryService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        majorCategoryService.delete(id);
    }
}
