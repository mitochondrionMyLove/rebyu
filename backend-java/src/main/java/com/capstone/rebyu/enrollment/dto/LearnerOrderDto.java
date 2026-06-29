package com.capstone.rebyu.enrollment.dto;

import com.capstone.rebyu.enrollment.entity.LearnerOrder;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
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

    @NotBlank
    @Size(max = 50)
    private String orderNumber;

    @NotNull
    private Long learnerId;

    private LocalDateTime orderedAt;

    @NotNull
    @Positive
    private BigDecimal subtotal;

    private BigDecimal discountAmount = BigDecimal.ZERO;

    @NotNull
    @Positive
    private BigDecimal totalAmount;

    private String paymentReference;

    private LocalDateTime paidAt;

    private LearnerOrder.Status status = LearnerOrder.Status.pending;
}
