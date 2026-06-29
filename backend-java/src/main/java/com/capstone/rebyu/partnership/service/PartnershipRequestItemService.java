package com.capstone.rebyu.partnership.service;

import com.capstone.rebyu.partnership.dto.PartnershipRequestItemDto;
import com.capstone.rebyu.partnership.mapper.PartnershipRequestItemMapper;
import com.capstone.rebyu.partnership.entity.PartnershipRequestItem;
import com.capstone.rebyu.partnership.repository.PartnershipRequestItemRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class PartnershipRequestItemService {
    private final PartnershipRequestItemRepository partnershipRequestItemRepository;
    private final PartnershipRequestItemMapper partnershipRequestItemMapper;

    public List<PartnershipRequestItemDto> getAll() {
        return partnershipRequestItemRepository.findAll().stream().map(partnershipRequestItemMapper::toDto).toList();
    }

    public PartnershipRequestItemDto getById(Long id) {
        return partnershipRequestItemMapper.toDto(findEntity(id));
    }

    public PartnershipRequestItemDto create(PartnershipRequestItemDto dto) {
        PartnershipRequestItem entity = partnershipRequestItemMapper.toEntity(dto);
        entity.setPartnershipRequestItemId(null);
        return partnershipRequestItemMapper.toDto(partnershipRequestItemRepository.save(entity));
    }

    public PartnershipRequestItemDto update(Long id, PartnershipRequestItemDto dto) {
        findEntity(id);
        PartnershipRequestItem entity = partnershipRequestItemMapper.toEntity(dto);
        entity.setPartnershipRequestItemId(id);
        return partnershipRequestItemMapper.toDto(partnershipRequestItemRepository.save(entity));
    }

    public void delete(Long id) {
        partnershipRequestItemRepository.delete(findEntity(id));
    }

    private PartnershipRequestItem findEntity(Long id) {
        return partnershipRequestItemRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("PartnershipRequestItem not found: " + id));
    }
}
