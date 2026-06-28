package com.capstone.rebyu.assessment.controller;

import com.capstone.rebyu.assessment.dto.LearnerExamDetailDto;
import com.capstone.rebyu.assessment.service.LearnerExamDetailService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/learner-exam-details")
@RequiredArgsConstructor
public class LearnerExamDetailController {
    private final LearnerExamDetailService learnerExamDetailService;

    @GetMapping
    public List<LearnerExamDetailDto> getAll() {
        return learnerExamDetailService.getAll();
    }

    @GetMapping("/{id}")
    public LearnerExamDetailDto getById(@PathVariable Long id) {
        return learnerExamDetailService.getById(id);
    }

    @GetMapping("/by-attempt/{learnerId}/{examId}/{attemptNo}")
    public List<LearnerExamDetailDto> getByAttempt(@PathVariable Long learnerId,
                                                    @PathVariable Long examId,
                                                    @PathVariable Integer attemptNo) {
        return learnerExamDetailService.getByAttempt(learnerId, examId, attemptNo);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public LearnerExamDetailDto create(@Valid @RequestBody LearnerExamDetailDto dto) {
        return learnerExamDetailService.create(dto);
    }

    @PutMapping("/{id}")
    public LearnerExamDetailDto update(@PathVariable Long id, @Valid @RequestBody LearnerExamDetailDto dto) {
        return learnerExamDetailService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        learnerExamDetailService.delete(id);
    }
}
