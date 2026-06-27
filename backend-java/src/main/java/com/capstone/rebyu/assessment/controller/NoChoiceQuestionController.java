package com.capstone.rebyu.assessment.controller;


import com.capstone.rebyu.assessment.entity.Choice;
import com.capstone.rebyu.assessment.dto.NoChoiceQuestionDto;
import com.capstone.rebyu.assessment.service.NoChoiceQuestionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/no-choice-questions")
@RequiredArgsConstructor
public class NoChoiceQuestionController {
    private final NoChoiceQuestionService noChoiceQuestionService;

    @GetMapping
    public List<NoChoiceQuestionDto> getAll() {
        return noChoiceQuestionService.getAll();
    }

    @GetMapping("/{id}")
    public NoChoiceQuestionDto getById(@PathVariable Long id) {
        return noChoiceQuestionService.getById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public NoChoiceQuestionDto create(@Valid @RequestBody NoChoiceQuestionDto dto) {
        return noChoiceQuestionService.create(dto);
    }

    @PutMapping("/{id}")
    public NoChoiceQuestionDto update(@PathVariable Long id, @Valid @RequestBody NoChoiceQuestionDto dto) {
        return noChoiceQuestionService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        noChoiceQuestionService.delete(id);
    }
}
