package com.capstone.rebyu.assessment.controller;

import com.capstone.rebyu.assessment.dto.LearnerTextAnswerDto;
import com.capstone.rebyu.assessment.service.LearnerTextAnswerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/learner-text-answers")
@RequiredArgsConstructor
public class LearnerTextAnswerController {
    private final LearnerTextAnswerService learnerTextAnswerService;

    @GetMapping
    public List<LearnerTextAnswerDto> getAll() {
        return learnerTextAnswerService.getAll();
    }

    @GetMapping("/{id}")
    public LearnerTextAnswerDto getById(@PathVariable Long id) {
        return learnerTextAnswerService.getById(id);
    }

    @GetMapping("/by-detail/{learnerExamDetailId}")
    public LearnerTextAnswerDto getByDetailId(@PathVariable Long learnerExamDetailId) {
        return learnerTextAnswerService.getByDetailId(learnerExamDetailId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public LearnerTextAnswerDto create(@Valid @RequestBody LearnerTextAnswerDto dto) {
        return learnerTextAnswerService.create(dto);
    }

    @PutMapping("/{id}")
    public LearnerTextAnswerDto update(@PathVariable Long id, @Valid @RequestBody LearnerTextAnswerDto dto) {
        return learnerTextAnswerService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        learnerTextAnswerService.delete(id);
    }
}
