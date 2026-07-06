package com.capstone.rebyu.ai.dto;

import jakarta.validation.constraints.NotBlank;

public record LessonAccordionItemInputDto(
        @NotBlank String title,
        @NotBlank String content
) {
}
