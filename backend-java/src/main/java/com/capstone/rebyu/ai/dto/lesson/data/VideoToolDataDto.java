package com.capstone.rebyu.ai.dto.lesson.data;

public record VideoToolDataDto(Object file, String videoKey) {
    public static VideoToolDataDto draft() {
        return new VideoToolDataDto(null, "");
    }

    public static VideoToolDataDto draft(String videoKey) {
        return new VideoToolDataDto(null, videoKey == null ? "" : videoKey);
    }
}
