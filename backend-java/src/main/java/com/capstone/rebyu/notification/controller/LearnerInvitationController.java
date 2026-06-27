package com.capstone.rebyu.notification.controller;

import com.capstone.rebyu.notification.dto.LearnerInvitationDto;
import com.capstone.rebyu.notification.service.LearnerInvitationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/learner-invitations")
@RequiredArgsConstructor
public class LearnerInvitationController {
    private final LearnerInvitationService learnerInvitationService;

    @GetMapping
    public List<LearnerInvitationDto> getAll() {
        return learnerInvitationService.getAll();
    }

    @GetMapping("/{id}")
    public LearnerInvitationDto getById(@PathVariable Long id) {
        return learnerInvitationService.getById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public LearnerInvitationDto create(@Valid @RequestBody LearnerInvitationDto dto) {
        return learnerInvitationService.create(dto);
    }

    @PutMapping("/{id}")
    public LearnerInvitationDto update(@PathVariable Long id, @Valid @RequestBody LearnerInvitationDto dto) {
        return learnerInvitationService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        learnerInvitationService.delete(id);
    }
}
