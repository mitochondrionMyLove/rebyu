package com.capstone.rebyu.partnership.service;

import com.capstone.rebyu.common.BusinessRuleException;
import com.capstone.rebyu.notification.entity.LearnerInvitation;
import com.capstone.rebyu.notification.repository.LearnerInvitationRepository;
import com.capstone.rebyu.organization.entity.OrganizationCertificate;
import com.capstone.rebyu.organization.repository.OrganizationCertificateRepository;
import com.capstone.rebyu.partnership.dto.EnterpriseInvitationDtos.CertificationAccessDto;
import com.capstone.rebyu.partnership.dto.EnterpriseInvitationDtos.InvitationDto;
import com.capstone.rebyu.partnership.dto.EnterpriseInvitationDtos.SendInvitationsRequest;
import com.capstone.rebyu.partnership.dto.EnterpriseInvitationDtos.SendInvitationsResponse;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.UUID;
import java.util.regex.Pattern;

/**
 * Transaction Three: an activated enterprise invites learners against its
 * organization's certification slots.
 *
 * Slot reservation is protected against oversubscription by the optimistic
 * lock (@Version) on OrganizationCertificate: two concurrent invitation
 * batches that both try to consume the last slots will conflict, and the
 * loser's transaction rolls back instead of driving remaining_slots negative.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class EnterpriseInvitationService {

    private static final Pattern EMAIL = Pattern.compile("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$");
    private static final int INVITATION_VALID_DAYS = 14;

    private final OrganizationCertificateRepository organizationCertificateRepository;
    private final LearnerInvitationRepository invitationRepository;

    @Transactional(readOnly = true)
    public List<CertificationAccessDto> certificationAccess(Long enterpriseId) {
        return organizationCertificateRepository.findByEnterprise_EnterpriseId(enterpriseId)
                .stream()
                .map(this::toAccessDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<InvitationDto> listInvitations(Long enterpriseId) {
        return invitationRepository
                .findByOrgCert_Enterprise_EnterpriseIdOrderBySentAtDesc(enterpriseId)
                .stream()
                .map(this::toInvitationDto)
                .toList();
    }

    @Transactional
    public SendInvitationsResponse sendInvitations(SendInvitationsRequest request) {
        OrganizationCertificate orgCert = organizationCertificateRepository
                .findById(request.orgCertId())
                .orElseThrow(() -> new EntityNotFoundException(
                        "Certification access not found: " + request.orgCertId()));

        // Ownership: the allocation must belong to the caller's organization.
        if (!orgCert.getEnterprise().getEnterpriseId().equals(request.enterpriseId())) {
            throw new EntityNotFoundException("Certification access not found: " + request.orgCertId());
        }
        if (orgCert.getStatus() != OrganizationCertificate.Status.active) {
            throw new BusinessRuleException.InvalidPartnershipRequestException(
                    "This certification access is not active.");
        }

        // De-duplicate and validate emails; skip ones already invited.
        List<String> skipped = new ArrayList<>();
        LinkedHashSet<String> toInvite = new LinkedHashSet<>();
        for (String raw : request.emails()) {
            if (raw == null) continue;
            String email = raw.trim().toLowerCase(Locale.ROOT);
            if (email.isEmpty()) continue;
            if (!EMAIL.matcher(email).matches()) {
                skipped.add(raw + " (invalid email)");
                continue;
            }
            if (invitationRepository.existsByOrgCert_OrgCertIdAndEmailIgnoreCaseAndStatus(
                    orgCert.getOrgCertId(), email, LearnerInvitation.Status.PENDING)) {
                skipped.add(email + " (already invited)");
                continue;
            }
            toInvite.add(email);
        }

        if (toInvite.isEmpty()) {
            throw new BusinessRuleException.InvalidPartnershipRequestException(
                    "No new valid learner emails to invite.");
        }

        int remaining = orgCert.getTotalSlots() - orgCert.getUsedSlots();
        if (toInvite.size() > remaining) {
            throw new BusinessRuleException.InvalidPartnershipRequestException(
                    "The number of invitations exceeds the available slots. "
                            + remaining + " slot(s) remaining.");
        }

        LocalDateTime now = LocalDateTime.now();
        List<InvitationDto> created = new ArrayList<>();
        for (String email : toInvite) {
            LearnerInvitation invitation = LearnerInvitation.builder()
                    .orgCert(orgCert)
                    .email(email)
                    .tokenHash(UUID.randomUUID().toString())
                    .sentAt(now)
                    .expiresAt(now.plusDays(INVITATION_VALID_DAYS))
                    .status(LearnerInvitation.Status.PENDING)
                    .build();
            created.add(toInvitationDto(invitationRepository.save(invitation)));
        }

        // Reserve slots. The @Version lock makes this safe under concurrency;
        // remaining_slots is a DB-computed column, so only used_slots changes.
        orgCert.setUsedSlots(orgCert.getUsedSlots() + toInvite.size());
        organizationCertificateRepository.save(orgCert);

        log.info("Enterprise {} sent {} invitation(s) for orgCert {} ({} skipped)",
                request.enterpriseId(), created.size(), orgCert.getOrgCertId(), skipped.size());
        return new SendInvitationsResponse(created.size(), skipped, created);
    }

    @Transactional
    public InvitationDto cancelInvitation(Long invitationId, Long enterpriseId) {
        LearnerInvitation invitation = invitationRepository.findById(invitationId)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Invitation not found: " + invitationId));

        OrganizationCertificate orgCert = invitation.getOrgCert();
        if (!orgCert.getEnterprise().getEnterpriseId().equals(enterpriseId)) {
            throw new EntityNotFoundException("Invitation not found: " + invitationId);
        }

        // Only a still-pending invitation frees a slot; accepted/expired/already
        // revoked invitations must not restore slots or go negative.
        if (invitation.getStatus() == LearnerInvitation.Status.PENDING) {
            invitation.setStatus(LearnerInvitation.Status.REVOKED);
            invitationRepository.save(invitation);
            orgCert.setUsedSlots(Math.max(0, orgCert.getUsedSlots() - 1));
            organizationCertificateRepository.save(orgCert);
            log.info("Invitation {} cancelled; 1 slot restored on orgCert {}",
                    invitationId, orgCert.getOrgCertId());
        } else {
            throw new BusinessRuleException.InvalidPartnershipRequestException(
                    "Only a pending invitation can be cancelled.");
        }
        return toInvitationDto(invitation);
    }

    private CertificationAccessDto toAccessDto(OrganizationCertificate orgCert) {
        int remaining = orgCert.getTotalSlots() - orgCert.getUsedSlots();
        return new CertificationAccessDto(
                orgCert.getOrgCertId(),
                orgCert.getCertification().getCertificationId(),
                orgCert.getCertification().getTitle(),
                orgCert.getStatus().name(),
                orgCert.getTotalSlots(),
                orgCert.getUsedSlots(),
                remaining
        );
    }

    private InvitationDto toInvitationDto(LearnerInvitation invitation) {
        OrganizationCertificate orgCert = invitation.getOrgCert();
        return new InvitationDto(
                invitation.getInvitationId(),
                orgCert.getOrgCertId(),
                orgCert.getCertification().getCertificationId(),
                orgCert.getCertification().getTitle(),
                invitation.getEmail(),
                invitation.getStatus().name(),
                invitation.getSentAt(),
                invitation.getExpiresAt()
        );
    }
}
