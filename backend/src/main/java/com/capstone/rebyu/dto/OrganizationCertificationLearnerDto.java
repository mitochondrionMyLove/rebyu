package com.capstone.rebyu.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrganizationCertificationLearnerDto {
    private Long orgCertLearnersId;

    @NotNull
    private Long organizationId;

    @NotNull
    private Long certificationId;

    @NotNull
    private Long learnerId;

    @NotNull
    private LocalDateTime assignedAt;

    @DecimalMin("0.0")
    @DecimalMax("100.0")
    private BigDecimal progress = BigDecimal.ZERO;

    private LocalDateTime completedAt;
}
