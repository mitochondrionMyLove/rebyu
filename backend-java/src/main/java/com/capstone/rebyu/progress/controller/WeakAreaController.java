package com.capstone.rebyu.progress.controller;

import com.capstone.rebyu.progress.dto.WeakAreaDto;
import com.capstone.rebyu.progress.service.WeakAreaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/weak-areas")
@RequiredArgsConstructor
public class WeakAreaController {
    private final WeakAreaService weakAreaService;

    @GetMapping
    public List<WeakAreaDto> getAll() {
        return weakAreaService.getAll();
    }

    @GetMapping("/{learnerId}/{lessonId}")
    public WeakAreaDto getById(@PathVariable Long learnerId, @PathVariable Long lessonId) {
        return weakAreaService.getById(learnerId, lessonId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public WeakAreaDto create(@Valid @RequestBody WeakAreaDto dto) {
        return weakAreaService.create(dto);
    }

    @PutMapping("/{learnerId}/{lessonId}")
    public WeakAreaDto update(@PathVariable Long learnerId, @PathVariable Long lessonId, @Valid @RequestBody WeakAreaDto dto) {
        return weakAreaService.update(learnerId, lessonId, dto);
    }

    @DeleteMapping("/{learnerId}/{lessonId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long learnerId, @PathVariable Long lessonId) {
        weakAreaService.delete(learnerId, lessonId);
    }
}
