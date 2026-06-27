package com.capstone.rebyu.certification.service;

import com.capstone.rebyu.certification.dto.LessonVideoDto;
import com.capstone.rebyu.certification.entity.LessonVideo;
import com.capstone.rebyu.certification.mapper.LessonVideoMapper;
import com.capstone.rebyu.certification.repository.LessonVideoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional
public class LessonVideoService {

    private final LessonVideoRepository lessonVideoRepository;
    private final LessonVideoMapper lessonVideoMapper;

    public LessonVideoDto saveOrUpdateLessonVideo(
            Long lessonId,
            String sectionName,
            String toolId,
            String videoKey
    ) {
        Integer databaseLessonId = Math.toIntExact(lessonId);

        LessonVideo entity = lessonVideoRepository
                .findByLessonIdAndToolId(databaseLessonId, toolId)
                .orElseGet(LessonVideo::new);

        entity.setLessonId(databaseLessonId);
        entity.setSectionName(sectionName);
        entity.setToolId(toolId);
        entity.setVideoKey(videoKey);

        LessonVideo savedEntity = lessonVideoRepository.save(entity);

        return lessonVideoMapper.toDto(savedEntity);
    }

    @Transactional(readOnly = true)
    public Map<String, String> getVideoKeysByLessonId(Long lessonId) {
        Integer databaseLessonId = Math.toIntExact(lessonId);

        Map<String, String> videoKeys = new LinkedHashMap<>();

        for (LessonVideo video :
                lessonVideoRepository.findAllByLessonId(databaseLessonId)) {

            if (
                    video.getToolId() != null &&
                            !video.getToolId().isBlank() &&
                            video.getVideoKey() != null &&
                            !video.getVideoKey().isBlank()
            ) {
                videoKeys.put(
                        video.getToolId(),
                        video.getVideoKey()
                );
            }
        }

        return videoKeys;
    }

    public void deleteLessonVideo(
            Long lessonId,
            String toolId
    ) {
        Integer databaseLessonId = Math.toIntExact(lessonId);

        lessonVideoRepository
                .findByLessonIdAndToolId(databaseLessonId, toolId)
                .ifPresent(lessonVideoRepository::delete);
    }
}