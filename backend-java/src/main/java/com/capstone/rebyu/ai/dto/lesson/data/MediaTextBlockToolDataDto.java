package com.capstone.rebyu.ai.dto.lesson.data;

public record MediaTextBlockToolDataDto(
        String smallHeader,
        String description,
        String mediaType,
        Object file,
        String imageKey,
        String videoKey,
        String supportingTitle,
        String supportingDescription,
        String layout
) {
    public static MediaTextBlockToolDataDto draft(
            String smallHeader, String description,
            String supportingTitle, String supportingDescription,
            String mediaType, String layout
    ) {
        return new MediaTextBlockToolDataDto(
                smallHeader, description, mediaType,
                null, "", "", supportingTitle, supportingDescription, layout
        );
    }
}
