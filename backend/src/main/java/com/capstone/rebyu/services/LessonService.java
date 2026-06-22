package com.capstone.rebyu.services;

import com.capstone.rebyu.dto.LessonDto;
import com.capstone.rebyu.mappers.LessonMapper;
import com.capstone.rebyu.models.Lesson;
import com.capstone.rebyu.repositories.LessonRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class LessonService {
    private final LessonRepository lessonRepository;
    private final LessonMapper lessonMapper;

    public List<LessonDto> getAll() {
        return lessonRepository.findAll().stream().map(lessonMapper::toDto).toList();
    }

    public LessonDto getById(Long id) {
        return lessonMapper.toDto(findEntity(id));
    }

    public LessonDto create(LessonDto dto) {
        Lesson entity = lessonMapper.toEntity(dto);
        entity.setLessonId(null);
        return lessonMapper.toDto(lessonRepository.save(entity));
    }

    public LessonDto update(Long id, LessonDto dto) {
        findEntity(id);
        Lesson entity = lessonMapper.toEntity(dto);
        entity.setLessonId(id);
        return lessonMapper.toDto(lessonRepository.save(entity));
    }

    public void delete(Long id) {
        lessonRepository.delete(findEntity(id));
    }

    private Lesson findEntity(Long id) {
        return lessonRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Lesson not found: " + id));
    }
}
