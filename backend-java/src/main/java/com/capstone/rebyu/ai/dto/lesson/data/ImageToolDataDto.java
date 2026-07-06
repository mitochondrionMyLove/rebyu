package com.capstone.rebyu.ai.dto.lesson.data;

public record ImageToolDataDto(Object file, String imageKey) {
    public static ImageToolDataDto draft() {
        return new ImageToolDataDto(null, "");
    }
}
