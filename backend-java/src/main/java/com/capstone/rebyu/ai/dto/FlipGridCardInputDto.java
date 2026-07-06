package com.capstone.rebyu.ai.dto;

import jakarta.validation.constraints.NotBlank;

public record FlipGridCardInputDto(
        @NotBlank String frontTitle,
        @NotBlank String backTitle,
        @NotBlank String description
) {
}
