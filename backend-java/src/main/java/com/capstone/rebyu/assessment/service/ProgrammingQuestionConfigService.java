package com.capstone.rebyu.assessment.service;

import com.capstone.rebyu.assessment.dto.ProgrammingQuestionConfigDto;
import com.capstone.rebyu.assessment.entity.ProgrammingQuestionConfig;
import com.capstone.rebyu.assessment.mapper.ProgrammingQuestionConfigMapper;
import com.capstone.rebyu.assessment.repository.ProgrammingQuestionConfigRepository;
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
public class ProgrammingQuestionConfigService {
    private final ProgrammingQuestionConfigRepository programmingQuestionConfigRepository;
    private final ProgrammingQuestionConfigMapper programmingQuestionConfigMapper;

    public List<ProgrammingQuestionConfigDto> getAll() {
        log.debug("Fetching all programming question configs");
        return programmingQuestionConfigRepository.findAll().stream().map(programmingQuestionConfigMapper::toDto).toList();
    }

    public ProgrammingQuestionConfigDto getById(Long id) {
        log.debug("Fetching programming question config id: {}", id);
        return programmingQuestionConfigMapper.toDto(findEntity(id));
    }

    public ProgrammingQuestionConfigDto getByQuestionId(Long questionId) {
        log.debug("Fetching programming question config for questionId: {}", questionId);
        return programmingQuestionConfigRepository.findByQuestion_QuestionId(questionId)
                .map(programmingQuestionConfigMapper::toDto)
                .orElseThrow(() -> new EntityNotFoundException("ProgrammingQuestionConfig not found for questionId: " + questionId));
    }

    public ProgrammingQuestionConfigDto create(ProgrammingQuestionConfigDto dto) {
        log.info("Creating new programming question config");
        ProgrammingQuestionConfig entity = programmingQuestionConfigMapper.toEntity(dto);
        entity.setProgrammingQuestionConfigId(null);
        ProgrammingQuestionConfigDto result = programmingQuestionConfigMapper.toDto(programmingQuestionConfigRepository.save(entity));
        log.info("ProgrammingQuestionConfig created with id: {}", result.getProgrammingQuestionConfigId());
        return result;
    }

    public ProgrammingQuestionConfigDto update(Long id, ProgrammingQuestionConfigDto dto) {
        log.info("Updating programming question config id: {}", id);
        findEntity(id);
        ProgrammingQuestionConfig entity = programmingQuestionConfigMapper.toEntity(dto);
        entity.setProgrammingQuestionConfigId(id);
        ProgrammingQuestionConfigDto result = programmingQuestionConfigMapper.toDto(programmingQuestionConfigRepository.save(entity));
        log.info("ProgrammingQuestionConfig id: {} updated", id);
        return result;
    }

    public void delete(Long id) {
        log.info("Deleting programming question config id: {}", id);
        programmingQuestionConfigRepository.delete(findEntity(id));
        log.info("ProgrammingQuestionConfig id: {} deleted", id);
    }

    private ProgrammingQuestionConfig findEntity(Long id) {
        return programmingQuestionConfigRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("ProgrammingQuestionConfig not found: " + id));
    }
}
