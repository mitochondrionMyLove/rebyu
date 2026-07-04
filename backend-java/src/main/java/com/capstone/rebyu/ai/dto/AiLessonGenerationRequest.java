package com.capstone.rebyu.ai.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AiLessonGenerationRequest {
    private Long lessonId;
    private String learnerLevel = "intermediate";
    private String additionalInstructions;
}
