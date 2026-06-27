package com.capstone.rebyu.assessment.service;

import com.capstone.rebyu.assessment.dto.LearnerExamDetailDto;
import com.capstone.rebyu.assessment.mapper.LearnerExamDetailMapper;
import com.capstone.rebyu.assessment.entity.LearnerExamDetail;
import com.capstone.rebyu.assessment.entity.LearnerExamDetailId;
import com.capstone.rebyu.assessment.repository.LearnerExamDetailRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class LearnerExamDetailService {
    private final LearnerExamDetailRepository learnerExamDetailRepository;
    private final LearnerExamDetailMapper learnerExamDetailMapper;

    public List<LearnerExamDetailDto> getAll() {
        return learnerExamDetailRepository.findAll().stream().map(learnerExamDetailMapper::toDto).toList();
    }

    public LearnerExamDetailDto getById(Long learnerId, Long examId, Integer attemptNo, Long questionId) {
        return learnerExamDetailMapper.toDto(findEntity(learnerId, examId, attemptNo, questionId));
    }

    public LearnerExamDetailDto create(LearnerExamDetailDto dto) {
        LearnerExamDetail entity = learnerExamDetailMapper.toEntity(dto);
        return learnerExamDetailMapper.toDto(learnerExamDetailRepository.save(entity));
    }

    public LearnerExamDetailDto update(Long learnerId, Long examId, Integer attemptNo, Long questionId, LearnerExamDetailDto dto) {
        findEntity(learnerId, examId, attemptNo, questionId);
        dto.setLearnerId(learnerId);
        dto.setExamId(examId);
        dto.setAttemptNo(attemptNo);
        dto.setQuestionId(questionId);
        LearnerExamDetail entity = learnerExamDetailMapper.toEntity(dto);
        return learnerExamDetailMapper.toDto(learnerExamDetailRepository.save(entity));
    }

    public void delete(Long learnerId, Long examId, Integer attemptNo, Long questionId) {
        learnerExamDetailRepository.delete(findEntity(learnerId, examId, attemptNo, questionId));
    }

    private LearnerExamDetail findEntity(Long learnerId, Long examId, Integer attemptNo, Long questionId) {
        LearnerExamDetailId id = new LearnerExamDetailId();
        id.setLearnerId(learnerId);
        id.setExamId(examId);
        id.setAttemptNo(attemptNo);
        id.setQuestionId(questionId);
        return learnerExamDetailRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(
                        "LearnerExamDetail not found: " + learnerId + "/" + examId + "/" + attemptNo + "/" + questionId));
    }
}
