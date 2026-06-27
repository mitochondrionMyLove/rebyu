package com.capstone.rebyu.assessment.mapper;

import com.capstone.rebyu.assessment.dto.DifficultyLevelDto;
import com.capstone.rebyu.assessment.entity.DifficultyLevel;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface DifficultyLevelMapper {
    DifficultyLevelDto toDto(DifficultyLevel entity);

    DifficultyLevel toEntity(DifficultyLevelDto dto);
}
