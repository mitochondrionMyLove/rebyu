package com.capstone.rebyu.progress.mapper;

import com.capstone.rebyu.progress.dto.LearnerAchievementDto;
import com.capstone.rebyu.progress.entity.LearnerAchievement;
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
