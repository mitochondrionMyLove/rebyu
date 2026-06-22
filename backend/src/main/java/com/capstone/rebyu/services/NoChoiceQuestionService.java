package com.capstone.rebyu.services;

import com.capstone.rebyu.dto.NoChoiceQuestionDto;
import com.capstone.rebyu.mappers.NoChoiceQuestionMapper;
import com.capstone.rebyu.models.NoChoiceQuestion;
import com.capstone.rebyu.repositories.NoChoiceQuestionRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class NoChoiceQuestionService {
    private final NoChoiceQuestionRepository noChoiceQuestionRepository;
    private final NoChoiceQuestionMapper noChoiceQuestionMapper;

    public List<NoChoiceQuestionDto> getAll() {
        return noChoiceQuestionRepository.findAll().stream().map(noChoiceQuestionMapper::toDto).toList();
    }

    public NoChoiceQuestionDto getById(Long id) {
        return noChoiceQuestionMapper.toDto(findEntity(id));
    }

    public NoChoiceQuestionDto create(NoChoiceQuestionDto dto) {
        NoChoiceQuestion entity = noChoiceQuestionMapper.toEntity(dto);
        entity.setNoChoiceQuestionId(null);
        return noChoiceQuestionMapper.toDto(noChoiceQuestionRepository.save(entity));
    }

    public NoChoiceQuestionDto update(Long id, NoChoiceQuestionDto dto) {
        findEntity(id);
        NoChoiceQuestion entity = noChoiceQuestionMapper.toEntity(dto);
        entity.setNoChoiceQuestionId(id);
        return noChoiceQuestionMapper.toDto(noChoiceQuestionRepository.save(entity));
    }

    public void delete(Long id) {
        noChoiceQuestionRepository.delete(findEntity(id));
    }

    private NoChoiceQuestion findEntity(Long id) {
        return noChoiceQuestionRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("NoChoiceQuestion not found: " + id));
    }
}
