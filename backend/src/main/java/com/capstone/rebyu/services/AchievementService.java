package com.capstone.rebyu.services;

import com.capstone.rebyu.dto.AchievementDto;
import com.capstone.rebyu.mappers.AchievementMapper;
import com.capstone.rebyu.models.Achievement;
import com.capstone.rebyu.repositories.AchievementRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class AchievementService {
    private final AchievementRepository achievementRepository;
    private final AchievementMapper achievementMapper;

    public List<AchievementDto> getAll() {
        return achievementRepository.findAll().stream().map(achievementMapper::toDto).toList();
    }

    public AchievementDto getById(Long id) {
        return achievementMapper.toDto(findEntity(id));
    }

    public AchievementDto create(AchievementDto dto) {
        Achievement entity = achievementMapper.toEntity(dto);
        entity.setAchievementId(null);
        return achievementMapper.toDto(achievementRepository.save(entity));
    }

    public AchievementDto update(Long id, AchievementDto dto) {
        findEntity(id);
        Achievement entity = achievementMapper.toEntity(dto);
        entity.setAchievementId(id);
        return achievementMapper.toDto(achievementRepository.save(entity));
    }

    public void delete(Long id) {
        achievementRepository.delete(findEntity(id));
    }

    private Achievement findEntity(Long id) {
        return achievementRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Achievement not found: " + id));
    }
}
