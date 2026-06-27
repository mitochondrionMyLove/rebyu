package com.capstone.rebyu.certification.service;


import com.capstone.rebyu.certification.entity.Certification;
import com.capstone.rebyu.certification.dto.MiddleCategoryDto;
import com.capstone.rebyu.certification.mapper.MiddleCategoryMapper;
import com.capstone.rebyu.certification.entity.MiddleCategory;
import com.capstone.rebyu.certification.repository.MiddleCategoryRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class MiddleCategoryService {
    private final MiddleCategoryRepository middleCategoryRepository;
    private final MiddleCategoryMapper middleCategoryMapper;

    public List<MiddleCategoryDto> getAll() {
        return middleCategoryRepository.findAll().stream().map(middleCategoryMapper::toDto).toList();
    }

    public MiddleCategoryDto getById(Long id) {
        return middleCategoryMapper.toDto(findEntity(id));
    }

    public MiddleCategoryDto create(MiddleCategoryDto dto) {
        MiddleCategory entity = middleCategoryMapper.toEntity(dto);
        entity.setMiddleCategoryId(null);
        return middleCategoryMapper.toDto(middleCategoryRepository.save(entity));
    }

    public MiddleCategoryDto update(Long id, MiddleCategoryDto dto) {
        findEntity(id);
        MiddleCategory entity = middleCategoryMapper.toEntity(dto);
        entity.setMiddleCategoryId(id);
        return middleCategoryMapper.toDto(middleCategoryRepository.save(entity));
    }

    public void delete(Long id) {
        middleCategoryRepository.delete(findEntity(id));
    }

    private MiddleCategory findEntity(Long id) {
        return middleCategoryRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("MiddleCategory not found: " + id));
    }
}
