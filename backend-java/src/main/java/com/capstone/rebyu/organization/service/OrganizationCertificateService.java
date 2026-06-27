package com.capstone.rebyu.organization.service;

import com.capstone.rebyu.organization.dto.OrganizationCertificateDto;
import com.capstone.rebyu.organization.mapper.OrganizationCertificateMapper;
import com.capstone.rebyu.organization.entity.OrganizationCertificate;
import com.capstone.rebyu.organization.repository.OrganizationCertificateRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class OrganizationCertificateService {
    private final OrganizationCertificateRepository organizationCertificateRepository;
    private final OrganizationCertificateMapper organizationCertificateMapper;

    public List<OrganizationCertificateDto> getAll() {
        return organizationCertificateRepository.findAll().stream().map(organizationCertificateMapper::toDto).toList();
    }

    public OrganizationCertificateDto getById(Long id) {
        return organizationCertificateMapper.toDto(findEntity(id));
    }

    public OrganizationCertificateDto create(OrganizationCertificateDto dto) {
        OrganizationCertificate entity = organizationCertificateMapper.toEntity(dto);
        entity.setOrgCertId(null);
        return organizationCertificateMapper.toDto(organizationCertificateRepository.save(entity));
    }

    public OrganizationCertificateDto update(Long id, OrganizationCertificateDto dto) {
        findEntity(id);
        OrganizationCertificate entity = organizationCertificateMapper.toEntity(dto);
        entity.setOrgCertId(id);
        return organizationCertificateMapper.toDto(organizationCertificateRepository.save(entity));
    }

    public void delete(Long id) {
        organizationCertificateRepository.delete(findEntity(id));
    }

    private OrganizationCertificate findEntity(Long id) {
        return organizationCertificateRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("OrganizationCertificate not found: " + id));
    }
}
