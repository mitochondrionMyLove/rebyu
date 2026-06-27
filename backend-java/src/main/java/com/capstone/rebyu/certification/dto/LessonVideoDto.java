package com.capstone.rebyu.certification.dto;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LessonVideoDto {
    private Long lessonVideoId;

    @NotNull
    private Integer lessonId;

    @NotNull
    private String sectionName;

    @NotBlank
    private String toolId;

    @NotBlank
    private String videoKey;
}
