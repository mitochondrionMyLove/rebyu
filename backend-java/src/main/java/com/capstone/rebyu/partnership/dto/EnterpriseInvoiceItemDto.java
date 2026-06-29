package com.capstone.rebyu.partnership.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EnterpriseInvoiceItemDto {
    private Long enterpriseInvoiceItemId;

    @NotNull
    private Long enterpriseInvoiceId;

    @NotNull
    private Long certificationId;

    @Min(1)
    private Integer learnerSlots;

    @NotNull
    @Min(1)
    private Integer validityMonths;
}
