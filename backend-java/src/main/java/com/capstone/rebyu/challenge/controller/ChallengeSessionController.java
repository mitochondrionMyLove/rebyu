package com.capstone.rebyu.challenge.controller;

import com.capstone.rebyu.challenge.dto.ChallengeSessionDto;
import com.capstone.rebyu.challenge.service.ChallengeSessionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/challenge-sessions")
@RequiredArgsConstructor
public class ChallengeSessionController {
    private final ChallengeSessionService challengeSessionService;

    @GetMapping
    public List<ChallengeSessionDto> getAll() {
        return challengeSessionService.getAll();
    }

    @GetMapping("/{id}")
    public ChallengeSessionDto getById(@PathVariable Long id) {
        return challengeSessionService.getById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ChallengeSessionDto create(@Valid @RequestBody ChallengeSessionDto dto) {
        return challengeSessionService.create(dto);
    }

    @PutMapping("/{id}")
    public ChallengeSessionDto update(@PathVariable Long id, @Valid @RequestBody ChallengeSessionDto dto) {
        return challengeSessionService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        challengeSessionService.delete(id);
    }
}
