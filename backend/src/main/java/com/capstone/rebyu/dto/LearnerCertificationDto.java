package com.capstone.rebyu.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LearnerCertificationDto {
    @NotNull
    private Long learnerId;

    @NotNull
    private Long certificationId;

    @NotNull
    private LocalDateTime datePurchased;
}
