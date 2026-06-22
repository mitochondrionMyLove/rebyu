package com.capstone.rebyu.services;

import com.capstone.rebyu.dto.CertificationDto;
import com.capstone.rebyu.mappers.CertificationMapper;
import com.capstone.rebyu.models.Certification;
import com.capstone.rebyu.repositories.CertificationRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CertificationService {
    private final CertificationRepository certificationRepository;
    private final CertificationMapper certificationMapper;

    public List<CertificationDto> getAll() {
        return certificationRepository.findAll().stream().map(certificationMapper::toDto).toList();
    }

    public CertificationDto getById(Long id) {
        return certificationMapper.toDto(findEntity(id));
    }

    public CertificationDto create(CertificationDto dto) {
        Certification entity = certificationMapper.toEntity(dto);
        entity.setCertificationId(null);
        return certificationMapper.toDto(certificationRepository.save(entity));
    }

    public CertificationDto update(Long id, CertificationDto dto) {
        findEntity(id);
        Certification entity = certificationMapper.toEntity(dto);
        entity.setCertificationId(id);
        return certificationMapper.toDto(certificationRepository.save(entity));
    }

    public void delete(Long id) {
        certificationRepository.delete(findEntity(id));
    }

    private Certification findEntity(Long id) {
        return certificationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Certification not found: " + id));
    }
}
