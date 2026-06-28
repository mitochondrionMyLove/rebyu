package com.capstone.rebyu.assessment.service;

import com.capstone.rebyu.assessment.dto.LearnerExamDetailDto;
import com.capstone.rebyu.assessment.mapper.LearnerExamDetailMapper;
import com.capstone.rebyu.assessment.entity.LearnerExamDetail;
import com.capstone.rebyu.assessment.entity.LearnerExamDetailId;
import com.capstone.rebyu.assessment.repository.LearnerExamDetailRepository;
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
public class LearnerExamDetailService {
    private final LearnerExamDetailRepository learnerExamDetailRepository;
    private final LearnerExamDetailMapper learnerExamDetailMapper;

    public List<LearnerExamDetailDto> getAll() {
        log.debug("Fetching all learner exam details");
        return learnerExamDetailRepository.findAll().stream().map(learnerExamDetailMapper::toDto).toList();
    }

    public LearnerExamDetailDto getById(Long learnerId, Long examId, Integer attemptNo, Long questionId) {
        log.debug("Fetching learner exam detail learnerId: {}, examId: {}, attemptNo: {}, questionId: {}", learnerId, examId, attemptNo, questionId);
        return learnerExamDetailMapper.toDto(findEntity(learnerId, examId, attemptNo, questionId));
    }

    public LearnerExamDetailDto create(LearnerExamDetailDto dto) {
        log.info("Creating learner exam detail for learnerId: {}, examId: {}", dto.getLearnerId(), dto.getExamId());
        LearnerExamDetail entity = learnerExamDetailMapper.toEntity(dto);
        LearnerExamDetailDto result = learnerExamDetailMapper.toDto(learnerExamDetailRepository.save(entity));
        log.info("LearnerExamDetail created");
        return result;
    }

    public LearnerExamDetailDto update(Long learnerId, Long examId, Integer attemptNo, Long questionId, LearnerExamDetailDto dto) {
        log.info("Updating learner exam detail learnerId: {}, examId: {}, attemptNo: {}, questionId: {}", learnerId, examId, attemptNo, questionId);
        findEntity(learnerId, examId, attemptNo, questionId);
        dto.setLearnerId(learnerId);
        dto.setExamId(examId);
        dto.setAttemptNo(attemptNo);
        dto.setQuestionId(questionId);
        LearnerExamDetail entity = learnerExamDetailMapper.toEntity(dto);
        LearnerExamDetailDto result = learnerExamDetailMapper.toDto(learnerExamDetailRepository.save(entity));
        log.info("LearnerExamDetail updated");
        return result;
    }

    public void delete(Long learnerId, Long examId, Integer attemptNo, Long questionId) {
        log.info("Deleting learner exam detail learnerId: {}, examId: {}, attemptNo: {}, questionId: {}", learnerId, examId, attemptNo, questionId);
        learnerExamDetailRepository.delete(findEntity(learnerId, examId, attemptNo, questionId));
        log.info("LearnerExamDetail deleted");
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
