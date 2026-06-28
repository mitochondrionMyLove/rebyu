package com.capstone.rebyu.assessment.service;

import com.capstone.rebyu.assessment.dto.QuestionDto;
import com.capstone.rebyu.assessment.entity.Question;
import com.capstone.rebyu.assessment.mapper.QuestionMapper;
import com.capstone.rebyu.assessment.repository.QuestionRepository;
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
public class QuestionService {
    private final QuestionRepository questionRepository;
    private final QuestionMapper questionMapper;

    public List<QuestionDto> getAll() {
        log.debug("Fetching all questions");
        return questionRepository.findAll().stream().map(questionMapper::toDto).toList();
    }

    public QuestionDto getById(Long id) {
        log.debug("Fetching question id: {}", id);
        return questionMapper.toDto(findEntity(id));
    }

    public QuestionDto create(QuestionDto dto) {
        log.info("Creating new question");
        Question entity = questionMapper.toEntity(dto);
        entity.setQuestionId(null);
        QuestionDto result = questionMapper.toDto(questionRepository.save(entity));
        log.info("Question created with id: {}", result.getQuestionId());
        return result;
    }

    public QuestionDto update(Long id, QuestionDto dto) {
        log.info("Updating question id: {}", id);
        findEntity(id);
        Question entity = questionMapper.toEntity(dto);
        entity.setQuestionId(id);
        QuestionDto result = questionMapper.toDto(questionRepository.save(entity));
        log.info("Question id: {} updated", id);
        return result;
    }

    public void delete(Long id) {
        log.info("Deleting question id: {}", id);
        questionRepository.delete(findEntity(id));
        log.info("Question id: {} deleted", id);
    }

    private Question findEntity(Long id) {
        return questionRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Question not found: " + id));
    }
}
