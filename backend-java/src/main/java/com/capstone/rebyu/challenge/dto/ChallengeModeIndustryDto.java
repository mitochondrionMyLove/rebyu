package com.capstone.rebyu.challenge.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChallengeModeIndustryDto {
    private Long challengeModeIndustryId;

    @NotBlank
    @Size(max = 100)
    private String industry;

    @NotNull
    private Long challengeModeId;
}
