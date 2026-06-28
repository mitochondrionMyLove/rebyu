package com.capstone.rebyu.assessment.controller;

import com.capstone.rebyu.assessment.dto.CodingTestCaseDto;
import com.capstone.rebyu.assessment.service.CodingTestCaseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/coding-test-cases")
@RequiredArgsConstructor
public class CodingTestCaseController {
    private final CodingTestCaseService codingTestCaseService;

    @GetMapping
    public List<CodingTestCaseDto> getAll() {
        return codingTestCaseService.getAll();
    }

    @GetMapping("/{id}")
    public CodingTestCaseDto getById(@PathVariable Long id) {
        return codingTestCaseService.getById(id);
    }

    @GetMapping("/by-question/{noChoiceQuestionId}")
    public List<CodingTestCaseDto> getByNoChoiceQuestionId(@PathVariable Long noChoiceQuestionId) {
        return codingTestCaseService.getByNoChoiceQuestionId(noChoiceQuestionId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CodingTestCaseDto create(@Valid @RequestBody CodingTestCaseDto dto) {
        return codingTestCaseService.create(dto);
    }

    @PutMapping("/{id}")
    public CodingTestCaseDto update(@PathVariable Long id, @Valid @RequestBody CodingTestCaseDto dto) {
        return codingTestCaseService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        codingTestCaseService.delete(id);
    }
}
