package com.capstone.rebyu.user.dto;

import jakarta.validation.constraints.NotBlank;

public record AcceptInvitationRequest(

        @NotBlank(message = "Invitation token is required.")
        String token

) {
}
