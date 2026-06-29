package com.capstone.rebyu.partnership.service;

import com.capstone.rebyu.partnership.dto.EnterpriseInvoiceDto;
import com.capstone.rebyu.partnership.entity.EnterpriseInvoice;
import com.capstone.rebyu.partnership.mapper.EnterpriseInvoiceMapper;
import com.capstone.rebyu.partnership.repository.EnterpriseInvoiceRepository;
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
public class EnterpriseInvoiceService {
    private final EnterpriseInvoiceRepository repository;
    private final EnterpriseInvoiceMapper mapper;

    public List<EnterpriseInvoiceDto> getAll() {
        return repository.findAll().stream().map(mapper::toDto).toList();
    }

    public EnterpriseInvoiceDto getById(Long id) {
        return mapper.toDto(findEntity(id));
    }

    public EnterpriseInvoiceDto create(EnterpriseInvoiceDto dto) {
        EnterpriseInvoice entity = mapper.toEntity(dto);
        entity.setEnterpriseInvoiceId(null);
        EnterpriseInvoiceDto result = mapper.toDto(repository.save(entity));
        log.info("EnterpriseInvoice created with id: {}", result.getEnterpriseInvoiceId());
        return result;
    }

    public EnterpriseInvoiceDto update(Long id, EnterpriseInvoiceDto dto) {
        findEntity(id);
        EnterpriseInvoice entity = mapper.toEntity(dto);
        entity.setEnterpriseInvoiceId(id);
        return mapper.toDto(repository.save(entity));
    }

    public void delete(Long id) {
        repository.delete(findEntity(id));
    }

    private EnterpriseInvoice findEntity(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("EnterpriseInvoice not found: " + id));
    }
}
