package com.capstone.rebyu.services;

import com.capstone.rebyu.dto.LearnerLessonMasteryDto;
import com.capstone.rebyu.mappers.LearnerLessonMasteryMapper;
import com.capstone.rebyu.models.LearnerLessonMastery;
import com.capstone.rebyu.models.LearnerLessonMasteryId;
import com.capstone.rebyu.repositories.LearnerLessonMasteryRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class LearnerLessonMasteryService {
    private final LearnerLessonMasteryRepository learnerLessonMasteryRepository;
    private final LearnerLessonMasteryMapper learnerLessonMasteryMapper;

    public List<LearnerLessonMasteryDto> getAll() {
        return learnerLessonMasteryRepository.findAll().stream().map(learnerLessonMasteryMapper::toDto).toList();
    }

    public LearnerLessonMasteryDto getById(Long learnerId, Long lessonId) {
        return learnerLessonMasteryMapper.toDto(findEntity(learnerId, lessonId));
    }

    public LearnerLessonMasteryDto create(LearnerLessonMasteryDto dto) {
        LearnerLessonMastery entity = learnerLessonMasteryMapper.toEntity(dto);
        return learnerLessonMasteryMapper.toDto(learnerLessonMasteryRepository.save(entity));
    }

    public LearnerLessonMasteryDto update(Long learnerId, Long lessonId, LearnerLessonMasteryDto dto) {
        findEntity(learnerId, lessonId);
        dto.setLearnerId(learnerId);
        dto.setLessonId(lessonId);
        LearnerLessonMastery entity = learnerLessonMasteryMapper.toEntity(dto);
        return learnerLessonMasteryMapper.toDto(learnerLessonMasteryRepository.save(entity));
    }

    public void delete(Long learnerId, Long lessonId) {
        learnerLessonMasteryRepository.delete(findEntity(learnerId, lessonId));
    }

    private LearnerLessonMastery findEntity(Long learnerId, Long lessonId) {
        LearnerLessonMasteryId id = new LearnerLessonMasteryId();
        id.setLearnerId(learnerId);
        id.setLessonId(lessonId);
        return learnerLessonMasteryRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("LearnerLessonMastery not found: " + learnerId + "/" + lessonId));
    }
}
