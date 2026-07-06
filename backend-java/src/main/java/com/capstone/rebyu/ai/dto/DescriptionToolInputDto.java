package com.capstone.rebyu.ai.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;
import java.util.UUID;

public record DescriptionToolInputDto(
        @NotNull UUID sectionDraftId,
        @NotBlank String text,
        @NotEmpty List<@Valid LessonToolEvidenceInputDto> evidence,
        String authoringNotes
) {
}
