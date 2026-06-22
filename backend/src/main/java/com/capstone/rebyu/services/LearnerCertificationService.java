package com.capstone.rebyu.services;

import com.capstone.rebyu.dto.LearnerCertificationDto;
import com.capstone.rebyu.mappers.LearnerCertificationMapper;
import com.capstone.rebyu.models.LearnerCertification;
import com.capstone.rebyu.models.LearnerCertificationId;
import com.capstone.rebyu.repositories.LearnerCertificationRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class LearnerCertificationService {
    private final LearnerCertificationRepository learnerCertificationRepository;
    private final LearnerCertificationMapper learnerCertificationMapper;

    public List<LearnerCertificationDto> getAll() {
        return learnerCertificationRepository.findAll().stream().map(learnerCertificationMapper::toDto).toList();
    }

    public LearnerCertificationDto getById(Long learnerId, Long certificationId) {
        return learnerCertificationMapper.toDto(findEntity(learnerId, certificationId));
    }

    public LearnerCertificationDto create(LearnerCertificationDto dto) {
        LearnerCertification entity = learnerCertificationMapper.toEntity(dto);
        return learnerCertificationMapper.toDto(learnerCertificationRepository.save(entity));
    }

    public LearnerCertificationDto update(Long learnerId, Long certificationId, LearnerCertificationDto dto) {
        findEntity(learnerId, certificationId);
        dto.setLearnerId(learnerId);
        dto.setCertificationId(certificationId);
        LearnerCertification entity = learnerCertificationMapper.toEntity(dto);
        return learnerCertificationMapper.toDto(learnerCertificationRepository.save(entity));
    }

    public void delete(Long learnerId, Long certificationId) {
        learnerCertificationRepository.delete(findEntity(learnerId, certificationId));
    }

    private LearnerCertification findEntity(Long learnerId, Long certificationId) {
        LearnerCertificationId id = new LearnerCertificationId();
        id.setLearnerId(learnerId);
        id.setCertificationId(certificationId);
        return learnerCertificationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("LearnerCertification not found: " + learnerId + "/" + certificationId));
    }
}
