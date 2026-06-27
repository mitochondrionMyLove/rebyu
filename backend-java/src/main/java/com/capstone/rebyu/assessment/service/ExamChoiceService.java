package com.capstone.rebyu.assessment.service;

import com.capstone.rebyu.assessment.dto.ExamChoiceDto;
import com.capstone.rebyu.assessment.mapper.ExamChoiceMapper;
import com.capstone.rebyu.assessment.entity.ExamChoice;
import com.capstone.rebyu.assessment.entity.ExamChoiceId;
import com.capstone.rebyu.assessment.repository.ExamChoiceRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ExamChoiceService {
    private final ExamChoiceRepository examChoiceRepository;
    private final ExamChoiceMapper examChoiceMapper;

    public List<ExamChoiceDto> getAll() {
        return examChoiceRepository.findAll().stream().map(examChoiceMapper::toDto).toList();
    }

    public ExamChoiceDto getById(Long examQuestionId, Long choiceId) {
        return examChoiceMapper.toDto(findEntity(examQuestionId, choiceId));
    }

    public ExamChoiceDto create(ExamChoiceDto dto) {
        ExamChoice entity = examChoiceMapper.toEntity(dto);
        return examChoiceMapper.toDto(examChoiceRepository.save(entity));
    }

    public void delete(Long examQuestionId, Long choiceId) {
        examChoiceRepository.delete(findEntity(examQuestionId, choiceId));
    }

    private ExamChoice findEntity(Long examQuestionId, Long choiceId) {
        ExamChoiceId id = new ExamChoiceId();
        id.setExamQuestionId(examQuestionId);
        id.setChoiceId(choiceId);
        return examChoiceRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("ExamChoice not found: " + examQuestionId + "/" + choiceId));
    }
}
