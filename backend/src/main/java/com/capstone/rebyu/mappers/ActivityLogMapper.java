package com.capstone.rebyu.mappers;

import com.capstone.rebyu.dto.ActivityLogDto;
import com.capstone.rebyu.models.ActivityLog;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ActivityLogMapper {
    @Mapping(source = "user.userId", target = "userId")
    @Mapping(source = "activityType.activityTypeId", target = "activityTypeId")
    ActivityLogDto toDto(ActivityLog entity);

    @Mapping(source = "userId", target = "user.userId")
    @Mapping(source = "activityTypeId", target = "activityType.activityTypeId")
    ActivityLog toEntity(ActivityLogDto dto);
}