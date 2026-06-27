package com.capstone.rebyu.certification.service;

import com.capstone.rebyu.certification.dto.LessonComponentResponseDto;
import com.capstone.rebyu.certification.dto.LessonDto;
import com.capstone.rebyu.certification.entity.Lesson;
import com.capstone.rebyu.certification.entity.MiddleCategory;
import com.capstone.rebyu.certification.mapper.LessonMapper;
import com.capstone.rebyu.certification.repository.LessonRepository;
import com.capstone.rebyu.certification.repository.MiddleCategoryRepository;
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
    private final MiddleCategoryRepository middleCategoryRepository;
    private final LessonImageService lessonImageService;
    private final LessonVideoService lessonVideoService;

    public List<LessonDto> getAll() {
        return lessonRepository.findAll()
                .stream()
                .map(lessonMapper::toDto)
                .toList();
    }

    public List<LessonDto> getByMiddleCategoryId(Long middleCategoryId) {
        return lessonRepository
                .findByMiddleCategory_MiddleCategoryId(middleCategoryId)
                .stream()
                .map(lessonMapper::toDto)
                .toList();
    }

    public LessonDto getById(Long id) {
        return lessonMapper.toDto(findEntity(id));
    }

    public LessonDto create(LessonDto dto) {
        MiddleCategory middleCategory = middleCategoryRepository
                .findById(dto.getMiddleCategoryId())
                .orElseThrow(() ->
                        new EntityNotFoundException(
                                "MiddleCategory not found: "
                                        + dto.getMiddleCategoryId()
                        )
                );

        Lesson entity = lessonMapper.toEntity(dto);

        entity.setLessonId(null);
        entity.setMiddleCategory(middleCategory);

        return lessonMapper.toDto(
                lessonRepository.save(entity)
        );
    }

    public LessonDto update(Long id, LessonDto dto) {
        findEntity(id);

        MiddleCategory middleCategory = middleCategoryRepository
                .findById(dto.getMiddleCategoryId())
                .orElseThrow(() ->
                        new EntityNotFoundException(
                                "MiddleCategory not found: "
                                        + dto.getMiddleCategoryId()
                        )
                );

        Lesson entity = lessonMapper.toEntity(dto);

        entity.setLessonId(id);
        entity.setMiddleCategory(middleCategory);

        return lessonMapper.toDto(
                lessonRepository.save(entity)
        );
    }

    public void delete(Long id) {
        lessonRepository.delete(findEntity(id));
    }

    public void saveLessonComponent(
            Long id,
            LessonDto lessonDto
    ) {
        Lesson lesson = findEntity(id);

        String structure = lessonDto.getLessonComponentStructure();

        lesson.setLessonComponentStructure(
                structure == null || structure.isBlank()
                        ? "[]"
                        : structure
        );

        lessonRepository.save(lesson);
    }

    @Transactional(readOnly = true)
    public LessonComponentResponseDto getLessonComponent(Long id) {
        Lesson lesson = findEntity(id);

        String structure = lesson.getLessonComponentStructure();

        if (structure == null || structure.isBlank()) {
            structure = "[]";
        }

        return new LessonComponentResponseDto(
                structure,
                lessonImageService.getImageKeysByLessonId(id),
                lessonVideoService.getVideoKeysByLessonId(id)
        );
    }

    private Lesson findEntity(Long id) {
        return lessonRepository.findById(id)
                .orElseThrow(() ->
                        new EntityNotFoundException(
                                "Lesson not found: " + id
                        )
                );
    }
}