package com.capstone.rebyu.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CertificationDto {
    private Long certificationId;

    @NotBlank
    @Size(max = 150)
    private String title;

    @NotBlank
    private String description;

    @Size(max = 255)
    private String imageKey;

    @NotNull
    private LocalDateTime dateCreated;

    @NotNull
    @DecimalMin(value = "0.0")
    private BigDecimal price = BigDecimal.ZERO;

    private Set<MajorCategoryDto> majorCategory;

    private String industry;
}
