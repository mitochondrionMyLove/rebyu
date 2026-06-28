package com.capstone.rebyu.assessment.controller;

import com.capstone.rebyu.assessment.dto.SubQuestionDto;
import com.capstone.rebyu.assessment.service.SubQuestionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sub-questions")
@RequiredArgsConstructor
public class SubQuestionController {
    private final SubQuestionService subQuestionService;

    @GetMapping
    public List<SubQuestionDto> getAll() {
        return subQuestionService.getAll();
    }

    @GetMapping("/{id}")
    public SubQuestionDto getById(@PathVariable Long id) {
        return subQuestionService.getById(id);
    }

    @GetMapping("/by-question/{noChoiceQuestionId}")
    public List<SubQuestionDto> getByNoChoiceQuestionId(@PathVariable Long noChoiceQuestionId) {
        return subQuestionService.getByNoChoiceQuestionId(noChoiceQuestionId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SubQuestionDto create(@Valid @RequestBody SubQuestionDto dto) {
        return subQuestionService.create(dto);
    }

    @PutMapping("/{id}")
    public SubQuestionDto update(@PathVariable Long id, @Valid @RequestBody SubQuestionDto dto) {
        return subQuestionService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        subQuestionService.delete(id);
    }
}
