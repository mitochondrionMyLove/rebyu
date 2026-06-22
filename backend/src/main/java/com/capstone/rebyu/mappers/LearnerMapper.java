package com.capstone.rebyu.mappers;

import com.capstone.rebyu.dto.LearnerDto;
import com.capstone.rebyu.models.Learner;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface LearnerMapper {
    @Mapping(source = "user.userId", target = "userId")
    LearnerDto toDto(Learner learner);

    @Mapping(source = "userId", target = "user.userId")
    Learner toEntity(LearnerDto dto);
}