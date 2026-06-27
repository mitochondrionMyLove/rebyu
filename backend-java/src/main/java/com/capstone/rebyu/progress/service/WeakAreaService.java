package com.capstone.rebyu.progress.service;

import com.capstone.rebyu.progress.dto.WeakAreaDto;
import com.capstone.rebyu.progress.mapper.WeakAreaMapper;
import com.capstone.rebyu.progress.entity.WeakArea;
import com.capstone.rebyu.progress.entity.WeakAreaId;
import com.capstone.rebyu.progress.repository.WeakAreaRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class WeakAreaService {
    private final WeakAreaRepository weakAreaRepository;
    private final WeakAreaMapper weakAreaMapper;

    public List<WeakAreaDto> getAll() {
        return weakAreaRepository.findAll().stream().map(weakAreaMapper::toDto).toList();
    }

    public WeakAreaDto getById(Long learnerId, Long lessonId) {
        return weakAreaMapper.toDto(findEntity(learnerId, lessonId));
    }

    public WeakAreaDto create(WeakAreaDto dto) {
        WeakArea entity = weakAreaMapper.toEntity(dto);
        return weakAreaMapper.toDto(weakAreaRepository.save(entity));
    }

    public WeakAreaDto update(Long learnerId, Long lessonId, WeakAreaDto dto) {
        findEntity(learnerId, lessonId);
        dto.setLearnerId(learnerId);
        dto.setLessonId(lessonId);
        WeakArea entity = weakAreaMapper.toEntity(dto);
        return weakAreaMapper.toDto(weakAreaRepository.save(entity));
    }

    public void delete(Long learnerId, Long lessonId) {
        weakAreaRepository.delete(findEntity(learnerId, lessonId));
    }

    private WeakArea findEntity(Long learnerId, Long lessonId) {
        WeakAreaId id = new WeakAreaId();
        id.setLearnerId(learnerId);
        id.setLessonId(lessonId);
        return weakAreaRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("WeakArea not found: " + learnerId + "/" + lessonId));
    }
}
