package com.capstone.rebyu.ai.dto;

import dev.langchain4j.agent.tool.P;
import java.util.UUID;

public record MediaTextBlockToolInputDto(
        @P("The draft section ID this tool belongs to") UUID sectionDraftId,
        @P("A short header text") String smallHeader,
        @P("A brief description") String description,
        @P("Type of media: 'image' or 'video'") String mediaType,
        @P("Title of the supporting text section") String supportingTitle,
        @P("Description of the supporting text section") String supportingDescription,
        @P("Layout: 'image-left' or 'image-right'") String layout,
        @P("Optional authoring notes for the admin") String authoringNotes
) {}
