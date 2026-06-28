package com.capstone.rebyu.assessment.service;

import com.capstone.rebyu.assessment.dto.ExamResultDto;
import com.capstone.rebyu.assessment.mapper.ExamResultMapper;
import com.capstone.rebyu.assessment.entity.ExamResult;
import com.capstone.rebyu.assessment.entity.ExamResultId;
import com.capstone.rebyu.assessment.repository.ExamResultRepository;
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
public class ExamResultService {
    private final ExamResultRepository examResultRepository;
    private final ExamResultMapper examResultMapper;

    public List<ExamResultDto> getAll() {
        log.debug("Fetching all exam results");
        return examResultRepository.findAll().stream().map(examResultMapper::toDto).toList();
    }

    public ExamResultDto getById(Long learnerId, Long examId, Integer attemptNo) {
        log.debug("Fetching exam result learnerId: {}, examId: {}, attemptNo: {}", learnerId, examId, attemptNo);
        return examResultMapper.toDto(findEntity(learnerId, examId, attemptNo));
    }

    public ExamResultDto create(ExamResultDto dto) {
        log.info("Creating exam result for learnerId: {}, examId: {}", dto.getLearnerId(), dto.getExamId());
        ExamResult entity = examResultMapper.toEntity(dto);
        ExamResultDto result = examResultMapper.toDto(examResultRepository.save(entity));
        log.info("ExamResult created");
        return result;
    }

    public ExamResultDto update(Long learnerId, Long examId, Integer attemptNo, ExamResultDto dto) {
        log.info("Updating exam result learnerId: {}, examId: {}, attemptNo: {}", learnerId, examId, attemptNo);
        findEntity(learnerId, examId, attemptNo);
        dto.setLearnerId(learnerId);
        dto.setExamId(examId);
        dto.setAttemptNo(attemptNo);
        ExamResult entity = examResultMapper.toEntity(dto);
        ExamResultDto result = examResultMapper.toDto(examResultRepository.save(entity));
        log.info("ExamResult updated");
        return result;
    }

    public void delete(Long learnerId, Long examId, Integer attemptNo) {
        log.info("Deleting exam result learnerId: {}, examId: {}, attemptNo: {}", learnerId, examId, attemptNo);
        examResultRepository.delete(findEntity(learnerId, examId, attemptNo));
        log.info("ExamResult deleted");
    }

    private ExamResult findEntity(Long learnerId, Long examId, Integer attemptNo) {
        ExamResultId id = new ExamResultId();
        id.setLearnerId(learnerId);
        id.setExamId(examId);
        id.setAttemptNo(attemptNo);
        return examResultRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("ExamResult not found: " + learnerId + "/" + examId + "/" + attemptNo));
    }
}
