package com.capstone.rebyu.assessment.controller;

import com.capstone.rebyu.assessment.dto.TextQuestionConfigDto;
import com.capstone.rebyu.assessment.service.TextQuestionConfigService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/text-question-configs")
@RequiredArgsConstructor
public class TextQuestionConfigController {
    private final TextQuestionConfigService textQuestionConfigService;

    @GetMapping
    public List<TextQuestionConfigDto> getAll() {
        return textQuestionConfigService.getAll();
    }

    @GetMapping("/{id}")
    public TextQuestionConfigDto getById(@PathVariable Long id) {
        return textQuestionConfigService.getById(id);
    }

    @GetMapping("/by-question/{questionId}")
    public TextQuestionConfigDto getByQuestionId(@PathVariable Long questionId) {
        return textQuestionConfigService.getByQuestionId(questionId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TextQuestionConfigDto create(@Valid @RequestBody TextQuestionConfigDto dto) {
        return textQuestionConfigService.create(dto);
    }

    @PutMapping("/{id}")
    public TextQuestionConfigDto update(@PathVariable Long id, @Valid @RequestBody TextQuestionConfigDto dto) {
        return textQuestionConfigService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        textQuestionConfigService.delete(id);
    }
}
