package com.capstone.rebyu.services;

import com.capstone.rebyu.dto.QuestionTypeDto;
import com.capstone.rebyu.mappers.QuestionTypeMapper;
import com.capstone.rebyu.models.QuestionType;
import com.capstone.rebyu.repositories.QuestionTypeRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class QuestionTypeService {
    private final QuestionTypeRepository questionTypeRepository;
    private final QuestionTypeMapper questionTypeMapper;

    public List<QuestionTypeDto> getAll() {
        return questionTypeRepository.findAll().stream().map(questionTypeMapper::toDto).toList();
    }

    public QuestionTypeDto getById(Long id) {
        return questionTypeMapper.toDto(findEntity(id));
    }

    public QuestionTypeDto create(QuestionTypeDto dto) {
        QuestionType entity = questionTypeMapper.toEntity(dto);
        entity.setQuestionTypeId(null);
        return questionTypeMapper.toDto(questionTypeRepository.save(entity));
    }

    public QuestionTypeDto update(Long id, QuestionTypeDto dto) {
        findEntity(id);
        QuestionType entity = questionTypeMapper.toEntity(dto);
        entity.setQuestionTypeId(id);
        return questionTypeMapper.toDto(questionTypeRepository.save(entity));
    }

    public void delete(Long id) {
        questionTypeRepository.delete(findEntity(id));
    }

    private QuestionType findEntity(Long id) {
        return questionTypeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("QuestionType not found: " + id));
    }
}
