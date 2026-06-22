package com.capstone.rebyu.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrganizationCertificateDto {
    private Long orgCertId;

    @NotNull
    private Long enterpriseId;

    @NotNull
    private Long certificationId;

    @NotNull
    @Min(0)
    private Integer totalSlots;

    @Min(0)
    private Integer usedSlots = 0;

    private Integer remainingSlots;
}
