package com.capstone.rebyu.assessment.service;

import com.capstone.rebyu.assessment.dto.DiagramQuestionConfigDto;
import com.capstone.rebyu.assessment.entity.DiagramQuestionConfig;
import com.capstone.rebyu.assessment.mapper.DiagramQuestionConfigMapper;
import com.capstone.rebyu.assessment.repository.DiagramQuestionConfigRepository;
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
public class DiagramQuestionConfigService {
    private final DiagramQuestionConfigRepository diagramQuestionConfigRepository;
    private final DiagramQuestionConfigMapper diagramQuestionConfigMapper;

    public List<DiagramQuestionConfigDto> getAll() {
        return diagramQuestionConfigRepository.findAll().stream().map(diagramQuestionConfigMapper::toDto).toList();
    }

    public DiagramQuestionConfigDto getById(Long id) {
        return diagramQuestionConfigMapper.toDto(findEntity(id));
    }

    public DiagramQuestionConfigDto getByQuestionId(Long questionId) {
        return diagramQuestionConfigRepository.findByQuestion_QuestionId(questionId)
                .map(diagramQuestionConfigMapper::toDto)
                .orElseThrow(() -> new EntityNotFoundException("DiagramQuestionConfig not found for questionId: " + questionId));
    }

    public DiagramQuestionConfigDto create(DiagramQuestionConfigDto dto) {
        DiagramQuestionConfig entity = diagramQuestionConfigMapper.toEntity(dto);
        entity.setDiagramQuestionConfigId(null);
        DiagramQuestionConfigDto result = diagramQuestionConfigMapper.toDto(diagramQuestionConfigRepository.save(entity));
        log.info("DiagramQuestionConfig created with id: {}", result.getDiagramQuestionConfigId());
        return result;
    }

    public DiagramQuestionConfigDto update(Long id, DiagramQuestionConfigDto dto) {
        findEntity(id);
        DiagramQuestionConfig entity = diagramQuestionConfigMapper.toEntity(dto);
        entity.setDiagramQuestionConfigId(id);
        DiagramQuestionConfigDto result = diagramQuestionConfigMapper.toDto(diagramQuestionConfigRepository.save(entity));
        log.info("DiagramQuestionConfig id: {} updated", id);
        return result;
    }

    public void delete(Long id) {
        diagramQuestionConfigRepository.delete(findEntity(id));
        log.info("DiagramQuestionConfig id: {} deleted", id);
    }

    private DiagramQuestionConfig findEntity(Long id) {
        return diagramQuestionConfigRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("DiagramQuestionConfig not found: " + id));
    }
}
