package com.capstone.rebyu.assessment.controller;


import com.capstone.rebyu.assessment.entity.Exam;
import com.capstone.rebyu.assessment.dto.ExamTypeDto;
import com.capstone.rebyu.assessment.service.ExamTypeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/exam-types")
@RequiredArgsConstructor
public class ExamTypeController {
    private final ExamTypeService examTypeService;

    @GetMapping
    public List<ExamTypeDto> getAll() {
        return examTypeService.getAll();
    }

    @GetMapping("/{id}")
    public ExamTypeDto getById(@PathVariable Long id) {
        return examTypeService.getById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ExamTypeDto create(@Valid @RequestBody ExamTypeDto dto) {
        return examTypeService.create(dto);
    }

    @PutMapping("/{id}")
    public ExamTypeDto update(@PathVariable Long id, @Valid @RequestBody ExamTypeDto dto) {
        return examTypeService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        examTypeService.delete(id);
    }
}
