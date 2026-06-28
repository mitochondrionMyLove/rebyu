package com.capstone.rebyu.assessment.controller;

import com.capstone.rebyu.assessment.dto.LearnerMcqAnswerDto;
import com.capstone.rebyu.assessment.service.LearnerMcqAnswerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/learner-mcq-answers")
@RequiredArgsConstructor
public class LearnerMcqAnswerController {
    private final LearnerMcqAnswerService learnerMcqAnswerService;

    @GetMapping
    public List<LearnerMcqAnswerDto> getAll() {
        return learnerMcqAnswerService.getAll();
    }

    @GetMapping("/{id}")
    public LearnerMcqAnswerDto getById(@PathVariable Long id) {
        return learnerMcqAnswerService.getById(id);
    }

    @GetMapping("/by-detail/{learnerExamDetailId}")
    public List<LearnerMcqAnswerDto> getByDetailId(@PathVariable Long learnerExamDetailId) {
        return learnerMcqAnswerService.getByDetailId(learnerExamDetailId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public LearnerMcqAnswerDto create(@Valid @RequestBody LearnerMcqAnswerDto dto) {
        return learnerMcqAnswerService.create(dto);
    }

    @PutMapping("/{id}")
    public LearnerMcqAnswerDto update(@PathVariable Long id, @Valid @RequestBody LearnerMcqAnswerDto dto) {
        return learnerMcqAnswerService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        learnerMcqAnswerService.delete(id);
    }
}
