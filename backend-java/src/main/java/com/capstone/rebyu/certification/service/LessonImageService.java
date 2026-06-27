package com.capstone.rebyu.certification.service;

import com.capstone.rebyu.certification.dto.LessonImageDto;
import com.capstone.rebyu.certification.entity.LessonImage;
import com.capstone.rebyu.certification.mapper.LessonImageMapper;
import com.capstone.rebyu.certification.repository.LessonImageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional
public class LessonImageService {

    private final LessonImageRepository lessonImageRepository;
    private final LessonImageMapper lessonImageMapper;

    public LessonImageDto saveOrUpdateLessonImage(
            Long lessonId,
            String sectionName,
            String toolId,
            String imageKey
    ) {
        Integer databaseLessonId = Math.toIntExact(lessonId);

        LessonImage entity = lessonImageRepository
                .findByLessonIdAndToolId(databaseLessonId, toolId)
                .orElseGet(LessonImage::new);

        entity.setLessonId(databaseLessonId);
        entity.setSectionName(sectionName);
        entity.setToolId(toolId);
        entity.setImageKey(imageKey);

        LessonImage savedEntity = lessonImageRepository.save(entity);

        return lessonImageMapper.toDto(savedEntity);
    }

    @Transactional(readOnly = true)
    public Map<String, String> getImageKeysByLessonId(Long lessonId) {
        Integer databaseLessonId = Math.toIntExact(lessonId);

        Map<String, String> imageKeys = new LinkedHashMap<>();

        for (LessonImage image :
                lessonImageRepository.findAllByLessonId(databaseLessonId)) {

            if (
                    image.getToolId() != null &&
                            !image.getToolId().isBlank() &&
                            image.getImageKey() != null &&
                            !image.getImageKey().isBlank()
            ) {
                imageKeys.put(
                        image.getToolId(),
                        image.getImageKey()
                );
            }
        }

        return imageKeys;
    }

    public void deleteLessonImage(
            Long lessonId,
            String toolId
    ) {
        Integer databaseLessonId = Math.toIntExact(lessonId);

        lessonImageRepository
                .findByLessonIdAndToolId(databaseLessonId, toolId)
                .ifPresent(lessonImageRepository::delete);
    }
}