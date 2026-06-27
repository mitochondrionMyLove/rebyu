package com.capstone.rebyu.challenge.mapper;

import com.capstone.rebyu.challenge.dto.ChallengeModeDto;
import com.capstone.rebyu.challenge.entity.ChallengeMode;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ChallengeModeMapper {
    ChallengeModeDto toDto(ChallengeMode entity);
    ChallengeMode toEntity(ChallengeModeDto dto);
}