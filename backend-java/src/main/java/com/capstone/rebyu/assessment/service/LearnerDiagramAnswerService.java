package com.capstone.rebyu.assessment.service;

import com.capstone.rebyu.assessment.dto.LearnerDiagramAnswerDto;
import com.capstone.rebyu.assessment.entity.LearnerDiagramAnswer;
import com.capstone.rebyu.assessment.mapper.LearnerDiagramAnswerMapper;
import com.capstone.rebyu.assessment.repository.LearnerDiagramAnswerRepository;
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
public class LearnerDiagramAnswerService {
    private final LearnerDiagramAnswerRepository learnerDiagramAnswerRepository;
    private final LearnerDiagramAnswerMapper learnerDiagramAnswerMapper;

    public List<LearnerDiagramAnswerDto> getAll() {
        return learnerDiagramAnswerRepository.findAll().stream().map(learnerDiagramAnswerMapper::toDto).toList();
    }

    public LearnerDiagramAnswerDto getByDetailId(Long learnerExamDetailId) {
        return learnerDiagramAnswerRepository.findByLearnerExamDetail_LearnerExamDetailId(learnerExamDetailId)
                .map(learnerDiagramAnswerMapper::toDto)
                .orElseThrow(() -> new EntityNotFoundException("LearnerDiagramAnswer not found for detail: " + learnerExamDetailId));
    }

    public LearnerDiagramAnswerDto getById(Long id) {
        return learnerDiagramAnswerMapper.toDto(findEntity(id));
    }

    public LearnerDiagramAnswerDto create(LearnerDiagramAnswerDto dto) {
        LearnerDiagramAnswer entity = learnerDiagramAnswerMapper.toEntity(dto);
        entity.setLearnerDiagramAnswerId(null);
        return learnerDiagramAnswerMapper.toDto(learnerDiagramAnswerRepository.save(entity));
    }

    public LearnerDiagramAnswerDto update(Long id, LearnerDiagramAnswerDto dto) {
        findEntity(id);
        LearnerDiagramAnswer entity = learnerDiagramAnswerMapper.toEntity(dto);
        entity.setLearnerDiagramAnswerId(id);
        return learnerDiagramAnswerMapper.toDto(learnerDiagramAnswerRepository.save(entity));
    }

    public void delete(Long id) {
        learnerDiagramAnswerRepository.delete(findEntity(id));
    }

    private LearnerDiagramAnswer findEntity(Long id) {
        return learnerDiagramAnswerRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("LearnerDiagramAnswer not found: " + id));
    }
}
