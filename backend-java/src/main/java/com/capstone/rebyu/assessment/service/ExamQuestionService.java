package com.capstone.rebyu.assessment.service;

import com.capstone.rebyu.assessment.dto.ExamQuestionDto;
import com.capstone.rebyu.assessment.mapper.ExamQuestionMapper;
import com.capstone.rebyu.assessment.entity.ExamQuestion;
import com.capstone.rebyu.assessment.repository.ExamQuestionRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ExamQuestionService {
    private final ExamQuestionRepository examQuestionRepository;
    private final ExamQuestionMapper examQuestionMapper;

    public List<ExamQuestionDto> getAll() {
        return examQuestionRepository.findAll().stream().map(examQuestionMapper::toDto).toList();
    }

    public ExamQuestionDto getById(Long id) {
        return examQuestionMapper.toDto(findEntity(id));
    }

    public ExamQuestionDto create(ExamQuestionDto dto) {
        ExamQuestion entity = examQuestionMapper.toEntity(dto);
        entity.setExamQuestionId(null);
        return examQuestionMapper.toDto(examQuestionRepository.save(entity));
    }

    public ExamQuestionDto update(Long id, ExamQuestionDto dto) {
        findEntity(id);
        ExamQuestion entity = examQuestionMapper.toEntity(dto);
        entity.setExamQuestionId(id);
        return examQuestionMapper.toDto(examQuestionRepository.save(entity));
    }

    public void delete(Long id) {
        examQuestionRepository.delete(findEntity(id));
    }

    private ExamQuestion findEntity(Long id) {
        return examQuestionRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("ExamQuestion not found: " + id));
    }
}
