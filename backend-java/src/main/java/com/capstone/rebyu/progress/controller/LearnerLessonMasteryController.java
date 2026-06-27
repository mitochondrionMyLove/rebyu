package com.capstone.rebyu.progress.controller;


import com.capstone.rebyu.progress.dto.LearnerLessonMasteryDto;
import com.capstone.rebyu.progress.service.LearnerLessonMasteryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/learner-lesson-mastery")
@RequiredArgsConstructor
public class LearnerLessonMasteryController {
    private final LearnerLessonMasteryService learnerLessonMasteryService;

    @GetMapping
    public List<LearnerLessonMasteryDto> getAll() {
        return learnerLessonMasteryService.getAll();
    }

    @GetMapping("/{learnerId}/{lessonId}")
    public LearnerLessonMasteryDto getById(@PathVariable Long learnerId, @PathVariable Long lessonId) {
        return learnerLessonMasteryService.getById(learnerId, lessonId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public LearnerLessonMasteryDto create(@Valid @RequestBody LearnerLessonMasteryDto dto) {
        return learnerLessonMasteryService.create(dto);
    }

    @PutMapping("/{learnerId}/{lessonId}")
    public LearnerLessonMasteryDto update(@PathVariable Long learnerId, @PathVariable Long lessonId,
                                           @Valid @RequestBody LearnerLessonMasteryDto dto) {
        return learnerLessonMasteryService.update(learnerId, lessonId, dto);
    }

    @DeleteMapping("/{learnerId}/{lessonId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long learnerId, @PathVariable Long lessonId) {
        learnerLessonMasteryService.delete(learnerId, lessonId);
    }
}
