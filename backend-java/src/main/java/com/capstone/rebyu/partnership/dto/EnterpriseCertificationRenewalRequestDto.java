package com.capstone.rebyu.partnership.dto;

import com.capstone.rebyu.partnership.entity.EnterpriseCertificationRenewalRequest;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EnterpriseCertificationRenewalRequestDto {
    private Long renewalRequestId;

    @NotNull
    private Long orgCertId;

    @NotNull
    private Integer requestedValidityMonths;

    @NotNull
    private LocalDateTime requestedAt;

    private EnterpriseCertificationRenewalRequest.Status status;

    private LocalDateTime reviewedAt;
}
