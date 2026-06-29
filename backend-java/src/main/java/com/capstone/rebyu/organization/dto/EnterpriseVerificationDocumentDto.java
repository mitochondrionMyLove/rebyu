package com.capstone.rebyu.organization.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EnterpriseVerificationDocumentDto {
    private Long enterpriseDocumentId;

    @NotNull
    private Long enterpriseId;

    @NotBlank
    @Size(max = 50)
    private String documentType;

    @NotBlank
    @Size(max = 500)
    private String fileKey;

    @NotNull
    private LocalDateTime uploadedAt;
}
