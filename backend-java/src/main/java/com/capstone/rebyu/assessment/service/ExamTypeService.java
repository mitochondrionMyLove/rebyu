package com.capstone.rebyu.assessment.service;

import com.capstone.rebyu.assessment.dto.ExamTypeDto;
import com.capstone.rebyu.assessment.mapper.ExamTypeMapper;
import com.capstone.rebyu.assessment.entity.ExamType;
import com.capstone.rebyu.assessment.repository.ExamTypeRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ExamTypeService {
    private final ExamTypeRepository examTypeRepository;
    private final ExamTypeMapper examTypeMapper;

    public List<ExamTypeDto> getAll() {
        return examTypeRepository.findAll().stream().map(examTypeMapper::toDto).toList();
    }

    public ExamTypeDto getById(Long id) {
        return examTypeMapper.toDto(findEntity(id));
    }

    public ExamTypeDto create(ExamTypeDto dto) {
        ExamType entity = examTypeMapper.toEntity(dto);
        entity.setExamTypeId(null);
        return examTypeMapper.toDto(examTypeRepository.save(entity));
    }

    public ExamTypeDto update(Long id, ExamTypeDto dto) {
        findEntity(id);
        ExamType entity = examTypeMapper.toEntity(dto);
        entity.setExamTypeId(id);
        return examTypeMapper.toDto(examTypeRepository.save(entity));
    }

    public void delete(Long id) {
        examTypeRepository.delete(findEntity(id));
    }

    private ExamType findEntity(Long id) {
        return examTypeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("ExamType not found: " + id));
    }
}
