package com.capstone.rebyu.progress.service;

import com.capstone.rebyu.progress.dto.ActivityTypeDto;
import com.capstone.rebyu.progress.mapper.ActivityTypeMapper;
import com.capstone.rebyu.progress.entity.ActivityType;
import com.capstone.rebyu.progress.repository.ActivityTypeRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ActivityTypeService {
    private final ActivityTypeRepository activityTypeRepository;
    private final ActivityTypeMapper activityTypeMapper;

    public List<ActivityTypeDto> getAll() {
        return activityTypeRepository.findAll().stream().map(activityTypeMapper::toDto).toList();
    }

    public ActivityTypeDto getById(Long id) {
        return activityTypeMapper.toDto(findEntity(id));
    }

    public ActivityTypeDto create(ActivityTypeDto dto) {
        ActivityType entity = activityTypeMapper.toEntity(dto);
        entity.setActivityTypeId(null);
        return activityTypeMapper.toDto(activityTypeRepository.save(entity));
    }

    public ActivityTypeDto update(Long id, ActivityTypeDto dto) {
        findEntity(id);
        ActivityType entity = activityTypeMapper.toEntity(dto);
        entity.setActivityTypeId(id);
        return activityTypeMapper.toDto(activityTypeRepository.save(entity));
    }

    public void delete(Long id) {
        activityTypeRepository.delete(findEntity(id));
    }

    private ActivityType findEntity(Long id) {
        return activityTypeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("ActivityType not found: " + id));
    }
}
