package com.capstone.rebyu.progress.mapper;

import com.capstone.rebyu.progress.dto.AchievementDto;
import com.capstone.rebyu.progress.entity.Achievement;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface AchievementMapper {
    AchievementDto toDto(Achievement entity);
    Achievement toEntity(AchievementDto dto);
}
