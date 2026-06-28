package com.capstone.rebyu.assessment.service;

import com.capstone.rebyu.assessment.dto.LearnerProgrammingAnswerDto;
import com.capstone.rebyu.assessment.entity.LearnerProgrammingAnswer;
import com.capstone.rebyu.assessment.mapper.LearnerProgrammingAnswerMapper;
import com.capstone.rebyu.assessment.repository.LearnerProgrammingAnswerRepository;
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
public class LearnerProgrammingAnswerService {
    private final LearnerProgrammingAnswerRepository learnerProgrammingAnswerRepository;
    private final LearnerProgrammingAnswerMapper learnerProgrammingAnswerMapper;

    public List<LearnerProgrammingAnswerDto> getAll() {
        return learnerProgrammingAnswerRepository.findAll().stream().map(learnerProgrammingAnswerMapper::toDto).toList();
    }

    public LearnerProgrammingAnswerDto getByDetailId(Long learnerExamDetailId) {
        return learnerProgrammingAnswerRepository.findByLearnerExamDetail_LearnerExamDetailId(learnerExamDetailId)
                .map(learnerProgrammingAnswerMapper::toDto)
                .orElseThrow(() -> new EntityNotFoundException("LearnerProgrammingAnswer not found for detail: " + learnerExamDetailId));
    }

    public LearnerProgrammingAnswerDto getById(Long id) {
        return learnerProgrammingAnswerMapper.toDto(findEntity(id));
    }

    public LearnerProgrammingAnswerDto create(LearnerProgrammingAnswerDto dto) {
        LearnerProgrammingAnswer entity = learnerProgrammingAnswerMapper.toEntity(dto);
        entity.setLearnerProgrammingAnswerId(null);
        return learnerProgrammingAnswerMapper.toDto(learnerProgrammingAnswerRepository.save(entity));
    }

    public LearnerProgrammingAnswerDto update(Long id, LearnerProgrammingAnswerDto dto) {
        findEntity(id);
        LearnerProgrammingAnswer entity = learnerProgrammingAnswerMapper.toEntity(dto);
        entity.setLearnerProgrammingAnswerId(id);
        return learnerProgrammingAnswerMapper.toDto(learnerProgrammingAnswerRepository.save(entity));
    }

    public void delete(Long id) {
        learnerProgrammingAnswerRepository.delete(findEntity(id));
    }

    private LearnerProgrammingAnswer findEntity(Long id) {
        return learnerProgrammingAnswerRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("LearnerProgrammingAnswer not found: " + id));
    }
}
