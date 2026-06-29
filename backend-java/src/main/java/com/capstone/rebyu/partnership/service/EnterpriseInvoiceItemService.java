package com.capstone.rebyu.partnership.service;

import com.capstone.rebyu.partnership.dto.EnterpriseInvoiceItemDto;
import com.capstone.rebyu.partnership.entity.EnterpriseInvoiceItem;
import com.capstone.rebyu.partnership.mapper.EnterpriseInvoiceItemMapper;
import com.capstone.rebyu.partnership.repository.EnterpriseInvoiceItemRepository;
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
public class EnterpriseInvoiceItemService {
    private final EnterpriseInvoiceItemRepository repository;
    private final EnterpriseInvoiceItemMapper mapper;

    public List<EnterpriseInvoiceItemDto> getAll() {
        return repository.findAll().stream().map(mapper::toDto).toList();
    }

    public EnterpriseInvoiceItemDto getById(Long id) {
        return mapper.toDto(findEntity(id));
    }

    public EnterpriseInvoiceItemDto create(EnterpriseInvoiceItemDto dto) {
        EnterpriseInvoiceItem entity = mapper.toEntity(dto);
        entity.setEnterpriseInvoiceItemId(null);
        EnterpriseInvoiceItemDto result = mapper.toDto(repository.save(entity));
        log.info("EnterpriseInvoiceItem created with id: {}", result.getEnterpriseInvoiceItemId());
        return result;
    }

    public EnterpriseInvoiceItemDto update(Long id, EnterpriseInvoiceItemDto dto) {
        findEntity(id);
        EnterpriseInvoiceItem entity = mapper.toEntity(dto);
        entity.setEnterpriseInvoiceItemId(id);
        return mapper.toDto(repository.save(entity));
    }

    public void delete(Long id) {
        repository.delete(findEntity(id));
    }

    private EnterpriseInvoiceItem findEntity(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("EnterpriseInvoiceItem not found: " + id));
    }
}
