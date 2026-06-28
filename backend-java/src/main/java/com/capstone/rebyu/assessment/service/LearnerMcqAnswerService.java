package com.capstone.rebyu.assessment.service;

import com.capstone.rebyu.assessment.dto.LearnerMcqAnswerDto;
import com.capstone.rebyu.assessment.entity.LearnerMcqAnswer;
import com.capstone.rebyu.assessment.mapper.LearnerMcqAnswerMapper;
import com.capstone.rebyu.assessment.repository.LearnerMcqAnswerRepository;
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
public class LearnerMcqAnswerService {
    private final LearnerMcqAnswerRepository learnerMcqAnswerRepository;
    private final LearnerMcqAnswerMapper learnerMcqAnswerMapper;

    public List<LearnerMcqAnswerDto> getAll() {
        return learnerMcqAnswerRepository.findAll().stream().map(learnerMcqAnswerMapper::toDto).toList();
    }

    public List<LearnerMcqAnswerDto> getByDetailId(Long learnerExamDetailId) {
        return learnerMcqAnswerRepository.findByLearnerExamDetail_LearnerExamDetailId(learnerExamDetailId)
                .stream().map(learnerMcqAnswerMapper::toDto).toList();
    }

    public LearnerMcqAnswerDto getById(Long id) {
        return learnerMcqAnswerMapper.toDto(findEntity(id));
    }

    public LearnerMcqAnswerDto create(LearnerMcqAnswerDto dto) {
        LearnerMcqAnswer entity = learnerMcqAnswerMapper.toEntity(dto);
        entity.setLearnerMcqAnswerId(null);
        return learnerMcqAnswerMapper.toDto(learnerMcqAnswerRepository.save(entity));
    }

    public LearnerMcqAnswerDto update(Long id, LearnerMcqAnswerDto dto) {
        findEntity(id);
        LearnerMcqAnswer entity = learnerMcqAnswerMapper.toEntity(dto);
        entity.setLearnerMcqAnswerId(id);
        return learnerMcqAnswerMapper.toDto(learnerMcqAnswerRepository.save(entity));
    }

    public void delete(Long id) {
        learnerMcqAnswerRepository.delete(findEntity(id));
    }

    private LearnerMcqAnswer findEntity(Long id) {
        return learnerMcqAnswerRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("LearnerMcqAnswer not found: " + id));
    }
}
