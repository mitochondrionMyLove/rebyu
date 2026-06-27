package com.capstone.rebyu.progress.mapper;

import com.capstone.rebyu.progress.dto.LearnerLessonMasteryDto;
import com.capstone.rebyu.progress.entity.LearnerLessonMastery;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface LearnerLessonMasteryMapper {
    @Mapping(source = "id.learnerId", target = "learnerId")
    @Mapping(source = "id.lessonId", target = "lessonId")
    LearnerLessonMasteryDto toDto(LearnerLessonMastery entity);

    @Mapping(source = "learnerId", target = "id.learnerId")
    @Mapping(source = "lessonId", target = "id.lessonId")
    LearnerLessonMastery toEntity(LearnerLessonMasteryDto dto);
}
