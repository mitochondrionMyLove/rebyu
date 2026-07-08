package com.capstone.rebyu.ai.dto;

import dev.langchain4j.agent.tool.P;
import java.util.List;
import java.util.UUID;

public record ImageFeatureGridToolInputDto(
        @P("The draft section ID this tool belongs to") UUID sectionDraftId,
        @P("A short header text") String smallHeader,
        @P("A brief description") String description,
        @P("Grid items, each with a title and description") List<GridItemInputDto> gridItems,
        @P("Optional authoring notes for the admin") String authoringNotes
) {}
