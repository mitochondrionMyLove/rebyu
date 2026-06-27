package com.capstone.rebyu.progress.controller;

import com.capstone.rebyu.progress.dto.LearnerAchievementDto;
import com.capstone.rebyu.progress.service.LearnerAchievementService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/learner-achievements")
@RequiredArgsConstructor
public class LearnerAchievementController {
    private final LearnerAchievementService learnerAchievementService;

    @GetMapping
    public List<LearnerAchievementDto> getAll() {
        return learnerAchievementService.getAll();
    }

    @GetMapping("/{learnerId}/{achievementId}")
    public LearnerAchievementDto getById(@PathVariable Long learnerId, @PathVariable Long achievementId) {
        return learnerAchievementService.getById(learnerId, achievementId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public LearnerAchievementDto create(@Valid @RequestBody LearnerAchievementDto dto) {
        return learnerAchievementService.create(dto);
    }

    @PutMapping("/{learnerId}/{achievementId}")
    public LearnerAchievementDto update(@PathVariable Long learnerId, @PathVariable Long achievementId,
                                         @Valid @RequestBody LearnerAchievementDto dto) {
        return learnerAchievementService.update(learnerId, achievementId, dto);
    }

    @DeleteMapping("/{learnerId}/{achievementId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long learnerId, @PathVariable Long achievementId) {
        learnerAchievementService.delete(learnerId, achievementId);
    }
}
