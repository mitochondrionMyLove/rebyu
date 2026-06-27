package com.capstone.rebyu.assessment.controller;

import com.capstone.rebyu.assessment.dto.ExamDto;
import com.capstone.rebyu.assessment.service.ExamService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/exams")
@RequiredArgsConstructor
public class ExamController {
    private final ExamService examService;

    @GetMapping
    public List<ExamDto> getAll() {
        return examService.getAll();
    }

    @GetMapping("/{id}")
    public ExamDto getById(@PathVariable Long id) {
        return examService.getById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ExamDto create(@Valid @RequestBody ExamDto dto) {
        return examService.create(dto);
    }

    @PutMapping("/{id}")
    public ExamDto update(@PathVariable Long id, @Valid @RequestBody ExamDto dto) {
        return examService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        examService.delete(id);
    }
}
