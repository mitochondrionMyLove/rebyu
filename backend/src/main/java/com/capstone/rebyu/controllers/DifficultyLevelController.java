package com.capstone.rebyu.controllers;

import com.capstone.rebyu.dto.DifficultyLevelDto;
import com.capstone.rebyu.services.DifficultyLevelService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/difficulty-levels")
@RequiredArgsConstructor
public class DifficultyLevelController {
    private final DifficultyLevelService difficultyLevelService;

    @GetMapping
    public List<DifficultyLevelDto> getAll() {
        return difficultyLevelService.getAll();
    }

    @GetMapping("/{id}")
    public DifficultyLevelDto getById(@PathVariable Long id) {
        return difficultyLevelService.getById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public DifficultyLevelDto create(@Valid @RequestBody DifficultyLevelDto dto) {
        return difficultyLevelService.create(dto);
    }

    @PutMapping("/{id}")
    public DifficultyLevelDto update(@PathVariable Long id, @Valid @RequestBody DifficultyLevelDto dto) {
        return difficultyLevelService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        difficultyLevelService.delete(id);
    }
}
