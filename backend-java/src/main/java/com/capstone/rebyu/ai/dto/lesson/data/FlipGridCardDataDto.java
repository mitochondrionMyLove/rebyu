package com.capstone.rebyu.ai.dto.lesson.data;

import java.util.UUID;

public record FlipGridCardDataDto(
        UUID id,
        String frontTitle,
        String backTitle,
        String description
) {
}
