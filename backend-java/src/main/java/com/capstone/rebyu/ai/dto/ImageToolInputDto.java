package com.capstone.rebyu.ai.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;
import java.util.UUID;

public record ImageToolInputDto(
        @NotNull UUID sectionDraftId,
        @NotBlank String authoringNotes,
        String altText,
        @NotEmpty List<@Valid LessonToolEvidenceInputDto> evidence
) {
}
