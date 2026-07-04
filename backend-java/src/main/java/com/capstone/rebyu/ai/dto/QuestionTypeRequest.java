package com.capstone.rebyu.ai.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuestionTypeRequest {
    private String questionType;
    private int count;
    private String difficulty;
}
