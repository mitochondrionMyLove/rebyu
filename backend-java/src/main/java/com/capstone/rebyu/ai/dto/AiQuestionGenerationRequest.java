package com.capstone.rebyu.ai.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AiQuestionGenerationRequest {
    private Long certificationId;
    private Long lessonId;
    private List<QuestionTypeRequest> questionTypes;
    private String additionalInstructions;
}
