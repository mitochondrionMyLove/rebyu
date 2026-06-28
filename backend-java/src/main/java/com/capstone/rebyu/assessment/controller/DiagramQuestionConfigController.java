package com.capstone.rebyu.assessment.controller;

import com.capstone.rebyu.assessment.dto.DiagramQuestionConfigDto;
import com.capstone.rebyu.assessment.service.DiagramQuestionConfigService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/diagram-question-configs")
@RequiredArgsConstructor
public class DiagramQuestionConfigController {
    private final DiagramQuestionConfigService diagramQuestionConfigService;

    @GetMapping
    public List<DiagramQuestionConfigDto> getAll() {
        return diagramQuestionConfigService.getAll();
    }

    @GetMapping("/{id}")
    public DiagramQuestionConfigDto getById(@PathVariable Long id) {
        return diagramQuestionConfigService.getById(id);
    }

    @GetMapping("/by-question/{questionId}")
    public DiagramQuestionConfigDto getByQuestionId(@PathVariable Long questionId) {
        return diagramQuestionConfigService.getByQuestionId(questionId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public DiagramQuestionConfigDto create(@Valid @RequestBody DiagramQuestionConfigDto dto) {
        return diagramQuestionConfigService.create(dto);
    }

    @PutMapping("/{id}")
    public DiagramQuestionConfigDto update(@PathVariable Long id, @Valid @RequestBody DiagramQuestionConfigDto dto) {
        return diagramQuestionConfigService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        diagramQuestionConfigService.delete(id);
    }
}
