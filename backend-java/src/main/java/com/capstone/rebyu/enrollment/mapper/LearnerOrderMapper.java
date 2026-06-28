package com.capstone.rebyu.enrollment.mapper;

import com.capstone.rebyu.enrollment.dto.LearnerOrderDto;
import com.capstone.rebyu.enrollment.entity.LearnerOrder;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface LearnerOrderMapper {
    @Mapping(source = "learner.learnerId", target = "learnerId")
    LearnerOrderDto toDto(LearnerOrder entity);

    @Mapping(source = "learnerId", target = "learner.learnerId")
    LearnerOrder toEntity(LearnerOrderDto dto);
}
