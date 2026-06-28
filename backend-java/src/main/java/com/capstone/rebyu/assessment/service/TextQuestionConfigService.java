package com.capstone.rebyu.assessment.service;

import com.capstone.rebyu.assessment.dto.TextQuestionConfigDto;
import com.capstone.rebyu.assessment.entity.TextQuestionConfig;
import com.capstone.rebyu.assessment.mapper.TextQuestionConfigMapper;
import com.capstone.rebyu.assessment.repository.TextQuestionConfigRepository;
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
public class TextQuestionConfigService {
    private final TextQuestionConfigRepository textQuestionConfigRepository;
    private final TextQuestionConfigMapper textQuestionConfigMapper;

    public List<TextQuestionConfigDto> getAll() {
        log.debug("Fetching all text question configs");
        return textQuestionConfigRepository.findAll().stream().map(textQuestionConfigMapper::toDto).toList();
    }

    public TextQuestionConfigDto getById(Long id) {
        log.debug("Fetching text question config id: {}", id);
        return textQuestionConfigMapper.toDto(findEntity(id));
    }

    public TextQuestionConfigDto getByQuestionId(Long questionId) {
        log.debug("Fetching text question config for questionId: {}", questionId);
        return textQuestionConfigRepository.findByQuestion_QuestionId(questionId)
                .map(textQuestionConfigMapper::toDto)
                .orElseThrow(() -> new EntityNotFoundException("TextQuestionConfig not found for questionId: " + questionId));
    }

    public TextQuestionConfigDto create(TextQuestionConfigDto dto) {
        log.info("Creating new text question config");
        TextQuestionConfig entity = textQuestionConfigMapper.toEntity(dto);
        entity.setTextQuestionConfigId(null);
        TextQuestionConfigDto result = textQuestionConfigMapper.toDto(textQuestionConfigRepository.save(entity));
        log.info("TextQuestionConfig created with id: {}", result.getTextQuestionConfigId());
        return result;
    }

    public TextQuestionConfigDto update(Long id, TextQuestionConfigDto dto) {
        log.info("Updating text question config id: {}", id);
        findEntity(id);
        TextQuestionConfig entity = textQuestionConfigMapper.toEntity(dto);
        entity.setTextQuestionConfigId(id);
        TextQuestionConfigDto result = textQuestionConfigMapper.toDto(textQuestionConfigRepository.save(entity));
        log.info("TextQuestionConfig id: {} updated", id);
        return result;
    }

    public void delete(Long id) {
        log.info("Deleting text question config id: {}", id);
        textQuestionConfigRepository.delete(findEntity(id));
        log.info("TextQuestionConfig id: {} deleted", id);
    }

    private TextQuestionConfig findEntity(Long id) {
        return textQuestionConfigRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("TextQuestionConfig not found: " + id));
    }
}
