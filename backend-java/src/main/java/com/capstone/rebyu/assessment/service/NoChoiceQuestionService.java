package com.capstone.rebyu.assessment.service;

import com.capstone.rebyu.assessment.dto.NoChoiceQuestionDto;
import com.capstone.rebyu.assessment.mapper.NoChoiceQuestionMapper;
import com.capstone.rebyu.assessment.entity.NoChoiceQuestion;
import com.capstone.rebyu.assessment.repository.NoChoiceQuestionRepository;
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
