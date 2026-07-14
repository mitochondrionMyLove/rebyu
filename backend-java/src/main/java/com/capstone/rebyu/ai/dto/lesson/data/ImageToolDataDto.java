package com.capstone.rebyu.ai.dto.lesson.data;

public record ImageToolDataDto(Object file, String imageKey) {
    public static ImageToolDataDto draft() {
        return new ImageToolDataDto(null, "");
    }

    public static ImageToolDataDto draft(String imageKey) {
        return new ImageToolDataDto(null, imageKey == null ? "" : imageKey);
    }
}
