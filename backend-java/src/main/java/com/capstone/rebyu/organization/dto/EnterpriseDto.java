package com.capstone.rebyu.organization.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EnterpriseDto {
    private Long enterpriseId;

    @NotBlank
    @Size(max = 100)
    private String enterpriseName;

    @NotBlank
    @Size(max = 100)
    private String industry;

    private boolean isVerified = false;
}
