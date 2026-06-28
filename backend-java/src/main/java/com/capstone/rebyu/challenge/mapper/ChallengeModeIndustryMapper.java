package com.capstone.rebyu.challenge.mapper;

import com.capstone.rebyu.challenge.dto.ChallengeModeIndustryDto;
import com.capstone.rebyu.challenge.entity.ChallengeModeIndustry;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ChallengeModeIndustryMapper {
    @Mapping(source = "challengeMode.challengeModeId", target = "challengeModeId")
    ChallengeModeIndustryDto toDto(ChallengeModeIndustry entity);

    @Mapping(source = "challengeModeId", target = "challengeMode.challengeModeId")
    ChallengeModeIndustry toEntity(ChallengeModeIndustryDto dto);
}
