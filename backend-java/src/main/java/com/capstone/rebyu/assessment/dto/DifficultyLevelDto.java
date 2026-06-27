package com.capstone.rebyu.assessment.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DifficultyLevelDto {
    private Long difficultyLevelId;

    @NotBlank
    @Pattern(regexp = "easy|average|hard")
    private String difficultyLevelText;
}
