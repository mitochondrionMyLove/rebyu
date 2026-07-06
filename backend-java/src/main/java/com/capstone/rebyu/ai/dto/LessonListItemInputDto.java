package com.capstone.rebyu.ai.dto;

import jakarta.validation.constraints.NotBlank;

public record LessonListItemInputDto(
        @NotBlank String text
) {
}
