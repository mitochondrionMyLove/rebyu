package com.capstone.rebyu.ai.service;

import com.capstone.rebyu.ai.assistant.ReviewAssistant;
import com.capstone.rebyu.ai.dto.ChatRequest;
import com.capstone.rebyu.ai.dto.ChatResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class AiChatService {

    private final ReviewAssistant reviewAssistant;

    public ChatResponse chat(ChatRequest request) {
        log.debug("Chat request from session={}, lessonId={}", request.getSessionId(), request.getLessonName());
        String reply = reviewAssistant.chat(request.getSessionId(), request.getMessage(), request.getLessonName());
        return new ChatResponse(reply, request.getSessionId());
    }
}
