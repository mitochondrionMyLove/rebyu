package com.capstone.rebyu.ai.dto;

import dev.langchain4j.agent.tool.P;
import java.util.List;
import java.util.UUID;

public record ReviewCardInputDto(
        @P("The front title text of the review card") String frontTitle,
        @P("The back title text of the review card") String backTitle,
        @P("The description or explanation on the back") String description
) {}
