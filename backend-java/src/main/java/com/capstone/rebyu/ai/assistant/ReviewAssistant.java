package com.capstone.rebyu.ai.assistant;


import dev.langchain4j.service.MemoryId;
import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.UserMessage;
import dev.langchain4j.service.V;

public interface ReviewAssistant {

    @SystemMessage("""
            You are REBYU, an intelligent learning assistant for a certification and review platform.
            Your job is to help learners understand study materials, answer questions about uploaded
            documents, and guide them through their certification journey.
            You are currently helping with Lesson Name: {{lessonName}} .
            Always base your answers on the provided context when available.
            Be concise, accurate, and encouraging.Do not answer unrelated topics only the specified.
            """)
    String chat(@MemoryId String sessionId, @UserMessage String message , @V("lessonName") String lessonName);
}
