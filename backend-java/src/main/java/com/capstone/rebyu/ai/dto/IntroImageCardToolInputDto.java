package com.capstone.rebyu.ai.dto;

import dev.langchain4j.agent.tool.P;
import java.util.UUID;

public record IntroImageCardToolInputDto(
        @P("The draft section ID this tool belongs to") UUID sectionDraftId,
        @P("A short header text for the card") String smallHeader,
        @P("The main description text for the card") String description,
        @P("Optional authoring notes for the admin") String authoringNotes
) {}
