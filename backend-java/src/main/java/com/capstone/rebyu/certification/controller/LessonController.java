package com.capstone.rebyu.certification.controller;

import com.capstone.rebyu.certification.dto.LessonComponentResponseDto;
import com.capstone.rebyu.certification.dto.LessonDto;
import com.capstone.rebyu.certification.service.LessonService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lessons")
@RequiredArgsConstructor
public class LessonController {

    private final LessonService lessonService;

    @GetMapping
    public List<LessonDto> getAll() {
        return lessonService.getAll();
    }

    @GetMapping("/middle-category/{middleCategoryId}")
    public List<LessonDto> getByMiddleCategoryId(
            @PathVariable Long middleCategoryId
    ) {
        return lessonService.getByMiddleCategoryId(middleCategoryId);
    }

    @GetMapping("/{id}")
    public LessonDto getById(@PathVariable Long id) {
        return lessonService.getById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public LessonDto create(@Valid @RequestBody LessonDto dto) {
        return lessonService.create(dto);
    }

    @PutMapping("/{id}")
    public LessonDto update(
            @PathVariable Long id,
            @Valid @RequestBody LessonDto dto
    ) {
        return lessonService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        lessonService.delete(id);
    }

    @PutMapping("/lesson/{id}")
    @ResponseStatus(HttpStatus.OK)
    public void saveLessonComponent(
            @PathVariable Long id,
            @RequestBody LessonDto lessonDto
    ) {
        lessonService.saveLessonComponent(id, lessonDto);
    }

    @GetMapping("/lesson/{id}")
    public LessonComponentResponseDto getLessonComponent(
            @PathVariable Long id
    ) {
        return lessonService.getLessonComponent(id);
    }
}