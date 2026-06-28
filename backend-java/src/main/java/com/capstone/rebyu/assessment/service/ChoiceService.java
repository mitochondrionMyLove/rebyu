package com.capstone.rebyu.assessment.service;

import com.capstone.rebyu.assessment.dto.ChoiceDto;
import com.capstone.rebyu.assessment.mapper.ChoiceMapper;
import com.capstone.rebyu.assessment.entity.Choice;
import com.capstone.rebyu.assessment.repository.ChoiceRepository;
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
public class ChoiceService {
    private final ChoiceRepository choiceRepository;
    private final ChoiceMapper choiceMapper;

    public List<ChoiceDto> getAll() {
        log.debug("Fetching all choices");
        return choiceRepository.findAll().stream().map(choiceMapper::toDto).toList();
    }

    public ChoiceDto getById(Long id) {
        log.debug("Fetching choice id: {}", id);
        return choiceMapper.toDto(findEntity(id));
    }

    public ChoiceDto create(ChoiceDto dto) {
        log.info("Creating new choice");
        Choice entity = choiceMapper.toEntity(dto);
        entity.setChoiceId(null);
        ChoiceDto result = choiceMapper.toDto(choiceRepository.save(entity));
        log.info("Choice created with id: {}", result.getChoiceId());
        return result;
    }

    public ChoiceDto update(Long id, ChoiceDto dto) {
        log.info("Updating choice id: {}", id);
        findEntity(id);
        Choice entity = choiceMapper.toEntity(dto);
        entity.setChoiceId(id);
        ChoiceDto result = choiceMapper.toDto(choiceRepository.save(entity));
        log.info("Choice id: {} updated", id);
        return result;
    }

    public void delete(Long id) {
        log.info("Deleting choice id: {}", id);
        choiceRepository.delete(findEntity(id));
        log.info("Choice id: {} deleted", id);
    }

    private Choice findEntity(Long id) {
        return choiceRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Choice not found: " + id));
    }
}
