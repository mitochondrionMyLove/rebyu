package com.capstone.rebyu.ai.dto;

import jakarta.validation.constraints.NotBlank;

public record LessonTabItemInputDto(
        @NotBlank String label,
        @NotBlank String title,
        @NotBlank String description
) {
}
