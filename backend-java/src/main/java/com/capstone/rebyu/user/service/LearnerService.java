package com.capstone.rebyu.user.service;

import com.capstone.rebyu.enrollment.entity.OrganizationCertificationLearner;
import com.capstone.rebyu.enrollment.repository.OrganizationCertificationLearnerRepository;
import com.capstone.rebyu.notification.entity.LearnerInvitation;
import com.capstone.rebyu.notification.repository.LearnerInvitationRepository;
import com.capstone.rebyu.user.dto.LearnerDto;
import com.capstone.rebyu.user.entity.Learner;
import com.capstone.rebyu.user.mapper.LearnerMapper;
import com.capstone.rebyu.user.repository.LearnerRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class LearnerService {

    private final LearnerRepository learnerRepository;
    private final LearnerMapper learnerMapper;
    private final LearnerInvitationRepository learnerInvitationRepository;
    private final OrganizationCertificationLearnerRepository
            organizationCertificationLearnerRepository;

    public List<LearnerDto> getAll() {
        return learnerRepository.findAll()
                .stream()
                .map(learnerMapper::toDto)
                .toList();
    }

    public LearnerDto getById(Long id) {
        return learnerMapper.toDto(findEntity(id));
    }

    public LearnerDto create(LearnerDto dto) {
        Learner entity = learnerMapper.toEntity(dto);

        entity.setLearnerId(null);

        return learnerMapper.toDto(
                learnerRepository.save(entity)
        );
    }

    public LearnerDto update(Long id, LearnerDto dto) {
        findEntity(id);

        Learner entity = learnerMapper.toEntity(dto);

        entity.setLearnerId(id);

        return learnerMapper.toDto(
                learnerRepository.save(entity)
        );
    }

    public void acceptInvitation(String token) {
        if (token == null || token.isBlank()) {
            throw new IllegalArgumentException(
                    "Invitation token is required."
            );
        }

        LearnerInvitation invitation = learnerInvitationRepository
                .findByTokenHash(token.trim())
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Invalid invitation token."
                        )
                );

        if (invitation.getLearner() == null) {
            throw new IllegalStateException(
                    "Learner account was not found."
            );
        }

        if (invitation.getOrgCert() == null) {
            throw new IllegalStateException(
                    "Certification invitation was not found."
            );
        }

        boolean alreadyAssigned =
                organizationCertificationLearnerRepository
                        .existsByOrgCertAndLearner(
                                invitation.getOrgCert(),
                                invitation.getLearner()
                        );

        if (alreadyAssigned) {
            throw new IllegalStateException(
                    "This learner already has access to this certification."
            );
        }

        OrganizationCertificationLearner enrollment =
                OrganizationCertificationLearner.builder()
                        .orgCert(invitation.getOrgCert())
                        .learner(invitation.getLearner())
                        .assignedAt(LocalDateTime.now())
                        .progressPercentage(BigDecimal.ZERO)
                        .completedAt(null)
                        .status(
                                OrganizationCertificationLearner.Status.active
                        )
                        .build();

        organizationCertificationLearnerRepository.save(enrollment);

        invitation.setAcceptedAt(LocalDateTime.now());

        /*
         * Add this only when your LearnerInvitation entity has
         * an invitation status enum or status field.
         *
         * Example:
         * invitation.setStatus(LearnerInvitation.Status.accepted);
         */

        learnerInvitationRepository.save(invitation);
    }

    public void delete(Long id) {
        learnerRepository.delete(findEntity(id));
    }

    private Learner findEntity(Long id) {
        return learnerRepository.findById(id)
                .orElseThrow(() ->
                        new EntityNotFoundException(
                                "Learner not found: " + id
                        )
                );
    }
}