package com.capstone.rebyu.enrollment.service;

import com.capstone.rebyu.enrollment.dto.LearnerCertificationDto;
import com.capstone.rebyu.enrollment.mapper.LearnerCertificationMapper;
import com.capstone.rebyu.enrollment.entity.LearnerCertification;
import com.capstone.rebyu.enrollment.repository.LearnerCertificationRepository;
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
public class LearnerCertificationService {
    private final LearnerCertificationRepository learnerCertificationRepository;
    private final LearnerCertificationMapper learnerCertificationMapper;

    public List<LearnerCertificationDto> getAll() {
        log.debug("Fetching all learner certifications");
        return learnerCertificationRepository.findAll().stream().map(learnerCertificationMapper::toDto).toList();
    }

    public LearnerCertificationDto getById(Long id) {
        log.debug("Fetching learner certification id: {}", id);
        return learnerCertificationMapper.toDto(findEntity(id));
    }

    public LearnerCertificationDto create(LearnerCertificationDto dto) {
        log.info("Creating new learner certification");
        LearnerCertification entity = learnerCertificationMapper.toEntity(dto);
        entity.setLearnerCertificationId(null);
        LearnerCertificationDto result = learnerCertificationMapper.toDto(learnerCertificationRepository.save(entity));
        log.info("LearnerCertification created with id: {}", result.getLearnerCertificationId());
        return result;
    }

    public LearnerCertificationDto update(Long id, LearnerCertificationDto dto) {
        log.info("Updating learner certification id: {}", id);
        findEntity(id);
        LearnerCertification entity = learnerCertificationMapper.toEntity(dto);
        entity.setLearnerCertificationId(id);
        LearnerCertificationDto result = learnerCertificationMapper.toDto(learnerCertificationRepository.save(entity));
        log.info("LearnerCertification id: {} updated", id);
        return result;
    }

    public void delete(Long id) {
        log.info("Deleting learner certification id: {}", id);
        learnerCertificationRepository.delete(findEntity(id));
        log.info("LearnerCertification id: {} deleted", id);
    }

    private LearnerCertification findEntity(Long id) {
        return learnerCertificationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("LearnerCertification not found: " + id));
    }
}
