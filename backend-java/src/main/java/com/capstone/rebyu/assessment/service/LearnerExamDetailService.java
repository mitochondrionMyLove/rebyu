package com.capstone.rebyu.assessment.service;

import com.capstone.rebyu.assessment.dto.LearnerExamDetailDto;
import com.capstone.rebyu.assessment.entity.LearnerExamDetail;
import com.capstone.rebyu.assessment.mapper.LearnerExamDetailMapper;
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

    public List<LearnerExamDetailDto> getByAttempt(Long learnerId, Long examId, Integer attemptNo) {
        log.debug("Fetching learner exam details learnerId: {}, examId: {}, attemptNo: {}", learnerId, examId, attemptNo);
        return learnerExamDetailRepository
                .findByLearner_LearnerIdAndExam_ExamIdAndAttemptNo(learnerId, examId, attemptNo)
                .stream().map(learnerExamDetailMapper::toDto).toList();
    }

    public LearnerExamDetailDto getById(Long id) {
        log.debug("Fetching learner exam detail id: {}", id);
        return learnerExamDetailMapper.toDto(findEntity(id));
    }

    public LearnerExamDetailDto create(LearnerExamDetailDto dto) {
        log.info("Creating learner exam detail for learnerId: {}, examId: {}", dto.getLearnerId(), dto.getExamId());
        LearnerExamDetail entity = learnerExamDetailMapper.toEntity(dto);
        entity.setLearnerExamDetailId(null);
        LearnerExamDetailDto result = learnerExamDetailMapper.toDto(learnerExamDetailRepository.save(entity));
        log.info("LearnerExamDetail created with id: {}", result.getLearnerExamDetailId());
        return result;
    }

    public LearnerExamDetailDto update(Long id, LearnerExamDetailDto dto) {
        log.info("Updating learner exam detail id: {}", id);
        findEntity(id);
        LearnerExamDetail entity = learnerExamDetailMapper.toEntity(dto);
        entity.setLearnerExamDetailId(id);
        LearnerExamDetailDto result = learnerExamDetailMapper.toDto(learnerExamDetailRepository.save(entity));
        log.info("LearnerExamDetail id: {} updated", id);
        return result;
    }

    public void delete(Long id) {
        log.info("Deleting learner exam detail id: {}", id);
        learnerExamDetailRepository.delete(findEntity(id));
        log.info("LearnerExamDetail id: {} deleted", id);
    }

    private LearnerExamDetail findEntity(Long id) {
        return learnerExamDetailRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("LearnerExamDetail not found: " + id));
    }
}
