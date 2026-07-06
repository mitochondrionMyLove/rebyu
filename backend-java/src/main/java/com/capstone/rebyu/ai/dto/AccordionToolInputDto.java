package com.capstone.rebyu.ai.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;
import java.util.UUID;

public record AccordionToolInputDto(
        @NotNull UUID sectionDraftId,
        @Size(min = 1) List<@Valid LessonAccordionItemInputDto> items,
        @NotEmpty List<@Valid LessonToolEvidenceInputDto> evidence,
        String authoringNotes
) {
}
