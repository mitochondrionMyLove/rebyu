package com.capstone.rebyu.ai.dto;

import java.util.List;
import java.util.UUID;

public record GeneratedLessonSectionDraftDto(
        UUID id,
        String sectionName,
        List<GeneratedLessonToolDraftDto> content
) {
}
