package com.capstone.rebyu.partnership.service;

import com.capstone.rebyu.partnership.dto.EnterpriseCertificationRenewalRequestDto;
import com.capstone.rebyu.partnership.entity.EnterpriseCertificationRenewalRequest;
import com.capstone.rebyu.partnership.mapper.EnterpriseCertificationRenewalRequestMapper;
import com.capstone.rebyu.partnership.repository.EnterpriseCertificationRenewalRequestRepository;
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
public class EnterpriseCertificationRenewalRequestService {
    private final EnterpriseCertificationRenewalRequestRepository renewalRequestRepository;
    private final EnterpriseCertificationRenewalRequestMapper renewalRequestMapper;

    public List<EnterpriseCertificationRenewalRequestDto> getAll() {
        log.debug("Fetching all enterprise certification renewal requests");
        return renewalRequestRepository.findAll().stream().map(renewalRequestMapper::toDto).toList();
    }

    public List<EnterpriseCertificationRenewalRequestDto> getByOrgCertId(Long orgCertId) {
        log.debug("Fetching renewal requests for orgCertId: {}", orgCertId);
        return renewalRequestRepository.findByOrgCert_OrgCertId(orgCertId)
                .stream().map(renewalRequestMapper::toDto).toList();
    }

    public EnterpriseCertificationRenewalRequestDto getById(Long id) {
        log.debug("Fetching renewal request id: {}", id);
        return renewalRequestMapper.toDto(findEntity(id));
    }

    public EnterpriseCertificationRenewalRequestDto create(EnterpriseCertificationRenewalRequestDto dto) {
        log.info("Creating new enterprise certification renewal request");
        EnterpriseCertificationRenewalRequest entity = renewalRequestMapper.toEntity(dto);
        entity.setRenewalRequestId(null);
        EnterpriseCertificationRenewalRequestDto result = renewalRequestMapper.toDto(renewalRequestRepository.save(entity));
        log.info("EnterpriseCertificationRenewalRequest created with id: {}", result.getRenewalRequestId());
        return result;
    }

    public EnterpriseCertificationRenewalRequestDto update(Long id, EnterpriseCertificationRenewalRequestDto dto) {
        log.info("Updating renewal request id: {}", id);
        findEntity(id);
        EnterpriseCertificationRenewalRequest entity = renewalRequestMapper.toEntity(dto);
        entity.setRenewalRequestId(id);
        EnterpriseCertificationRenewalRequestDto result = renewalRequestMapper.toDto(renewalRequestRepository.save(entity));
        log.info("EnterpriseCertificationRenewalRequest id: {} updated", id);
        return result;
    }

    public void delete(Long id) {
        log.info("Deleting renewal request id: {}", id);
        renewalRequestRepository.delete(findEntity(id));
        log.info("EnterpriseCertificationRenewalRequest id: {} deleted", id);
    }

    private EnterpriseCertificationRenewalRequest findEntity(Long id) {
        return renewalRequestRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("EnterpriseCertificationRenewalRequest not found: " + id));
    }
}
