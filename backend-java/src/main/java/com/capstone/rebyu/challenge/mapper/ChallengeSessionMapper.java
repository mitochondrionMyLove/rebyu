package com.capstone.rebyu.challenge.mapper;


import com.capstone.rebyu.challenge.entity.ChallengeMode;
import com.capstone.rebyu.challenge.dto.ChallengeSessionDto;
import com.capstone.rebyu.challenge.entity.ChallengeSession;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ChallengeSessionMapper {
    @Mapping(source = "challengeMode.challengeModeId", target = "challengeModeId")
    @Mapping(source = "learner.learnerId", target = "learnerId")
    @Mapping(source = "startedAt", target = "startedTime")
    @Mapping(source = "endedAt", target = "endedTime")
    ChallengeSessionDto toDto(ChallengeSession entity);

    @Mapping(source = "challengeModeId", target = "challengeMode.challengeModeId")
    @Mapping(source = "learnerId", target = "learner.learnerId")
    @Mapping(source = "startedTime", target = "startedAt")
    @Mapping(source = "endedTime", target = "endedAt")
    ChallengeSession toEntity(ChallengeSessionDto dto);
}
