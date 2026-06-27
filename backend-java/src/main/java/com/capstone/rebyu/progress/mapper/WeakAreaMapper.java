package com.capstone.rebyu.progress.mapper;

import com.capstone.rebyu.progress.dto.WeakAreaDto;
import com.capstone.rebyu.progress.entity.WeakArea;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface WeakAreaMapper {
    @Mapping(source = "id.learnerId", target = "learnerId")
    @Mapping(source = "id.lessonId", target = "lessonId")
    WeakAreaDto toDto(WeakArea entity);

    @Mapping(source = "learnerId", target = "id.learnerId")
    @Mapping(source = "lessonId", target = "id.lessonId")
    WeakArea toEntity(WeakAreaDto dto);
}