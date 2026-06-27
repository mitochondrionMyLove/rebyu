package com.capstone.rebyu.progress.mapper;

import com.capstone.rebyu.progress.dto.LearnerCompletedLessonDto;
import com.capstone.rebyu.progress.entity.LearnerCompletedLesson;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface LearnerCompletedLessonMapper {
    @Mapping(source = "id.learnerId", target = "learnerId")
    @Mapping(source = "id.lessonId", target = "lessonId")
    LearnerCompletedLessonDto toDto(LearnerCompletedLesson entity);

    @Mapping(source = "learnerId", target = "id.learnerId")
    @Mapping(source = "lessonId", target = "id.lessonId")
    LearnerCompletedLesson toEntity(LearnerCompletedLessonDto dto);
}
