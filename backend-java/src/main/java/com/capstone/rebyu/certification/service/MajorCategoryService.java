package com.capstone.rebyu.certification.service;


import com.capstone.rebyu.certification.entity.Certification;
import com.capstone.rebyu.certification.dto.MajorCategoryDto;
import com.capstone.rebyu.certification.mapper.MajorCategoryMapper;
import com.capstone.rebyu.certification.entity.MajorCategory;
import com.capstone.rebyu.certification.repository.MajorCategoryRepository;
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
public class MajorCategoryService {
    private final MajorCategoryRepository majorCategoryRepository;
    private final MajorCategoryMapper majorCategoryMapper;

    public List<MajorCategoryDto> getAll() {
        log.debug("Fetching all major categories");
        return majorCategoryRepository.findAll().stream().map(majorCategoryMapper::toDto).toList();
    }

    public MajorCategoryDto getById(Long id) {
        log.debug("Fetching major category id: {}", id);
        return majorCategoryMapper.toDto(findEntity(id));
    }

    public MajorCategoryDto create(MajorCategoryDto dto) {
        log.info("Creating new major category");
        MajorCategory entity = majorCategoryMapper.toEntity(dto);
        entity.setMajorCategoryId(null);
        MajorCategoryDto result = majorCategoryMapper.toDto(majorCategoryRepository.save(entity));
        log.info("MajorCategory created with id: {}", result.getMajorCategoryId());
        return result;
    }

    public MajorCategoryDto update(Long id, MajorCategoryDto dto) {
        log.info("Updating major category id: {}", id);
        findEntity(id);
        MajorCategory entity = majorCategoryMapper.toEntity(dto);
        entity.setMajorCategoryId(id);
        MajorCategoryDto result = majorCategoryMapper.toDto(majorCategoryRepository.save(entity));
        log.info("MajorCategory id: {} updated", id);
        return result;
    }

    public void delete(Long id) {
        log.info("Deleting major category id: {}", id);
        majorCategoryRepository.delete(findEntity(id));
        log.info("MajorCategory id: {} deleted", id);
    }

    private MajorCategory findEntity(Long id) {
        return majorCategoryRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("MajorCategory not found: " + id));
    }
}
