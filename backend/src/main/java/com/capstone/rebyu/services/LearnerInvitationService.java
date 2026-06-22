package com.capstone.rebyu.services;

import com.capstone.rebyu.dto.LearnerInvitationDto;
import com.capstone.rebyu.mappers.LearnerInvitationMapper;
import com.capstone.rebyu.models.LearnerInvitation;
import com.capstone.rebyu.repositories.LearnerInvitationRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class LearnerInvitationService {
    private final LearnerInvitationRepository learnerInvitationRepository;
    private final LearnerInvitationMapper learnerInvitationMapper;

    public List<LearnerInvitationDto> getAll() {
        return learnerInvitationRepository.findAll().stream().map(learnerInvitationMapper::toDto).toList();
    }

    public LearnerInvitationDto getById(Long id) {
        return learnerInvitationMapper.toDto(findEntity(id));
    }

    public LearnerInvitationDto create(LearnerInvitationDto dto) {
        LearnerInvitation entity = learnerInvitationMapper.toEntity(dto);
        entity.setInvitationId(null);
        return learnerInvitationMapper.toDto(learnerInvitationRepository.save(entity));
    }

    public LearnerInvitationDto update(Long id, LearnerInvitationDto dto) {
        findEntity(id);
        LearnerInvitation entity = learnerInvitationMapper.toEntity(dto);
        entity.setInvitationId(id);
        return learnerInvitationMapper.toDto(learnerInvitationRepository.save(entity));
    }

    public void delete(Long id) {
        learnerInvitationRepository.delete(findEntity(id));
    }

    private LearnerInvitation findEntity(Long id) {
        return learnerInvitationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("LearnerInvitation not found: " + id));
    }
}
