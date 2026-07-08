package com.capstone.rebyu.ai.dto.lesson.data;

import java.util.List;

public record ReviewCardGridToolDataDto(
        String smallHeader,
        String description,
        List<ReviewCardDataDto> cards
) {}
