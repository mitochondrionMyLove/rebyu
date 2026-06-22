package com.capstone.rebyu.mappers;

import com.capstone.rebyu.dto.DifficultyLevelDto;
import com.capstone.rebyu.models.DifficultyLevel;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface DifficultyLevelMapper {
    DifficultyLevelDto toDto(DifficultyLevel entity);

    DifficultyLevel toEntity(DifficultyLevelDto dto);
}
