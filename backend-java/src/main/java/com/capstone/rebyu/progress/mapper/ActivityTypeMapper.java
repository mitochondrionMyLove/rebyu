package com.capstone.rebyu.progress.mapper;

import com.capstone.rebyu.progress.dto.ActivityTypeDto;
import com.capstone.rebyu.progress.entity.ActivityType;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ActivityTypeMapper {
    @Mapping(source = "activityTypeName", target = "activityTypeText")
    ActivityTypeDto toDto(ActivityType entity);

    @Mapping(source = "activityTypeText", target = "activityTypeName")
    ActivityType toEntity(ActivityTypeDto dto);
}