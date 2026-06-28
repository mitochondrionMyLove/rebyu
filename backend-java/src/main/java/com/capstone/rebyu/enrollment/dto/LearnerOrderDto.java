package com.capstone.rebyu.enrollment.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LearnerOrderDto {
    private Long orderId;

    @NotNull
    private Long learnerId;

    private LocalDateTime orderedOn;

    @NotNull
    @Positive
    private BigDecimal totalAmount;
}
