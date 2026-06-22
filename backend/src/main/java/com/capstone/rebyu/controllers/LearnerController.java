package com.capstone.rebyu.controllers;

import com.capstone.rebyu.dto.LearnerDto;
import com.capstone.rebyu.services.LearnerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/learners")
@RequiredArgsConstructor
public class LearnerController {
    private final LearnerService learnerService;

    @GetMapping
    public List<LearnerDto> getAll() {
        return learnerService.getAll();
    }

    @GetMapping("/{id}")
    public LearnerDto getById(@PathVariable Long id) {
        return learnerService.getById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public LearnerDto create(@Valid @RequestBody LearnerDto dto) {
        return learnerService.create(dto);
    }

    @PutMapping("/{id}")
    public LearnerDto update(@PathVariable Long id, @Valid @RequestBody LearnerDto dto) {
        return learnerService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        learnerService.delete(id);
    }
}
