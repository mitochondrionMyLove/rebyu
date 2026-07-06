package com.capstone.rebyu.ai.dto;

import java.util.UUID;

public record GeneratedLessonToolDraftDto(
        UUID id,
        String type,
        Object data,
        String authoringNotes
) {
}
