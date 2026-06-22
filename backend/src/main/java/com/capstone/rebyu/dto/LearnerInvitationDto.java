package com.capstone.rebyu.dto;

import com.capstone.rebyu.models.LearnerInvitation;
import jakarta.validation.constraints.Email;
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
public class LearnerInvitationDto {
    private Long invitationId;

    @NotNull
    private Long enterpriseId;

    private Long certificationId;

    private Long learnerId;

    @NotBlank
    @Email
    @Size(max = 100)
    private String email;

    @NotNull
    private LocalDateTime sentDate;

    @NotNull
    private LearnerInvitation.Status status = LearnerInvitation.Status.PENDING;
}
