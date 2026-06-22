package com.capstone.rebyu.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LearnerExamDetailDto {
    @NotNull
    private Long learnerId;

    @NotNull
    private Long examId;

    @NotNull
    @Min(1)
    private Integer attemptNo;

    @NotNull
    private Long questionId;

    @NotNull
    private Long lessonId;

    @NotBlank
    @Size(max = 500)
    private String userAnswer;

    @NotNull
    private Boolean result;

    @NotNull
    private LocalDateTime answeredAt;
}
