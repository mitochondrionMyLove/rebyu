package com.capstone.rebyu.services;

import com.capstone.rebyu.dto.QuestionDto;
import com.capstone.rebyu.mappers.QuestionMapper;
import com.capstone.rebyu.models.Question;
import com.capstone.rebyu.repositories.QuestionRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class QuestionService {
    private final QuestionRepository questionRepository;
    private final QuestionMapper questionMapper;

    public List<QuestionDto> getAll() {
        return questionRepository.findAll().stream().map(questionMapper::toDto).toList();
    }

    public QuestionDto getById(Long id) {
        return questionMapper.toDto(findEntity(id));
    }

    public QuestionDto create(QuestionDto dto) {
        Question entity = questionMapper.toEntity(dto);
        entity.setQuestionId(null);
        return questionMapper.toDto(questionRepository.save(entity));
    }

    public QuestionDto update(Long id, QuestionDto dto) {
        findEntity(id);
        Question entity = questionMapper.toEntity(dto);
        entity.setQuestionId(id);
        return questionMapper.toDto(questionRepository.save(entity));
    }

    public void delete(Long id) {
        questionRepository.delete(findEntity(id));
    }

    private Question findEntity(Long id) {
        return questionRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Question not found: " + id));
    }
}
