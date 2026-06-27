package com.capstone.rebyu.progress.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LearnerCompletedLessonDto {
    @NotNull
    private Long learnerId;

    @NotNull
    private Long lessonId;

    @NotNull
    private LocalDateTime completedAt;
}
