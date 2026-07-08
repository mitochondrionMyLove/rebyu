package com.capstone.rebyu.ai.dto.lesson.data;

import java.util.List;

public record ContentTabsBlockToolDataDto(
        String smallHeader,
        String description,
        List<TabItemDataDto> items
) {}
