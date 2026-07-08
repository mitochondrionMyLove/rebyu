package com.capstone.rebyu.ai.dto.lesson.data;

import java.util.List;

public record ContentAccordionBlockToolDataDto(
        String smallHeader,
        String description,
        List<AccordionItemDataDto> items
) {}
