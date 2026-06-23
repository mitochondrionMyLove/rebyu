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
public class MajorCategoryDto {
    private Long majorCategoryId;

    @NotNull
    private Long certificationId;

    @NotBlank
    @Size(max = 150)
    private String title;

    private Set<MiddleCategoryDto> middleCategory;
}
