package com.capstone.rebyu.assessment.controller;

import com.capstone.rebyu.assessment.dto.LearnerDiagramAnswerDto;
import com.capstone.rebyu.assessment.service.LearnerDiagramAnswerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/learner-diagram-answers")
@RequiredArgsConstructor
public class LearnerDiagramAnswerController {
    private final LearnerDiagramAnswerService learnerDiagramAnswerService;

    @GetMapping
    public List<LearnerDiagramAnswerDto> getAll() {
        return learnerDiagramAnswerService.getAll();
    }

    @GetMapping("/{id}")
    public LearnerDiagramAnswerDto getById(@PathVariable Long id) {
        return learnerDiagramAnswerService.getById(id);
    }

    @GetMapping("/by-detail/{learnerExamDetailId}")
    public LearnerDiagramAnswerDto getByDetailId(@PathVariable Long learnerExamDetailId) {
        return learnerDiagramAnswerService.getByDetailId(learnerExamDetailId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public LearnerDiagramAnswerDto create(@Valid @RequestBody LearnerDiagramAnswerDto dto) {
        return learnerDiagramAnswerService.create(dto);
    }

    @PutMapping("/{id}")
    public LearnerDiagramAnswerDto update(@PathVariable Long id, @Valid @RequestBody LearnerDiagramAnswerDto dto) {
        return learnerDiagramAnswerService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        learnerDiagramAnswerService.delete(id);
    }
}
