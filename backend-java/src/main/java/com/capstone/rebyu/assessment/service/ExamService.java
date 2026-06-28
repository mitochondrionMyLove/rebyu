package com.capstone.rebyu.assessment.service;

import com.capstone.rebyu.assessment.dto.ExamDto;
import com.capstone.rebyu.assessment.mapper.ExamMapper;
import com.capstone.rebyu.assessment.entity.Exam;
import com.capstone.rebyu.assessment.repository.ExamRepository;
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
public class ExamService {
    private final ExamRepository examRepository;
    private final ExamMapper examMapper;

    public List<ExamDto> getAll() {
        log.debug("Fetching all exams");
        return examRepository.findAll().stream().map(examMapper::toDto).toList();
    }

    public ExamDto getById(Long id) {
        log.debug("Fetching exam id: {}", id);
        return examMapper.toDto(findEntity(id));
    }

    public ExamDto create(ExamDto dto) {
        log.info("Creating new exam");
        Exam entity = examMapper.toEntity(dto);
        entity.setExamId(null);
        ExamDto result = examMapper.toDto(examRepository.save(entity));
        log.info("Exam created with id: {}", result.getExamId());
        return result;
    }

    public ExamDto update(Long id, ExamDto dto) {
        log.info("Updating exam id: {}", id);
        findEntity(id);
        Exam entity = examMapper.toEntity(dto);
        entity.setExamId(id);
        ExamDto result = examMapper.toDto(examRepository.save(entity));
        log.info("Exam id: {} updated", id);
        return result;
    }

    public void delete(Long id) {
        log.info("Deleting exam id: {}", id);
        examRepository.delete(findEntity(id));
        log.info("Exam id: {} deleted", id);
    }

    private Exam findEntity(Long id) {
        return examRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Exam not found: " + id));
    }
}
