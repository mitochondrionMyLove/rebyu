package com.capstone.rebyu.organization.service;

import com.capstone.rebyu.organization.dto.EnterpriseVerificationDocumentDto;
import com.capstone.rebyu.organization.entity.EnterpriseVerificationDocument;
import com.capstone.rebyu.organization.mapper.EnterpriseVerificationDocumentMapper;
import com.capstone.rebyu.organization.repository.EnterpriseVerificationDocumentRepository;
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
public class EnterpriseVerificationDocumentService {
    private final EnterpriseVerificationDocumentRepository repository;
    private final EnterpriseVerificationDocumentMapper mapper;

    public List<EnterpriseVerificationDocumentDto> getAll() {
        return repository.findAll().stream().map(mapper::toDto).toList();
    }

    public EnterpriseVerificationDocumentDto getById(Long id) {
        return mapper.toDto(findEntity(id));
    }

    public EnterpriseVerificationDocumentDto create(EnterpriseVerificationDocumentDto dto) {
        EnterpriseVerificationDocument entity = mapper.toEntity(dto);
        entity.setEnterpriseDocumentId(null);
        EnterpriseVerificationDocumentDto result = mapper.toDto(repository.save(entity));
        log.info("EnterpriseVerificationDocument created with id: {}", result.getEnterpriseDocumentId());
        return result;
    }

    public EnterpriseVerificationDocumentDto update(Long id, EnterpriseVerificationDocumentDto dto) {
        findEntity(id);
        EnterpriseVerificationDocument entity = mapper.toEntity(dto);
        entity.setEnterpriseDocumentId(id);
        return mapper.toDto(repository.save(entity));
    }

    public void delete(Long id) {
        repository.delete(findEntity(id));
    }

    private EnterpriseVerificationDocument findEntity(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("EnterpriseVerificationDocument not found: " + id));
    }
}
