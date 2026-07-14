package com.capstone.rebyu.ai.dto.lesson.data;

public record IntroImageCardToolDataDto(
        String smallHeader,
        String description,
        Object file,
        String imageKey
) {
    public static IntroImageCardToolDataDto draft(String smallHeader, String description) {
        return new IntroImageCardToolDataDto(smallHeader, description, null, "");
    }

    public static IntroImageCardToolDataDto draft(String smallHeader, String description, String imageKey) {
        return new IntroImageCardToolDataDto(smallHeader, description, null, imageKey == null ? "" : imageKey);
    }
}
