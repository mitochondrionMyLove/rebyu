package com.capstone.rebyu.mappers;

import com.capstone.rebyu.dto.LessonDto;
import com.capstone.rebyu.models.Lesson;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface LessonMapper {
    @Mapping(source = "middleCategory.middleCategoryId", target = "middleCategoryId")
    LessonDto toDto(Lesson entity);

    @Mapping(source = "middleCategoryId", target = "middleCategory.middleCategoryId")
    Lesson toEntity(LessonDto dto);
}
