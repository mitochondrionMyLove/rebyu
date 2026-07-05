package com.capstone.rebyu.ai.common;

public class InvalidAiGeneratedQuestionException extends RuntimeException {

    public InvalidAiGeneratedQuestionException(String message) {
        super(message);
    }

    public InvalidAiGeneratedQuestionException(String message, Throwable cause) {
        super(message, cause);
    }
}
