package com.capstone.rebyu.ai.dto;

import dev.langchain4j.agent.tool.P;
import java.util.List;
import java.util.UUID;

public record ReviewCardGridToolInputDto(
        @P("The draft section ID this tool belongs to") UUID sectionDraftId,
        @P("A short header text") String smallHeader,
        @P("A brief description introducing the review cards") String description,
        @P("Review cards, each with frontTitle, backTitle, and description") List<ReviewCardInputDto> cards,
        @P("Optional authoring notes for the admin") String authoringNotes
) {}
