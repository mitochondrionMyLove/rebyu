package com.capstone.rebyu.mappers;

import com.capstone.rebyu.dto.ChallengeModeDto;
import com.capstone.rebyu.models.ChallengeMode;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ChallengeModeMapper {
    ChallengeModeDto toDto(ChallengeMode entity);
    ChallengeMode toEntity(ChallengeModeDto dto);
}