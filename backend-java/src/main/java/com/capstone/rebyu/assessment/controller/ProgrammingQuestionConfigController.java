package com.capstone.rebyu.assessment.controller;

import com.capstone.rebyu.assessment.dto.ProgrammingQuestionConfigDto;
import com.capstone.rebyu.assessment.service.ProgrammingQuestionConfigService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/programming-question-configs")
@RequiredArgsConstructor
public class ProgrammingQuestionConfigController {
    private final ProgrammingQuestionConfigService programmingQuestionConfigService;

    @GetMapping
    public List<ProgrammingQuestionConfigDto> getAll() {
        return programmingQuestionConfigService.getAll();
    }

    @GetMapping("/{id}")
    public ProgrammingQuestionConfigDto getById(@PathVariable Long id) {
        return programmingQuestionConfigService.getById(id);
    }

    @GetMapping("/by-question/{questionId}")
    public ProgrammingQuestionConfigDto getByQuestionId(@PathVariable Long questionId) {
        return programmingQuestionConfigService.getByQuestionId(questionId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProgrammingQuestionConfigDto create(@Valid @RequestBody ProgrammingQuestionConfigDto dto) {
        return programmingQuestionConfigService.create(dto);
    }

    @PutMapping("/{id}")
    public ProgrammingQuestionConfigDto update(@PathVariable Long id, @Valid @RequestBody ProgrammingQuestionConfigDto dto) {
        return programmingQuestionConfigService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        programmingQuestionConfigService.delete(id);
    }
}
