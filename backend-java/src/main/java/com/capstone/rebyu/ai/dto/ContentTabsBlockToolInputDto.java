package com.capstone.rebyu.ai.dto;

import dev.langchain4j.agent.tool.P;
import java.util.List;
import java.util.UUID;

public record ContentTabsBlockToolInputDto(
        @P("The draft section ID this tool belongs to") UUID sectionDraftId,
        @P("A short header text") String smallHeader,
        @P("A brief description introducing the tabs") String description,
        @P("Tab items, each with a label, title, and description") List<LessonTabItemInputDto> items,
        @P("Optional authoring notes for the admin") String authoringNotes
) {}
