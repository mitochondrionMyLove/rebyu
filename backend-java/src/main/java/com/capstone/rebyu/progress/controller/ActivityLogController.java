package com.capstone.rebyu.progress.controller;

import com.capstone.rebyu.progress.dto.ActivityLogDto;
import com.capstone.rebyu.progress.service.ActivityLogService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/activity-logs")
@RequiredArgsConstructor
public class ActivityLogController {
    private final ActivityLogService activityLogService;

    @GetMapping
    public List<ActivityLogDto> getAll() {
        return activityLogService.getAll();
    }

    @GetMapping("/{id}")
    public ActivityLogDto getById(@PathVariable Long id) {
        return activityLogService.getById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ActivityLogDto create(@Valid @RequestBody ActivityLogDto dto) {
        return activityLogService.create(dto);
    }

    @PutMapping("/{id}")
    public ActivityLogDto update(@PathVariable Long id, @Valid @RequestBody ActivityLogDto dto) {
        return activityLogService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        activityLogService.delete(id);
    }
}
