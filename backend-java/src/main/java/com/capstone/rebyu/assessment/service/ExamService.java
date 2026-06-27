package com.capstone.rebyu.assessment.service;

import com.capstone.rebyu.assessment.dto.ExamDto;
import com.capstone.rebyu.assessment.mapper.ExamMapper;
import com.capstone.rebyu.assessment.entity.Exam;
import com.capstone.rebyu.assessment.repository.ExamRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ExamService {
    private final ExamRepository examRepository;
    private final ExamMapper examMapper;

    public List<ExamDto> getAll() {
        return examRepository.findAll().stream().map(examMapper::toDto).toList();
    }

    public ExamDto getById(Long id) {
        return examMapper.toDto(findEntity(id));
    }

    public ExamDto create(ExamDto dto) {
        Exam entity = examMapper.toEntity(dto);
        entity.setExamId(null);
        return examMapper.toDto(examRepository.save(entity));
    }

    public ExamDto update(Long id, ExamDto dto) {
        findEntity(id);
        Exam entity = examMapper.toEntity(dto);
        entity.setExamId(id);
        return examMapper.toDto(examRepository.save(entity));
    }

    public void delete(Long id) {
        examRepository.delete(findEntity(id));
    }

    private Exam findEntity(Long id) {
        return examRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Exam not found: " + id));
    }
}
