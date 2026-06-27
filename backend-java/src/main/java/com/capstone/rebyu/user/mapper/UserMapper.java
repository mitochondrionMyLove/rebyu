package com.capstone.rebyu.user.mapper;

import com.capstone.rebyu.user.dto.UserDto;
import com.capstone.rebyu.user.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {
    @Mapping(source = "userType.userTypeId", target = "userTypeId")
    UserDto toDto(User user);

    @Mapping(source = "userTypeId", target = "userType.userTypeId")
    User toEntity(UserDto dto);
}