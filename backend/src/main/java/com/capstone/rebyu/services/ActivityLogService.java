package com.capstone.rebyu.services;

import com.capstone.rebyu.dto.ActivityLogDto;
import com.capstone.rebyu.mappers.ActivityLogMapper;
import com.capstone.rebyu.models.ActivityLog;
import com.capstone.rebyu.repositories.ActivityLogRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ActivityLogService {
    private final ActivityLogRepository activityLogRepository;
    private final ActivityLogMapper activityLogMapper;

    public List<ActivityLogDto> getAll() {
        return activityLogRepository.findAll().stream().map(activityLogMapper::toDto).toList();
    }

    public ActivityLogDto getById(Long id) {
        return activityLogMapper.toDto(findEntity(id));
    }

    public ActivityLogDto create(ActivityLogDto dto) {
        ActivityLog entity = activityLogMapper.toEntity(dto);
        entity.setLogId(null);
        return activityLogMapper.toDto(activityLogRepository.save(entity));
    }

    public ActivityLogDto update(Long id, ActivityLogDto dto) {
        findEntity(id);
        ActivityLog entity = activityLogMapper.toEntity(dto);
        entity.setLogId(id);
        return activityLogMapper.toDto(activityLogRepository.save(entity));
    }

    public void delete(Long id) {
        activityLogRepository.delete(findEntity(id));
    }

    private ActivityLog findEntity(Long id) {
        return activityLogRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("ActivityLog not found: " + id));
    }
}
