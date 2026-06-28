package com.capstone.rebyu.assessment.service;

import com.capstone.rebyu.assessment.dto.ExamQuestionDto;
import com.capstone.rebyu.assessment.mapper.ExamQuestionMapper;
import com.capstone.rebyu.assessment.entity.ExamQuestion;
import com.capstone.rebyu.assessment.repository.ExamQuestionRepository;
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
public class ExamQuestionService {
    private final ExamQuestionRepository examQuestionRepository;
    private final ExamQuestionMapper examQuestionMapper;

    public List<ExamQuestionDto> getAll() {
        log.debug("Fetching all exam questions");
        return examQuestionRepository.findAll().stream().map(examQuestionMapper::toDto).toList();
    }

    public ExamQuestionDto getById(Long id) {
        log.debug("Fetching exam question id: {}", id);
        return examQuestionMapper.toDto(findEntity(id));
    }

    public ExamQuestionDto create(ExamQuestionDto dto) {
        log.info("Creating new exam question");
        ExamQuestion entity = examQuestionMapper.toEntity(dto);
        entity.setExamQuestionId(null);
        ExamQuestionDto result = examQuestionMapper.toDto(examQuestionRepository.save(entity));
        log.info("ExamQuestion created with id: {}", result.getExamQuestionId());
        return result;
    }

    public ExamQuestionDto update(Long id, ExamQuestionDto dto) {
        log.info("Updating exam question id: {}", id);
        findEntity(id);
        ExamQuestion entity = examQuestionMapper.toEntity(dto);
        entity.setExamQuestionId(id);
        ExamQuestionDto result = examQuestionMapper.toDto(examQuestionRepository.save(entity));
        log.info("ExamQuestion id: {} updated", id);
        return result;
    }

    public void delete(Long id) {
        log.info("Deleting exam question id: {}", id);
        examQuestionRepository.delete(findEntity(id));
        log.info("ExamQuestion id: {} deleted", id);
    }

    private ExamQuestion findEntity(Long id) {
        return examQuestionRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("ExamQuestion not found: " + id));
    }
}
