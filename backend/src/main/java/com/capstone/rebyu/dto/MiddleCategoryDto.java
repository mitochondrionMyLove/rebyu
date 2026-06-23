package com.capstone.rebyu.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MiddleCategoryDto {
    private Long middleCategoryId;

    @NotNull
    private Long majorCategoryId;

    @NotBlank
    @Size(max = 150)
    private String title;

    private Set<LessonDto> lessons;
}
