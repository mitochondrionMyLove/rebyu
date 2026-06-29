package com.capstone.rebyu.organization.dto;

import com.capstone.rebyu.organization.entity.EnterpriseMember;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EnterpriseMemberDto {
    private Long enterpriseMemberId;

    @NotNull
    private Long enterpriseId;

    @NotNull
    private Long userId;

    @NotNull
    private EnterpriseMember.MemberRole memberRole;

    private boolean isPrimaryContact = false;

    @NotNull
    private LocalDateTime joinedAt;
}
