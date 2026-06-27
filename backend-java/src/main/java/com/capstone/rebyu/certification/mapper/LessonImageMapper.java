package com.capstone.rebyu.certification.mapper;


import com.capstone.rebyu.certification.dto.LessonImageDto;
import com.capstone.rebyu.certification.entity.LessonImage;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface LessonImageMapper {
    LessonImageDto toDto(LessonImage entity);

    LessonImage toEntity(LessonImageDto dto);
}
