package com.capstone.rebyu.mappers;

import com.capstone.rebyu.dto.ActivityTypeDto;
import com.capstone.rebyu.models.ActivityType;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ActivityTypeMapper {
    @Mapping(source = "activityTypeName", target = "activityTypeText")
    ActivityTypeDto toDto(ActivityType entity);

    @Mapping(source = "activityTypeText", target = "activityTypeName")
    ActivityType toEntity(ActivityTypeDto dto);
}