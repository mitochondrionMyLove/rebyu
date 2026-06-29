package com.capstone.rebyu.enrollment.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LearnerOrderDetailDto {
    private Long orderDetailId;

    @NotNull
    private Long orderId;

    @NotNull
    private Long certificationId;

    @NotNull
    @PositiveOrZero
    private BigDecimal price;
}
