package com.capstone.rebyu.enterprisegroup.dto;

import com.capstone.rebyu.enterprisegroup.entity.EnterpriseGroup;
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
public class EnterpriseGroupDto {
    private Long enterpriseGroupId;

    @NotNull
    private Long enterpriseId;

    @NotNull
    private Long orgCertId;

    @NotBlank
    @Size(max = 150)
    private String groupName;

    @Size(max = 500)
    private String groupDescription;

    @NotNull
    private Long createdBy;

    private LocalDateTime createdAt;

    private EnterpriseGroup.Status status = EnterpriseGroup.Status.active;
}
