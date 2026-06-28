package com.capstone.rebyu.challenge.controller;

import com.capstone.rebyu.challenge.dto.ChallengeModeIndustryDto;
import com.capstone.rebyu.challenge.service.ChallengeModeIndustryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/challenge-mode-industries")
@RequiredArgsConstructor
public class ChallengeModeIndustryController {
    private final ChallengeModeIndustryService challengeModeIndustryService;

    @GetMapping
    public List<ChallengeModeIndustryDto> getAll() {
        return challengeModeIndustryService.getAll();
    }

    @GetMapping("/{id}")
    public ChallengeModeIndustryDto getById(@PathVariable Long id) {
        return challengeModeIndustryService.getById(id);
    }

    @GetMapping("/by-mode/{challengeModeId}")
    public List<ChallengeModeIndustryDto> getByChallengeModeId(@PathVariable Long challengeModeId) {
        return challengeModeIndustryService.getByChallengeModeId(challengeModeId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ChallengeModeIndustryDto create(@Valid @RequestBody ChallengeModeIndustryDto dto) {
        return challengeModeIndustryService.create(dto);
    }

    @PutMapping("/{id}")
    public ChallengeModeIndustryDto update(@PathVariable Long id, @Valid @RequestBody ChallengeModeIndustryDto dto) {
        return challengeModeIndustryService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        challengeModeIndustryService.delete(id);
    }
}
