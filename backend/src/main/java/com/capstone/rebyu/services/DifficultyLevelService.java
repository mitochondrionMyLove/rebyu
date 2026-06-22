package com.capstone.rebyu.services;

import com.capstone.rebyu.dto.DifficultyLevelDto;
import com.capstone.rebyu.mappers.DifficultyLevelMapper;
import com.capstone.rebyu.models.DifficultyLevel;
import com.capstone.rebyu.repositories.DifficultyLevelRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class DifficultyLevelService {
    private final DifficultyLevelRepository difficultyLevelRepository;
    private final DifficultyLevelMapper difficultyLevelMapper;

    public List<DifficultyLevelDto> getAll() {
        return difficultyLevelRepository.findAll().stream().map(difficultyLevelMapper::toDto).toList();
    }

    public DifficultyLevelDto getById(Long id) {
        return difficultyLevelMapper.toDto(findEntity(id));
    }

    public DifficultyLevelDto create(DifficultyLevelDto dto) {
        DifficultyLevel entity = difficultyLevelMapper.toEntity(dto);
        entity.setDifficultyLevelId(null);
        return difficultyLevelMapper.toDto(difficultyLevelRepository.save(entity));
    }

    public DifficultyLevelDto update(Long id, DifficultyLevelDto dto) {
        findEntity(id);
        DifficultyLevel entity = difficultyLevelMapper.toEntity(dto);
        entity.setDifficultyLevelId(id);
        return difficultyLevelMapper.toDto(difficultyLevelRepository.save(entity));
    }

    public void delete(Long id) {
        difficultyLevelRepository.delete(findEntity(id));
    }

    private DifficultyLevel findEntity(Long id) {
        return difficultyLevelRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("DifficultyLevel not found: " + id));
    }
}
