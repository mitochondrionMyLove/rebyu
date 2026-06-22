package com.capstone.rebyu.controllers;

import com.capstone.rebyu.dto.ExamChoiceDto;
import com.capstone.rebyu.services.ExamChoiceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/exam-choices")
@RequiredArgsConstructor
public class ExamChoiceController {
    private final ExamChoiceService examChoiceService;

    @GetMapping
    public List<ExamChoiceDto> getAll() {
        return examChoiceService.getAll();
    }

    @GetMapping("/{examQuestionId}/{choiceId}")
    public ExamChoiceDto getById(@PathVariable Long examQuestionId, @PathVariable Long choiceId) {
        return examChoiceService.getById(examQuestionId, choiceId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ExamChoiceDto create(@Valid @RequestBody ExamChoiceDto dto) {
        return examChoiceService.create(dto);
    }

    @DeleteMapping("/{examQuestionId}/{choiceId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long examQuestionId, @PathVariable Long choiceId) {
        examChoiceService.delete(examQuestionId, choiceId);
    }
}
