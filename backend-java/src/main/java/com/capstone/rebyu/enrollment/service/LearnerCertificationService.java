package com.capstone.rebyu.enrollment.service;

import com.capstone.rebyu.enrollment.dto.LearnerCertificationDto;
import com.capstone.rebyu.enrollment.mapper.LearnerCertificationMapper;
import com.capstone.rebyu.enrollment.entity.LearnerCertification;
import com.capstone.rebyu.enrollment.entity.LearnerCertificationId;
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

    public LearnerCertificationDto getById(Long learnerId, Long certificationId) {
        log.debug("Fetching learner certification learnerId: {}, certificationId: {}", learnerId, certificationId);
        return learnerCertificationMapper.toDto(findEntity(learnerId, certificationId));
    }

    public LearnerCertificationDto create(LearnerCertificationDto dto) {
        log.info("Creating learner certification learnerId: {}, certificationId: {}", dto.getLearnerId(), dto.getCertificationId());
        LearnerCertification entity = learnerCertificationMapper.toEntity(dto);
        LearnerCertificationDto result = learnerCertificationMapper.toDto(learnerCertificationRepository.save(entity));
        log.info("LearnerCertification created");
        return result;
    }

    public LearnerCertificationDto update(Long learnerId, Long certificationId, LearnerCertificationDto dto) {
        log.info("Updating learner certification learnerId: {}, certificationId: {}", learnerId, certificationId);
        findEntity(learnerId, certificationId);
        dto.setLearnerId(learnerId);
        dto.setCertificationId(certificationId);
        LearnerCertification entity = learnerCertificationMapper.toEntity(dto);
        LearnerCertificationDto result = learnerCertificationMapper.toDto(learnerCertificationRepository.save(entity));
        log.info("LearnerCertification updated");
        return result;
    }

    public void delete(Long learnerId, Long certificationId) {
        log.info("Deleting learner certification learnerId: {}, certificationId: {}", learnerId, certificationId);
        learnerCertificationRepository.delete(findEntity(learnerId, certificationId));
        log.info("LearnerCertification deleted");
    }

    private LearnerCertification findEntity(Long learnerId, Long certificationId) {
        LearnerCertificationId id = new LearnerCertificationId();
        id.setLearnerId(learnerId);
        id.setCertificationId(certificationId);
        return learnerCertificationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("LearnerCertification not found: " + learnerId + "/" + certificationId));
    }
}
