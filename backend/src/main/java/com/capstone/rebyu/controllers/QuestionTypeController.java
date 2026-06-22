package com.capstone.rebyu.controllers;

import com.capstone.rebyu.dto.QuestionTypeDto;
import com.capstone.rebyu.services.QuestionTypeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/question-types")
@RequiredArgsConstructor
public class QuestionTypeController {
    private final QuestionTypeService questionTypeService;

    @GetMapping
    public List<QuestionTypeDto> getAll() {
        return questionTypeService.getAll();
    }

    @GetMapping("/{id}")
    public QuestionTypeDto getById(@PathVariable Long id) {
        return questionTypeService.getById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public QuestionTypeDto create(@Valid @RequestBody QuestionTypeDto dto) {
        return questionTypeService.create(dto);
    }

    @PutMapping("/{id}")
    public QuestionTypeDto update(@PathVariable Long id, @Valid @RequestBody QuestionTypeDto dto) {
        return questionTypeService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        questionTypeService.delete(id);
    }
}
