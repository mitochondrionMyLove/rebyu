package com.capstone.rebyu.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LearnerDto {
    private Long learnerId;
    @NotNull
    private Long userId;
    @NotBlank
    @Size(max = 50)
    private String username;
    @NotBlank
    @Size(max = 50)
    private String firstName;
    @NotBlank
    @Size(max = 50)
    private String lastName;
    @DecimalMin(value = "0.0")
    @DecimalMax(value = "100.0")
    private Double readinessScore = 0.0;
    @DecimalMin(value = "0.0")
    @DecimalMax(value = "100.0")
    private Double confidenceLevel = 0.0;
}