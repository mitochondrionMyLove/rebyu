package com.capstone.rebyu.ai.dto.lesson.data;

public record ImageLeftTextToolDataDto(
        Object file,
        String imageKey,
        String title,
        String description
) {
    public static ImageLeftTextToolDataDto draft(String title, String description) {
        return new ImageLeftTextToolDataDto(null, "", title, description);
    }
}
