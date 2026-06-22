package com.capstone.rebyu.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LessonDto {
    private Long lessonId;

    @NotNull
    private Long middleCategoryId;

    @NotBlank
    @Size(max = 150)
    private String name;

    @NotBlank
    private String lessonComponentStructure = "[]";
}
