package com.capstone.rebyu.controllers;

import com.capstone.rebyu.dto.PartnershipRequestDto;
import com.capstone.rebyu.services.PartnershipRequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/partnership-requests")
@RequiredArgsConstructor
public class PartnershipRequestController {
    private final PartnershipRequestService partnershipRequestService;

    @GetMapping
    public List<PartnershipRequestDto> getAll() {
        return partnershipRequestService.getAll();
    }

    @GetMapping("/{id}")
    public PartnershipRequestDto getById(@PathVariable Long id) {
        return partnershipRequestService.getById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PartnershipRequestDto create(@Valid @RequestBody PartnershipRequestDto dto) {
        return partnershipRequestService.create(dto);
    }

    @PutMapping("/{id}")
    public PartnershipRequestDto update(@PathVariable Long id, @Valid @RequestBody PartnershipRequestDto dto) {
        return partnershipRequestService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        partnershipRequestService.delete(id);
    }
}
