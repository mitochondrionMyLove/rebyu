package com.capstone.rebyu.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
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
public class ExamResultDto {
    @NotNull
    private Long learnerId;

    @NotNull
    private Long examId;

    @NotNull
    @Min(1)
    private Integer attemptNo;

    @NotNull
    private LocalDateTime dateTaken;

    @NotNull
    @DecimalMin("0.0")
    @DecimalMax("100.0")
    private BigDecimal score;

    @Min(0)
    private Integer duration;

    @NotNull
    private Boolean result;
}
