package com.capstone.rebyu.partnership.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PartnershipRequestItemDto {
    private Long partnershipRequestItemId;

    @NotNull
    private Long requestId;

    @NotNull
    private Long certificationId;

    @NotNull
    @Min(1)
    private Integer slots;

    @NotNull
    private LocalDate requestedAccessStartDate;

    @NotNull
    private LocalDate requestedAccessEndDate;
}
