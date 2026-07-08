package com.capstone.rebyu.ai.dto.lesson.data;

import java.util.List;

public record ImageFeatureGridToolDataDto(
        String smallHeader,
        String description,
        Object file,
        String imageKey,
        List<GridItemDataDto> gridItems
) {
    public static ImageFeatureGridToolDataDto draft(String smallHeader, String description, List<GridItemDataDto> gridItems) {
        return new ImageFeatureGridToolDataDto(smallHeader, description, null, "", gridItems);
    }
}
