package com.capstone.rebyu.assessment.service;

import com.capstone.rebyu.assessment.dto.NoChoiceQuestionDto;
import com.capstone.rebyu.assessment.mapper.NoChoiceQuestionMapper;
import com.capstone.rebyu.assessment.entity.NoChoiceQuestion;
import com.capstone.rebyu.assessment.repository.NoChoiceQuestionRepository;
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
public class NoChoiceQuestionService {
    private final NoChoiceQuestionRepository noChoiceQuestionRepository;
    private final NoChoiceQuestionMapper noChoiceQuestionMapper;

    public List<NoChoiceQuestionDto> getAll() {
        log.debug("Fetching all no-choice questions");
        return noChoiceQuestionRepository.findAll().stream().map(noChoiceQuestionMapper::toDto).toList();
    }

    public NoChoiceQuestionDto getById(Long id) {
        log.debug("Fetching no-choice question id: {}", id);
        return noChoiceQuestionMapper.toDto(findEntity(id));
    }

    public NoChoiceQuestionDto create(NoChoiceQuestionDto dto) {
        log.info("Creating new no-choice question");
        NoChoiceQuestion entity = noChoiceQuestionMapper.toEntity(dto);
        entity.setNoChoiceQuestionId(null);
        NoChoiceQuestionDto result = noChoiceQuestionMapper.toDto(noChoiceQuestionRepository.save(entity));
        log.info("NoChoiceQuestion created with id: {}", result.getNoChoiceQuestionId());
        return result;
    }

    public NoChoiceQuestionDto update(Long id, NoChoiceQuestionDto dto) {
        log.info("Updating no-choice question id: {}", id);
        findEntity(id);
        NoChoiceQuestion entity = noChoiceQuestionMapper.toEntity(dto);
        entity.setNoChoiceQuestionId(id);
        NoChoiceQuestionDto result = noChoiceQuestionMapper.toDto(noChoiceQuestionRepository.save(entity));
        log.info("NoChoiceQuestion id: {} updated", id);
        return result;
    }

    public void delete(Long id) {
        log.info("Deleting no-choice question id: {}", id);
        noChoiceQuestionRepository.delete(findEntity(id));
        log.info("NoChoiceQuestion id: {} deleted", id);
    }

    private NoChoiceQuestion findEntity(Long id) {
        return noChoiceQuestionRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("NoChoiceQuestion not found: " + id));
    }
}
