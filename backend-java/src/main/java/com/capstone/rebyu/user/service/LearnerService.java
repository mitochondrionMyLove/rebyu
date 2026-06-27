package com.capstone.rebyu.user.service;

import com.capstone.rebyu.user.dto.LearnerDto;
import com.capstone.rebyu.user.mapper.LearnerMapper;
import com.capstone.rebyu.user.entity.Learner;
import com.capstone.rebyu.user.repository.LearnerRepository;
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
