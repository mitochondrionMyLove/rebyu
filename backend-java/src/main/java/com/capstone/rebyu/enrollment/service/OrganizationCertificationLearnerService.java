package com.capstone.rebyu.enrollment.service;

import com.capstone.rebyu.enrollment.dto.OrganizationCertificationLearnerDto;
import com.capstone.rebyu.enrollment.mapper.OrganizationCertificationLearnerMapper;
import com.capstone.rebyu.enrollment.entity.OrganizationCertificationLearner;
import com.capstone.rebyu.enrollment.repository.OrganizationCertificationLearnerRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class OrganizationCertificationLearnerService {
    private final OrganizationCertificationLearnerRepository organizationCertificationLearnerRepository;
    private final OrganizationCertificationLearnerMapper organizationCertificationLearnerMapper;

    public List<OrganizationCertificationLearnerDto> getAll() {
        return organizationCertificationLearnerRepository.findAll().stream()
                .map(organizationCertificationLearnerMapper::toDto).toList();
    }

    public OrganizationCertificationLearnerDto getById(Long id) {
        return organizationCertificationLearnerMapper.toDto(findEntity(id));
    }

    public OrganizationCertificationLearnerDto create(OrganizationCertificationLearnerDto dto) {
        OrganizationCertificationLearner entity = organizationCertificationLearnerMapper.toEntity(dto);
        entity.setOrgCertLearnersId(null);
        return organizationCertificationLearnerMapper.toDto(organizationCertificationLearnerRepository.save(entity));
    }

    public OrganizationCertificationLearnerDto update(Long id, OrganizationCertificationLearnerDto dto) {
        findEntity(id);
        OrganizationCertificationLearner entity = organizationCertificationLearnerMapper.toEntity(dto);
        entity.setOrgCertLearnersId(id);
        return organizationCertificationLearnerMapper.toDto(organizationCertificationLearnerRepository.save(entity));
    }

    public void delete(Long id) {
        organizationCertificationLearnerRepository.delete(findEntity(id));
    }

    private OrganizationCertificationLearner findEntity(Long id) {
        return organizationCertificationLearnerRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("OrganizationCertificationLearner not found: " + id));
    }
}
