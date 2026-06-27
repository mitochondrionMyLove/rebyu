package com.capstone.rebyu.progress.controller;

import com.capstone.rebyu.progress.dto.ActivityTypeDto;
import com.capstone.rebyu.progress.service.ActivityTypeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/activity-types")
@RequiredArgsConstructor
public class ActivityTypeController {
    private final ActivityTypeService activityTypeService;

    @GetMapping
    public List<ActivityTypeDto> getAll() {
        return activityTypeService.getAll();
    }

    @GetMapping("/{id}")
    public ActivityTypeDto getById(@PathVariable Long id) {
        return activityTypeService.getById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ActivityTypeDto create(@Valid @RequestBody ActivityTypeDto dto) {
        return activityTypeService.create(dto);
    }

    @PutMapping("/{id}")
    public ActivityTypeDto update(@PathVariable Long id, @Valid @RequestBody ActivityTypeDto dto) {
        return activityTypeService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        activityTypeService.delete(id);
    }
}
