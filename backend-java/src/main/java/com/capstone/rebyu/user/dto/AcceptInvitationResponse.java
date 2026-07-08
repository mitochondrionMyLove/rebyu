package com.capstone.rebyu.user.dto;

/** Result of a successful invitation acceptance. */
public record AcceptInvitationResponse(
        String message,
        Long certificationId,
        String certificationTitle,
        Long enrollmentId
) {
}
