package com.capstone.rebyu.challenge.controller;

import com.capstone.rebyu.challenge.dto.ChallengeModeDto;
import com.capstone.rebyu.challenge.service.ChallengeModeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/challenge-modes")
@RequiredArgsConstructor
public class ChallengeModeController {
    private final ChallengeModeService challengeModeService;

    @GetMapping
    public List<ChallengeModeDto> getAll() {
        return challengeModeService.getAll();
    }

    @GetMapping("/{id}")
    public ChallengeModeDto getById(@PathVariable Long id) {
        return challengeModeService.getById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ChallengeModeDto create(@Valid @RequestBody ChallengeModeDto dto) {
        return challengeModeService.create(dto);
    }

    @PutMapping("/{id}")
    public ChallengeModeDto update(@PathVariable Long id, @Valid @RequestBody ChallengeModeDto dto) {
        return challengeModeService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        challengeModeService.delete(id);
    }
}
