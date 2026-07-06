package com.capstone.rebyu.ai.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record HeadingToolInputDto(
        @NotNull UUID sectionDraftId,
        @NotBlank String text,
        String authoringNotes
) {
}
