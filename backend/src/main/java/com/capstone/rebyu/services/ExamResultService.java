package com.capstone.rebyu.services;

import com.capstone.rebyu.dto.ExamResultDto;
import com.capstone.rebyu.mappers.ExamResultMapper;
import com.capstone.rebyu.models.ExamResult;
import com.capstone.rebyu.models.ExamResultId;
import com.capstone.rebyu.repositories.ExamResultRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ExamResultService {
    private final ExamResultRepository examResultRepository;
    private final ExamResultMapper examResultMapper;

    public List<ExamResultDto> getAll() {
        return examResultRepository.findAll().stream().map(examResultMapper::toDto).toList();
    }

    public ExamResultDto getById(Long learnerId, Long examId, Integer attemptNo) {
        return examResultMapper.toDto(findEntity(learnerId, examId, attemptNo));
    }

    public ExamResultDto create(ExamResultDto dto) {
        ExamResult entity = examResultMapper.toEntity(dto);
        return examResultMapper.toDto(examResultRepository.save(entity));
    }

    public ExamResultDto update(Long learnerId, Long examId, Integer attemptNo, ExamResultDto dto) {
        findEntity(learnerId, examId, attemptNo);
        dto.setLearnerId(learnerId);
        dto.setExamId(examId);
        dto.setAttemptNo(attemptNo);
        ExamResult entity = examResultMapper.toEntity(dto);
        return examResultMapper.toDto(examResultRepository.save(entity));
    }

    public void delete(Long learnerId, Long examId, Integer attemptNo) {
        examResultRepository.delete(findEntity(learnerId, examId, attemptNo));
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
