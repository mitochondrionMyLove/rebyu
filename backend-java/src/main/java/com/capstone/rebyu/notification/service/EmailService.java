package com.capstone.rebyu.notification.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender mailSender;

    @Value("${app.mail.from}")
    private String mailFrom;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    public void sendEnterpriseInvitation(
            String recipientEmail,
            String organizationName,
            String certificationTitle,
            String invitationToken
    ) {
        String invitationLink =
                frontendUrl
                        + "/invitations/accept?token="
                        + invitationToken;

        SimpleMailMessage message = new SimpleMailMessage();

        message.setFrom(mailFrom);
        message.setTo(recipientEmail);
        message.setSubject(
                "Invitation to join " + certificationTitle + " on REBYU"
        );

        message.setText("""
                Hello,

                %s invited you to join the %s certification review on REBYU.

                Open this link to accept your invitation:
                %s

                This invitation expires in 7 days.

                REBYU Team
                """.formatted(
                organizationName,
                certificationTitle,
                invitationLink
        ));

        mailSender.send(message);
    }
}
