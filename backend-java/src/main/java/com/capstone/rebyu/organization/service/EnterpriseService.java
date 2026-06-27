package com.capstone.rebyu.organization.service;

import com.capstone.rebyu.organization.dto.EnterpriseDto;
import com.capstone.rebyu.organization.mapper.EnterpriseMapper;
import com.capstone.rebyu.organization.entity.Enterprise;
import com.capstone.rebyu.organization.repository.EnterpriseRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class EnterpriseService {
    private final EnterpriseRepository enterpriseRepository;
    private final EnterpriseMapper enterpriseMapper;

    public List<EnterpriseDto> getAll() {
        return enterpriseRepository.findAll().stream().map(enterpriseMapper::toDto).toList();
    }

    public EnterpriseDto getById(Long id) {
        return enterpriseMapper.toDto(findEntity(id));
    }

    public EnterpriseDto create(EnterpriseDto dto) {
        Enterprise entity = enterpriseMapper.toEntity(dto);
        entity.setEnterpriseId(null);
        return enterpriseMapper.toDto(enterpriseRepository.save(entity));
    }

    public EnterpriseDto update(Long id, EnterpriseDto dto) {
        findEntity(id);
        Enterprise entity = enterpriseMapper.toEntity(dto);
        entity.setEnterpriseId(id);
        return enterpriseMapper.toDto(enterpriseRepository.save(entity));
    }

    public void delete(Long id) {
        enterpriseRepository.delete(findEntity(id));
    }

    private Enterprise findEntity(Long id) {
        return enterpriseRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Enterprise not found: " + id));
    }
}
