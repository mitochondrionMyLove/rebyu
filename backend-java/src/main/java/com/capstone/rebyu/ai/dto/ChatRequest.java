package com.capstone.rebyu.ai.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatRequest {

    @NotBlank
    private String message;

    @NotBlank
    private String sessionId;

    @NotBlank
    private int lessonId;
}
