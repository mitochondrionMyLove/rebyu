package com.capstone.rebyu.services;

import com.capstone.rebyu.dto.PartnershipRequestDto;
import com.capstone.rebyu.mappers.PartnershipRequestMapper;
import com.capstone.rebyu.models.PartnershipRequest;
import com.capstone.rebyu.repositories.PartnershipRequestRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class PartnershipRequestService {
    private final PartnershipRequestRepository partnershipRequestRepository;
    private final PartnershipRequestMapper partnershipRequestMapper;

    public List<PartnershipRequestDto> getAll() {
        return partnershipRequestRepository.findAll().stream().map(partnershipRequestMapper::toDto).toList();
    }

    public PartnershipRequestDto getById(Long id) {
        return partnershipRequestMapper.toDto(findEntity(id));
    }

    public PartnershipRequestDto create(PartnershipRequestDto dto) {
        PartnershipRequest entity = partnershipRequestMapper.toEntity(dto);
        entity.setRequestId(null);
        return partnershipRequestMapper.toDto(partnershipRequestRepository.save(entity));
    }

    public PartnershipRequestDto update(Long id, PartnershipRequestDto dto) {
        findEntity(id);
        PartnershipRequest entity = partnershipRequestMapper.toEntity(dto);
        entity.setRequestId(id);
        return partnershipRequestMapper.toDto(partnershipRequestRepository.save(entity));
    }

    public void delete(Long id) {
        partnershipRequestRepository.delete(findEntity(id));
    }

    private PartnershipRequest findEntity(Long id) {
        return partnershipRequestRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("PartnershipRequest not found: " + id));
    }
}
