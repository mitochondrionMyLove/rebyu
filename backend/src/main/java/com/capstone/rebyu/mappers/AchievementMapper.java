package com.capstone.rebyu.mappers;

import com.capstone.rebyu.dto.AchievementDto;
import com.capstone.rebyu.models.Achievement;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface AchievementMapper {
    AchievementDto toDto(Achievement entity);
    Achievement toEntity(AchievementDto dto);
}
