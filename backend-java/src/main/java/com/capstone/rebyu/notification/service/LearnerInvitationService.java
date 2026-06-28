package com.capstone.rebyu.notification.service;

import com.capstone.rebyu.notification.dto.LearnerInvitationDto;
import com.capstone.rebyu.notification.mapper.LearnerInvitationMapper;
import com.capstone.rebyu.notification.entity.LearnerInvitation;
import com.capstone.rebyu.notification.repository.LearnerInvitationRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class LearnerInvitationService {
    private final LearnerInvitationRepository learnerInvitationRepository;
    private final LearnerInvitationMapper learnerInvitationMapper;

    public List<LearnerInvitationDto> getAll() {
        log.debug("Fetching all learner invitations");
        return learnerInvitationRepository.findAll().stream().map(learnerInvitationMapper::toDto).toList();
    }

    public LearnerInvitationDto getById(Long id) {
        log.debug("Fetching learner invitation id: {}", id);
        return learnerInvitationMapper.toDto(findEntity(id));
    }

    public LearnerInvitationDto create(LearnerInvitationDto dto) {
        log.info("Creating new learner invitation");
        LearnerInvitation entity = learnerInvitationMapper.toEntity(dto);
        entity.setInvitationId(null);
        LearnerInvitationDto result = learnerInvitationMapper.toDto(learnerInvitationRepository.save(entity));
        log.info("LearnerInvitation created with id: {}", result.getInvitationId());
        return result;
    }

    public LearnerInvitationDto update(Long id, LearnerInvitationDto dto) {
        log.info("Updating learner invitation id: {}", id);
        findEntity(id);
        LearnerInvitation entity = learnerInvitationMapper.toEntity(dto);
        entity.setInvitationId(id);
        LearnerInvitationDto result = learnerInvitationMapper.toDto(learnerInvitationRepository.save(entity));
        log.info("LearnerInvitation id: {} updated", id);
        return result;
    }

    public void delete(Long id) {
        log.info("Deleting learner invitation id: {}", id);
        learnerInvitationRepository.delete(findEntity(id));
        log.info("LearnerInvitation id: {} deleted", id);
    }

    private LearnerInvitation findEntity(Long id) {
        return learnerInvitationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("LearnerInvitation not found: " + id));
    }
}
