package com.capstone.rebyu.progress.mapper;


import com.capstone.rebyu.progress.entity.ActivityType;
import com.capstone.rebyu.progress.dto.ActivityLogDto;
import com.capstone.rebyu.progress.entity.ActivityLog;
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