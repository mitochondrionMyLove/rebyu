package com.capstone.rebyu.partnership.controller;

import com.capstone.rebyu.partnership.dto.PartnershipRequestItemDto;
import com.capstone.rebyu.partnership.service.PartnershipRequestItemService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/partnership-request-items")
@RequiredArgsConstructor
public class PartnershipRequestItemController {
    private final PartnershipRequestItemService partnershipRequestItemService;

    @GetMapping
    public List<PartnershipRequestItemDto> getAll() {
        return partnershipRequestItemService.getAll();
    }

    @GetMapping("/{id}")
    public PartnershipRequestItemDto getById(@PathVariable Long id) {
        return partnershipRequestItemService.getById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PartnershipRequestItemDto create(@Valid @RequestBody PartnershipRequestItemDto dto) {
        return partnershipRequestItemService.create(dto);
    }

    @PutMapping("/{id}")
    public PartnershipRequestItemDto update(@PathVariable Long id, @Valid @RequestBody PartnershipRequestItemDto dto) {
        return partnershipRequestItemService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        partnershipRequestItemService.delete(id);
    }
}
