package com.capstone.rebyu.assessment.service;

import com.capstone.rebyu.assessment.dto.SubQuestionDto;
import com.capstone.rebyu.assessment.entity.SubQuestion;
import com.capstone.rebyu.assessment.mapper.SubQuestionMapper;
import com.capstone.rebyu.assessment.repository.SubQuestionRepository;
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
public class SubQuestionService {
    private final SubQuestionRepository subQuestionRepository;
    private final SubQuestionMapper subQuestionMapper;

    public List<SubQuestionDto> getAll() {
        log.debug("Fetching all sub-questions");
        return subQuestionRepository.findAll().stream().map(subQuestionMapper::toDto).toList();
    }

    public List<SubQuestionDto> getByNoChoiceQuestionId(Long noChoiceQuestionId) {
        log.debug("Fetching sub-questions for noChoiceQuestionId: {}", noChoiceQuestionId);
        return subQuestionRepository.findByNoChoiceQuestion_NoChoiceQuestionId(noChoiceQuestionId)
                .stream().map(subQuestionMapper::toDto).toList();
    }

    public SubQuestionDto getById(Long id) {
        log.debug("Fetching sub-question id: {}", id);
        return subQuestionMapper.toDto(findEntity(id));
    }

    public SubQuestionDto create(SubQuestionDto dto) {
        log.info("Creating new sub-question");
        SubQuestion entity = subQuestionMapper.toEntity(dto);
        entity.setSubQuestionId(null);
        SubQuestionDto result = subQuestionMapper.toDto(subQuestionRepository.save(entity));
        log.info("SubQuestion created with id: {}", result.getSubQuestionId());
        return result;
    }

    public SubQuestionDto update(Long id, SubQuestionDto dto) {
        log.info("Updating sub-question id: {}", id);
        findEntity(id);
        SubQuestion entity = subQuestionMapper.toEntity(dto);
        entity.setSubQuestionId(id);
        SubQuestionDto result = subQuestionMapper.toDto(subQuestionRepository.save(entity));
        log.info("SubQuestion id: {} updated", id);
        return result;
    }

    public void delete(Long id) {
        log.info("Deleting sub-question id: {}", id);
        subQuestionRepository.delete(findEntity(id));
        log.info("SubQuestion id: {} deleted", id);
    }

    private SubQuestion findEntity(Long id) {
        return subQuestionRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("SubQuestion not found: " + id));
    }
}
