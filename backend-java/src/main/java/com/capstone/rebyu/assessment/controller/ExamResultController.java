package com.capstone.rebyu.assessment.controller;


import com.capstone.rebyu.assessment.entity.Exam;
import com.capstone.rebyu.assessment.dto.ExamResultDto;
import com.capstone.rebyu.assessment.service.ExamResultService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/exam-results")
@RequiredArgsConstructor
public class ExamResultController {
    private final ExamResultService examResultService;

    @GetMapping
    public List<ExamResultDto> getAll() {
        return examResultService.getAll();
    }

    @GetMapping("/{learnerId}/{examId}/{attemptNo}")
    public ExamResultDto getById(@PathVariable Long learnerId, @PathVariable Long examId, @PathVariable Integer attemptNo) {
        return examResultService.getById(learnerId, examId, attemptNo);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ExamResultDto create(@Valid @RequestBody ExamResultDto dto) {
        return examResultService.create(dto);
    }

    @PutMapping("/{learnerId}/{examId}/{attemptNo}")
    public ExamResultDto update(@PathVariable Long learnerId, @PathVariable Long examId, @PathVariable Integer attemptNo,
                                 @Valid @RequestBody ExamResultDto dto) {
        return examResultService.update(learnerId, examId, attemptNo, dto);
    }

    @DeleteMapping("/{learnerId}/{examId}/{attemptNo}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long learnerId, @PathVariable Long examId, @PathVariable Integer attemptNo) {
        examResultService.delete(learnerId, examId, attemptNo);
    }
}
