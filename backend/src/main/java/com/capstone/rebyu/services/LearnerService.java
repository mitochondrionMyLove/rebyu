package com.capstone.rebyu.services;

import com.capstone.rebyu.dto.LearnerDto;
import com.capstone.rebyu.mappers.LearnerMapper;
import com.capstone.rebyu.models.Learner;
import com.capstone.rebyu.repositories.LearnerRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class LearnerService {
    private final LearnerRepository learnerRepository;
    private final LearnerMapper learnerMapper;

    public List<LearnerDto> getAll() {
        return learnerRepository.findAll().stream().map(learnerMapper::toDto).toList();
    }

    public LearnerDto getById(Long id) {
        return learnerMapper.toDto(findEntity(id));
    }

    public LearnerDto create(LearnerDto dto) {
        Learner entity = learnerMapper.toEntity(dto);
        entity.setLearnerId(null);
        return learnerMapper.toDto(learnerRepository.save(entity));
    }

    public LearnerDto update(Long id, LearnerDto dto) {
        findEntity(id);
        Learner entity = learnerMapper.toEntity(dto);
        entity.setLearnerId(id);
        return learnerMapper.toDto(learnerRepository.save(entity));
    }

    public void delete(Long id) {
        learnerRepository.delete(findEntity(id));
    }

    private Learner findEntity(Long id) {
        return learnerRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Learner not found: " + id));
    }
}
