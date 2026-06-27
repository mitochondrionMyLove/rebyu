package com.capstone.rebyu.assessment.controller;

import com.capstone.rebyu.assessment.dto.ChoiceDto;
import com.capstone.rebyu.assessment.service.ChoiceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/choices")
@RequiredArgsConstructor
public class ChoiceController {
    private final ChoiceService choiceService;

    @GetMapping
    public List<ChoiceDto> getAll() {
        return choiceService.getAll();
    }

    @GetMapping("/{id}")
    public ChoiceDto getById(@PathVariable Long id) {
        return choiceService.getById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ChoiceDto create(@Valid @RequestBody ChoiceDto dto) {
        return choiceService.create(dto);
    }

    @PutMapping("/{id}")
    public ChoiceDto update(@PathVariable Long id, @Valid @RequestBody ChoiceDto dto) {
        return choiceService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        choiceService.delete(id);
    }
}
