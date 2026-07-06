package com.capstone.rebyu.ai.dto.lesson.data;

public record ImageRightTextToolDataDto(
        Object file,
        String imageKey,
        String title,
        String description
) {
    public static ImageRightTextToolDataDto draft(String title, String description) {
        return new ImageRightTextToolDataDto(null, "", title, description);
    }
}
