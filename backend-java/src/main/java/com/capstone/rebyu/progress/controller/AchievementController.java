package com.capstone.rebyu.progress.controller;

import com.capstone.rebyu.progress.dto.AchievementDto;
import com.capstone.rebyu.progress.service.AchievementService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/achievements")
@RequiredArgsConstructor
public class AchievementController {
    private final AchievementService achievementService;

    @GetMapping
    public List<AchievementDto> getAll() {
        return achievementService.getAll();
    }

    @GetMapping("/{id}")
    public AchievementDto getById(@PathVariable Long id) {
        return achievementService.getById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AchievementDto create(@Valid @RequestBody AchievementDto dto) {
        return achievementService.create(dto);
    }

    @PutMapping("/{id}")
    public AchievementDto update(@PathVariable Long id, @Valid @RequestBody AchievementDto dto) {
        return achievementService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        achievementService.delete(id);
    }
}
