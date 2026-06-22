package com.capstone.rebyu.services;

import com.capstone.rebyu.dto.ChoiceDto;
import com.capstone.rebyu.mappers.ChoiceMapper;
import com.capstone.rebyu.models.Choice;
import com.capstone.rebyu.repositories.ChoiceRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ChoiceService {
    private final ChoiceRepository choiceRepository;
    private final ChoiceMapper choiceMapper;

    public List<ChoiceDto> getAll() {
        return choiceRepository.findAll().stream().map(choiceMapper::toDto).toList();
    }

    public ChoiceDto getById(Long id) {
        return choiceMapper.toDto(findEntity(id));
    }

    public ChoiceDto create(ChoiceDto dto) {
        Choice entity = choiceMapper.toEntity(dto);
        entity.setChoiceId(null);
        return choiceMapper.toDto(choiceRepository.save(entity));
    }

    public ChoiceDto update(Long id, ChoiceDto dto) {
        findEntity(id);
        Choice entity = choiceMapper.toEntity(dto);
        entity.setChoiceId(id);
        return choiceMapper.toDto(choiceRepository.save(entity));
    }

    public void delete(Long id) {
        choiceRepository.delete(findEntity(id));
    }

    private Choice findEntity(Long id) {
        return choiceRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Choice not found: " + id));
    }
}
