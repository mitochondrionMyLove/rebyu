package com.capstone.rebyu.ai.dto.lesson.data;

import java.util.List;

public record HeaderDescriptionGridToolDataDto(
        String smallHeader,
        String description,
        List<GridItemDataDto> gridItems
) {}
