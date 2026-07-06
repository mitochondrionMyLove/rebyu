package com.capstone.rebyu.ai.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public record LessonSectionDraftInputDto(
        @NotBlank String sectionName,
        @NotEmpty List<@Valid LessonToolEvidenceInputDto> evidence
) {
}
