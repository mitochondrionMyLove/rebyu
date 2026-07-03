package com.capstone.rebyu.assessment.controller;

import com.capstone.rebyu.assessment.dto.QuestionDto;
import com.capstone.rebyu.assessment.service.QuestionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/questions")
@RequiredArgsConstructor
public class QuestionController {
    private final QuestionService questionService;

    @GetMapping
    public List<QuestionDto> getAll(@RequestParam(required = false) Long lessonId) {
        if (lessonId != null) {
            return questionService.getByLessonId(lessonId);
        }

        return questionService.getAll();
    }

    @GetMapping("/{id}")
    public QuestionDto getById(@PathVariable Long id) {
        return questionService.getById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public QuestionDto create(@Valid @RequestBody QuestionDto dto) {
        return questionService.create(dto);
    }

    @PutMapping("/{id}")
    public QuestionDto update(@PathVariable Long id, @Valid @RequestBody QuestionDto dto) {
        return questionService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        questionService.delete(id);
    }
}
