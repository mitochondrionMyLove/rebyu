package com.capstone.rebyu.ai.dto;

import dev.langchain4j.agent.tool.P;
import java.util.List;
import java.util.UUID;

public record ContentAccordionBlockToolInputDto(
        @P("The draft section ID this tool belongs to") UUID sectionDraftId,
        @P("A short header text") String smallHeader,
        @P("A brief description introducing the accordion") String description,
        @P("Accordion items, each with a title and content") List<LessonAccordionItemInputDto> items,
        @P("Optional authoring notes for the admin") String authoringNotes
) {}
