package com.capstone.rebyu.progress.service;

import com.capstone.rebyu.progress.dto.LearnerAchievementDto;
import com.capstone.rebyu.progress.mapper.LearnerAchievementMapper;
import com.capstone.rebyu.progress.entity.LearnerAchievement;
import com.capstone.rebyu.progress.entity.LearnerAchievementId;
import com.capstone.rebyu.progress.repository.LearnerAchievementRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class LearnerAchievementService {
    private final LearnerAchievementRepository learnerAchievementRepository;
    private final LearnerAchievementMapper learnerAchievementMapper;

    public List<LearnerAchievementDto> getAll() {
        return learnerAchievementRepository.findAll().stream().map(learnerAchievementMapper::toDto).toList();
    }

    public LearnerAchievementDto getById(Long learnerId, Long achievementId) {
        return learnerAchievementMapper.toDto(findEntity(learnerId, achievementId));
    }

    public LearnerAchievementDto create(LearnerAchievementDto dto) {
        LearnerAchievement entity = learnerAchievementMapper.toEntity(dto);
        return learnerAchievementMapper.toDto(learnerAchievementRepository.save(entity));
    }

    public LearnerAchievementDto update(Long learnerId, Long achievementId, LearnerAchievementDto dto) {
        findEntity(learnerId, achievementId);
        dto.setLearnerId(learnerId);
        dto.setAchievementId(achievementId);
        LearnerAchievement entity = learnerAchievementMapper.toEntity(dto);
        return learnerAchievementMapper.toDto(learnerAchievementRepository.save(entity));
    }

    public void delete(Long learnerId, Long achievementId) {
        learnerAchievementRepository.delete(findEntity(learnerId, achievementId));
    }

    private LearnerAchievement findEntity(Long learnerId, Long achievementId) {
        LearnerAchievementId id = new LearnerAchievementId();
        id.setLearnerId(learnerId);
        id.setAchievementId(achievementId);
        return learnerAchievementRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("LearnerAchievement not found: " + learnerId + "/" + achievementId));
    }
}
