package com.capstone.rebyu.organization.service;

import com.capstone.rebyu.organization.dto.EnterpriseDto;
import com.capstone.rebyu.organization.mapper.EnterpriseMapper;
import com.capstone.rebyu.organization.entity.Enterprise;
import com.capstone.rebyu.organization.repository.EnterpriseRepository;
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
public class EnterpriseService {
    private final EnterpriseRepository enterpriseRepository;
    private final EnterpriseMapper enterpriseMapper;

    public List<EnterpriseDto> getAll() {
        log.debug("Fetching all enterprises");
        return enterpriseRepository.findAll().stream().map(enterpriseMapper::toDto).toList();
    }

    public EnterpriseDto getById(Long id) {
        log.debug("Fetching enterprise id: {}", id);
        return enterpriseMapper.toDto(findEntity(id));
    }

    public EnterpriseDto create(EnterpriseDto dto) {
        log.info("Creating new enterprise");
        Enterprise entity = enterpriseMapper.toEntity(dto);
        entity.setEnterpriseId(null);
        EnterpriseDto result = enterpriseMapper.toDto(enterpriseRepository.save(entity));
        log.info("Enterprise created with id: {}", result.getEnterpriseId());
        return result;
    }

    public EnterpriseDto update(Long id, EnterpriseDto dto) {
        log.info("Updating enterprise id: {}", id);
        findEntity(id);
        Enterprise entity = enterpriseMapper.toEntity(dto);
        entity.setEnterpriseId(id);
        EnterpriseDto result = enterpriseMapper.toDto(enterpriseRepository.save(entity));
        log.info("Enterprise id: {} updated", id);
        return result;
    }

    public void delete(Long id) {
        log.info("Deleting enterprise id: {}", id);
        enterpriseRepository.delete(findEntity(id));
        log.info("Enterprise id: {} deleted", id);
    }

    private Enterprise findEntity(Long id) {
        return enterpriseRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Enterprise not found: " + id));
    }
}
