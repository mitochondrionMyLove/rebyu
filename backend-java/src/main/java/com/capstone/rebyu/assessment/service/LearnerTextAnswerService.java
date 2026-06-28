package com.capstone.rebyu.assessment.service;

import com.capstone.rebyu.assessment.dto.LearnerTextAnswerDto;
import com.capstone.rebyu.assessment.entity.LearnerTextAnswer;
import com.capstone.rebyu.assessment.mapper.LearnerTextAnswerMapper;
import com.capstone.rebyu.assessment.repository.LearnerTextAnswerRepository;
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
public class LearnerTextAnswerService {
    private final LearnerTextAnswerRepository learnerTextAnswerRepository;
    private final LearnerTextAnswerMapper learnerTextAnswerMapper;

    public List<LearnerTextAnswerDto> getAll() {
        return learnerTextAnswerRepository.findAll().stream().map(learnerTextAnswerMapper::toDto).toList();
    }

    public LearnerTextAnswerDto getByDetailId(Long learnerExamDetailId) {
        return learnerTextAnswerRepository.findByLearnerExamDetail_LearnerExamDetailId(learnerExamDetailId)
                .map(learnerTextAnswerMapper::toDto)
                .orElseThrow(() -> new EntityNotFoundException("LearnerTextAnswer not found for detail: " + learnerExamDetailId));
    }

    public LearnerTextAnswerDto getById(Long id) {
        return learnerTextAnswerMapper.toDto(findEntity(id));
    }

    public LearnerTextAnswerDto create(LearnerTextAnswerDto dto) {
        LearnerTextAnswer entity = learnerTextAnswerMapper.toEntity(dto);
        entity.setLearnerTextAnswerId(null);
        return learnerTextAnswerMapper.toDto(learnerTextAnswerRepository.save(entity));
    }

    public LearnerTextAnswerDto update(Long id, LearnerTextAnswerDto dto) {
        findEntity(id);
        LearnerTextAnswer entity = learnerTextAnswerMapper.toEntity(dto);
        entity.setLearnerTextAnswerId(id);
        return learnerTextAnswerMapper.toDto(learnerTextAnswerRepository.save(entity));
    }

    public void delete(Long id) {
        learnerTextAnswerRepository.delete(findEntity(id));
    }

    private LearnerTextAnswer findEntity(Long id) {
        return learnerTextAnswerRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("LearnerTextAnswer not found: " + id));
    }
}
