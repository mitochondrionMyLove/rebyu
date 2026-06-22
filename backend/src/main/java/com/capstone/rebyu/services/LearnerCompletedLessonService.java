package com.capstone.rebyu.services;

import com.capstone.rebyu.dto.LearnerCompletedLessonDto;
import com.capstone.rebyu.mappers.LearnerCompletedLessonMapper;
import com.capstone.rebyu.models.LearnerCompletedLesson;
import com.capstone.rebyu.models.LearnerCompletedLessonId;
import com.capstone.rebyu.repositories.LearnerCompletedLessonRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class LearnerCompletedLessonService {
    private final LearnerCompletedLessonRepository learnerCompletedLessonRepository;
    private final LearnerCompletedLessonMapper learnerCompletedLessonMapper;

    public List<LearnerCompletedLessonDto> getAll() {
        return learnerCompletedLessonRepository.findAll().stream().map(learnerCompletedLessonMapper::toDto).toList();
    }

    public LearnerCompletedLessonDto getById(Long learnerId, Long lessonId) {
        return learnerCompletedLessonMapper.toDto(findEntity(learnerId, lessonId));
    }

    public LearnerCompletedLessonDto create(LearnerCompletedLessonDto dto) {
        LearnerCompletedLesson entity = learnerCompletedLessonMapper.toEntity(dto);
        return learnerCompletedLessonMapper.toDto(learnerCompletedLessonRepository.save(entity));
    }

    public LearnerCompletedLessonDto update(Long learnerId, Long lessonId, LearnerCompletedLessonDto dto) {
        findEntity(learnerId, lessonId);
        dto.setLearnerId(learnerId);
        dto.setLessonId(lessonId);
        LearnerCompletedLesson entity = learnerCompletedLessonMapper.toEntity(dto);
        return learnerCompletedLessonMapper.toDto(learnerCompletedLessonRepository.save(entity));
    }

    public void delete(Long learnerId, Long lessonId) {
        learnerCompletedLessonRepository.delete(findEntity(learnerId, lessonId));
    }

    private LearnerCompletedLesson findEntity(Long learnerId, Long lessonId) {
        LearnerCompletedLessonId id = new LearnerCompletedLessonId();
        id.setLearnerId(learnerId);
        id.setLessonId(lessonId);
        return learnerCompletedLessonRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("LearnerCompletedLesson not found: " + learnerId + "/" + lessonId));
    }
}
