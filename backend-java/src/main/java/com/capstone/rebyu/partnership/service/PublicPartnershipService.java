package com.capstone.rebyu.partnership.service;

import com.capstone.rebyu.certification.entity.Certification;
import com.capstone.rebyu.certification.repository.CertificationRepository;
import com.capstone.rebyu.common.BusinessRuleException;
import com.capstone.rebyu.partnership.dto.PublicPartnershipDtos.PublicPartnershipItemRequest;
import com.capstone.rebyu.partnership.dto.PublicPartnershipDtos.PublicPartnershipRequestResponse;
import com.capstone.rebyu.partnership.dto.PublicPartnershipDtos.PublicPartnershipStatusResponse;
import com.capstone.rebyu.partnership.dto.PublicPartnershipDtos.SubmitPublicPartnershipRequest;
import com.capstone.rebyu.partnership.entity.PartnershipRequest;
import com.capstone.rebyu.partnership.entity.PartnershipRequestItem;
import com.capstone.rebyu.partnership.repository.PartnershipRequestItemRepository;
import com.capstone.rebyu.partnership.repository.PartnershipRequestRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Locale;
import java.util.UUID;

/**
 * Transaction One (public): an organization representative — with no account —
 * submits a partnership request from the landing page. The request stores the
 * organization details and requested certification slots, is saved atomically
 * as PENDING, and grants NO enterprise account, role, or access. The Enterprise
 * record is created only when an admin approves (Transaction Two).
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class PublicPartnershipService {

    private final PartnershipRequestRepository requestRepository;
    private final PartnershipRequestItemRepository itemRepository;
    private final CertificationRepository certificationRepository;

    @Transactional
    public PublicPartnershipRequestResponse submit(SubmitPublicPartnershipRequest request) {
        if (request.items() == null || request.items().isEmpty()) {
            throw new BusinessRuleException.InvalidPartnershipRequestException(
                    "Select at least one certification for your partnership request.");
        }

        String email = request.organizationEmail().trim().toLowerCase(Locale.ROOT);

        // Prevent stacking duplicate pending requests from the same organization.
        if (requestRepository.existsByOrganizationEmailIgnoreCaseAndStatus(
                email, PartnershipRequest.Status.PENDING)) {
            throw new BusinessRuleException.InvalidPartnershipRequestException(
                    "A partnership request from this organization is already pending review.");
        }

        LocalDateTime now = LocalDateTime.now();
        PartnershipRequest partnershipRequest = PartnershipRequest.builder()
                .referenceNumber(generateReferenceNumber())
                .organizationName(request.organizationName().trim())
                .organizationEmail(email)
                .contactPersonName(request.contactPersonName().trim())
                .contactNumber(request.contactNumber().trim())
                .organizationAddress(request.organizationAddress().trim())
                .businessDescription(request.businessDescription().trim())
                .submittedAt(now)
                .status(PartnershipRequest.Status.PENDING)
                .idempotencyKey(UUID.randomUUID().toString())
                .build();
        partnershipRequest = requestRepository.save(partnershipRequest);

        int totalSlots = 0;
        for (PublicPartnershipItemRequest item : request.items()) {
            if (item.requestedSlots() == null || item.requestedSlots() < 1) {
                throw new BusinessRuleException.InvalidPartnershipRequestException(
                        "Each certification needs at least one requested learner slot.");
            }
            Certification certification = certificationRepository.findById(item.certificationId())
                    .orElseThrow(() -> new BusinessRuleException.InvalidPartnershipRequestException(
                            "A selected certification is no longer available."));

            PartnershipRequestItem entity = PartnershipRequestItem.builder()
                    .partnershipRequest(partnershipRequest)
                    .certification(certification)
                    .slots(item.requestedSlots())
                    .build();
            itemRepository.save(entity);
            totalSlots += item.requestedSlots();
        }

        log.info("Public partnership request {} submitted by '{}' ({} certifications, {} slots)",
                partnershipRequest.getReferenceNumber(), partnershipRequest.getOrganizationName(),
                request.items().size(), totalSlots);

        return new PublicPartnershipRequestResponse(
                partnershipRequest.getReferenceNumber(),
                partnershipRequest.getOrganizationName(),
                partnershipRequest.getSubmittedAt(),
                partnershipRequest.getStatus().name(),
                request.items().size(),
                totalSlots
        );
    }

    @Transactional(readOnly = true)
    public PublicPartnershipStatusResponse lookupStatus(String referenceNumber, String organizationEmail) {
        PartnershipRequest request = requestRepository
                .findByReferenceNumberAndOrganizationEmailIgnoreCase(
                        referenceNumber.trim(), organizationEmail.trim())
                .orElseThrow(() -> new EntityNotFoundException(
                        "No partnership request matches that reference number and email."));

        // Only surface admin remarks once a decision has been made.
        boolean decided = request.getStatus() == PartnershipRequest.Status.APPROVED
                || request.getStatus() == PartnershipRequest.Status.REJECTED;

        return new PublicPartnershipStatusResponse(
                request.getReferenceNumber(),
                request.getOrganizationName(),
                request.getSubmittedAt(),
                request.getStatus().name(),
                decided ? request.getAdminRemarks() : null
        );
    }

    private String generateReferenceNumber() {
        String candidate;
        do {
            candidate = "PR-" + UUID.randomUUID().toString()
                    .substring(0, 8).toUpperCase(Locale.ROOT);
        } while (requestRepository.findByReferenceNumber(candidate).isPresent());
        return candidate;
    }
}
