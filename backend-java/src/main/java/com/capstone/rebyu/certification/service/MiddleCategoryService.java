package com.capstone.rebyu.certification.service;


import com.capstone.rebyu.certification.entity.Certification;
import com.capstone.rebyu.certification.dto.MiddleCategoryDto;
import com.capstone.rebyu.certification.mapper.MiddleCategoryMapper;
import com.capstone.rebyu.certification.entity.MiddleCategory;
import com.capstone.rebyu.certification.repository.MiddleCategoryRepository;
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
public class MiddleCategoryService {
    private final MiddleCategoryRepository middleCategoryRepository;
    private final MiddleCategoryMapper middleCategoryMapper;

    public List<MiddleCategoryDto> getAll() {
        log.debug("Fetching all middle categories");
        return middleCategoryRepository.findAll().stream().map(middleCategoryMapper::toDto).toList();
    }

    public MiddleCategoryDto getById(Long id) {
        log.debug("Fetching middle category id: {}", id);
        return middleCategoryMapper.toDto(findEntity(id));
    }

    public MiddleCategoryDto create(MiddleCategoryDto dto) {
        log.info("Creating new middle category");
        MiddleCategory entity = middleCategoryMapper.toEntity(dto);
        entity.setMiddleCategoryId(null);
        MiddleCategoryDto result = middleCategoryMapper.toDto(middleCategoryRepository.save(entity));
        log.info("MiddleCategory created with id: {}", result.getMiddleCategoryId());
        return result;
    }

    public MiddleCategoryDto update(Long id, MiddleCategoryDto dto) {
        log.info("Updating middle category id: {}", id);
        findEntity(id);
        MiddleCategory entity = middleCategoryMapper.toEntity(dto);
        entity.setMiddleCategoryId(id);
        MiddleCategoryDto result = middleCategoryMapper.toDto(middleCategoryRepository.save(entity));
        log.info("MiddleCategory id: {} updated", id);
        return result;
    }

    public void delete(Long id) {
        log.info("Deleting middle category id: {}", id);
        middleCategoryRepository.delete(findEntity(id));
        log.info("MiddleCategory id: {} deleted", id);
    }

    private MiddleCategory findEntity(Long id) {
        return middleCategoryRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("MiddleCategory not found: " + id));
    }
}
