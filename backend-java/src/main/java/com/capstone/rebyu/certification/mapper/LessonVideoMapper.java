package com.capstone.rebyu.certification.mapper;


import com.capstone.rebyu.certification.dto.LessonVideoDto;
import com.capstone.rebyu.certification.entity.LessonVideo;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface LessonVideoMapper {
    LessonVideoDto toDto(LessonVideo entity);

    LessonVideo toEntity(LessonVideoDto dto);
}
