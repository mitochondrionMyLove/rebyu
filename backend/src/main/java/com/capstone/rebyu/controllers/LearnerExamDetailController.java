package com.capstone.rebyu.controllers;

import com.capstone.rebyu.dto.LearnerExamDetailDto;
import com.capstone.rebyu.services.LearnerExamDetailService;
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

    @GetMapping("/{learnerId}/{examId}/{attemptNo}/{questionId}")
    public LearnerExamDetailDto getById(@PathVariable Long learnerId, @PathVariable Long examId,
                                         @PathVariable Integer attemptNo, @PathVariable Long questionId) {
        return learnerExamDetailService.getById(learnerId, examId, attemptNo, questionId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public LearnerExamDetailDto create(@Valid @RequestBody LearnerExamDetailDto dto) {
        return learnerExamDetailService.create(dto);
    }

    @PutMapping("/{learnerId}/{examId}/{attemptNo}/{questionId}")
    public LearnerExamDetailDto update(@PathVariable Long learnerId, @PathVariable Long examId,
                                        @PathVariable Integer attemptNo, @PathVariable Long questionId,
                                        @Valid @RequestBody LearnerExamDetailDto dto) {
        return learnerExamDetailService.update(learnerId, examId, attemptNo, questionId, dto);
    }

    @DeleteMapping("/{learnerId}/{examId}/{attemptNo}/{questionId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long learnerId, @PathVariable Long examId,
                        @PathVariable Integer attemptNo, @PathVariable Long questionId) {
        learnerExamDetailService.delete(learnerId, examId, attemptNo, questionId);
    }
}
