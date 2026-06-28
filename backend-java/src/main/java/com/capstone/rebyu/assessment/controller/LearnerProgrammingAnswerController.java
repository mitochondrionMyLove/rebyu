package com.capstone.rebyu.assessment.controller;

import com.capstone.rebyu.assessment.dto.LearnerProgrammingAnswerDto;
import com.capstone.rebyu.assessment.service.LearnerProgrammingAnswerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/learner-programming-answers")
@RequiredArgsConstructor
public class LearnerProgrammingAnswerController {
    private final LearnerProgrammingAnswerService learnerProgrammingAnswerService;

    @GetMapping
    public List<LearnerProgrammingAnswerDto> getAll() {
        return learnerProgrammingAnswerService.getAll();
    }

    @GetMapping("/{id}")
    public LearnerProgrammingAnswerDto getById(@PathVariable Long id) {
        return learnerProgrammingAnswerService.getById(id);
    }

    @GetMapping("/by-detail/{learnerExamDetailId}")
    public LearnerProgrammingAnswerDto getByDetailId(@PathVariable Long learnerExamDetailId) {
        return learnerProgrammingAnswerService.getByDetailId(learnerExamDetailId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public LearnerProgrammingAnswerDto create(@Valid @RequestBody LearnerProgrammingAnswerDto dto) {
        return learnerProgrammingAnswerService.create(dto);
    }

    @PutMapping("/{id}")
    public LearnerProgrammingAnswerDto update(@PathVariable Long id, @Valid @RequestBody LearnerProgrammingAnswerDto dto) {
        return learnerProgrammingAnswerService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        learnerProgrammingAnswerService.delete(id);
    }
}
