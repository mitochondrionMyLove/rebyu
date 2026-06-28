package com.capstone.rebyu.assessment.service;

import com.capstone.rebyu.assessment.dto.ExamChoiceDto;
import com.capstone.rebyu.assessment.mapper.ExamChoiceMapper;
import com.capstone.rebyu.assessment.entity.ExamChoice;
import com.capstone.rebyu.assessment.entity.ExamChoiceId;
import com.capstone.rebyu.assessment.repository.ExamChoiceRepository;
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
public class ExamChoiceService {
    private final ExamChoiceRepository examChoiceRepository;
    private final ExamChoiceMapper examChoiceMapper;

    public List<ExamChoiceDto> getAll() {
        log.debug("Fetching all exam choices");
        return examChoiceRepository.findAll().stream().map(examChoiceMapper::toDto).toList();
    }

    public ExamChoiceDto getById(Long examQuestionId, Long choiceId) {
        log.debug("Fetching exam choice examQuestionId: {}, choiceId: {}", examQuestionId, choiceId);
        return examChoiceMapper.toDto(findEntity(examQuestionId, choiceId));
    }

    public ExamChoiceDto create(ExamChoiceDto dto) {
        log.info("Creating new exam choice");
        ExamChoiceDto result = examChoiceMapper.toDto(examChoiceRepository.save(examChoiceMapper.toEntity(dto)));
        log.info("ExamChoice created");
        return result;
    }

    public void delete(Long examQuestionId, Long choiceId) {
        log.info("Deleting exam choice examQuestionId: {}, choiceId: {}", examQuestionId, choiceId);
        examChoiceRepository.delete(findEntity(examQuestionId, choiceId));
        log.info("ExamChoice deleted");
    }

    private ExamChoice findEntity(Long examQuestionId, Long choiceId) {
        ExamChoiceId id = new ExamChoiceId();
        id.setExamQuestionId(examQuestionId);
        id.setChoiceId(choiceId);
        return examChoiceRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("ExamChoice not found: " + examQuestionId + "/" + choiceId));
    }
}
