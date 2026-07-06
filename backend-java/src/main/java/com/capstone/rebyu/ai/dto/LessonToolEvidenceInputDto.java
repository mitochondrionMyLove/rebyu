package com.capstone.rebyu.ai.dto;

import jakarta.validation.constraints.NotBlank;

public record LessonToolEvidenceInputDto(
        @NotBlank String sourceChunkId
) {
}
