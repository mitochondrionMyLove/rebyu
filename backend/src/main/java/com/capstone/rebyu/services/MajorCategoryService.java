package com.capstone.rebyu.services;

import com.capstone.rebyu.dto.MajorCategoryDto;
import com.capstone.rebyu.mappers.MajorCategoryMapper;
import com.capstone.rebyu.models.MajorCategory;
import com.capstone.rebyu.repositories.MajorCategoryRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class MajorCategoryService {
    private final MajorCategoryRepository majorCategoryRepository;
    private final MajorCategoryMapper majorCategoryMapper;

    public List<MajorCategoryDto> getAll() {
        return majorCategoryRepository.findAll().stream().map(majorCategoryMapper::toDto).toList();
    }

    public MajorCategoryDto getById(Long id) {
        return majorCategoryMapper.toDto(findEntity(id));
    }

    public MajorCategoryDto create(MajorCategoryDto dto) {
        MajorCategory entity = majorCategoryMapper.toEntity(dto);
        entity.setMajorCategoryId(null);
        return majorCategoryMapper.toDto(majorCategoryRepository.save(entity));
    }

    public MajorCategoryDto update(Long id, MajorCategoryDto dto) {
        findEntity(id);
        MajorCategory entity = majorCategoryMapper.toEntity(dto);
        entity.setMajorCategoryId(id);
        return majorCategoryMapper.toDto(majorCategoryRepository.save(entity));
    }

    public void delete(Long id) {
        majorCategoryRepository.delete(findEntity(id));
    }

    private MajorCategory findEntity(Long id) {
        return majorCategoryRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("MajorCategory not found: " + id));
    }
}
