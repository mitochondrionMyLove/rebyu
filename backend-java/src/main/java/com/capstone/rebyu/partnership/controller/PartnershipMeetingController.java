package com.capstone.rebyu.partnership.controller;

import com.capstone.rebyu.partnership.dto.PartnershipMeetingDto;
import com.capstone.rebyu.partnership.service.PartnershipMeetingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/partnership-meetings")
@RequiredArgsConstructor
public class PartnershipMeetingController {
    private final PartnershipMeetingService partnershipMeetingService;

    @GetMapping
    public List<PartnershipMeetingDto> getAll() {
        return partnershipMeetingService.getAll();
    }

    @GetMapping("/{id}")
    public PartnershipMeetingDto getById(@PathVariable Long id) {
        return partnershipMeetingService.getById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PartnershipMeetingDto create(@Valid @RequestBody PartnershipMeetingDto dto) {
        return partnershipMeetingService.create(dto);
    }

    @PutMapping("/{id}")
    public PartnershipMeetingDto update(@PathVariable Long id, @Valid @RequestBody PartnershipMeetingDto dto) {
        return partnershipMeetingService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        partnershipMeetingService.delete(id);
    }
}
