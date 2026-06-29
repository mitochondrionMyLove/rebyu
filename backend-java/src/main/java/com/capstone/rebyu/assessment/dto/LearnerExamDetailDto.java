package com.capstone.rebyu.assessment.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LearnerExamDetailDto {
    private Long learnerExamDetailId;

    @NotNull
    private Long learnerId;

    @NotNull
    private Long examId;

    @NotNull
    @Min(1)
    private Integer attemptNo;

    @NotNull
    private Long examQuestionId;

    @NotNull
    private Long questionId;

    @NotNull
    private Long lessonId;

    @NotNull
    private Boolean isCorrect;

    private LocalDateTime answeredAt;

    private BigDecimal earnedScore;
}
