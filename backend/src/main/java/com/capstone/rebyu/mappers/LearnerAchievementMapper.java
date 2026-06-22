package com.capstone.rebyu.mappers;

import com.capstone.rebyu.dto.LearnerAchievementDto;
import com.capstone.rebyu.models.LearnerAchievement;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface LearnerAchievementMapper {
    @Mapping(source = "id.learnerId", target = "learnerId")
    @Mapping(source = "id.achievementId", target = "achievementId")
    LearnerAchievementDto toDto(LearnerAchievement entity);

    @Mapping(source = "learnerId", target = "id.learnerId")
    @Mapping(source = "achievementId", target = "id.achievementId")
    LearnerAchievement toEntity(LearnerAchievementDto dto);
}
