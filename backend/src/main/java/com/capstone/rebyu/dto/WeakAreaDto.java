package com.capstone.rebyu.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WeakAreaDto {
    @NotNull
    private Long learnerId;
    @NotNull
    private Long lessonId;
    @Min(0)
    private Integer totalAttempts = 0;
    @Min(0)
    private Integer correctCount = 0;
    @Min(0)
    private Integer incorrectCount = 0;
    private Double accuracyRate = 0.0;
    private Double masteryProbability = 0.0;
    private String weaknessLevel;
    private LocalDateTime lastUpdated;
}