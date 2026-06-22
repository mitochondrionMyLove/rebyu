package com.capstone.rebyu.dto;

import com.capstone.rebyu.models.LearnerLessonMastery;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LearnerLessonMasteryDto {
    @NotNull
    private Long learnerId;

    @NotNull
    private Long lessonId;

    @DecimalMin("0.0")
    @DecimalMax("1.0")
    private Double masteryProbability = 0.0;

    @NotNull
    private LearnerLessonMastery.MasteryLevel masteryLevel;

    @NotNull
    private LocalDateTime lastUpdated;
}
