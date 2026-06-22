package com.capstone.rebyu.mappers;

import com.capstone.rebyu.dto.UserDto;
import com.capstone.rebyu.models.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {
    @Mapping(source = "userType.userTypeId", target = "userTypeId")
    UserDto toDto(User user);

    @Mapping(source = "userTypeId", target = "userType.userTypeId")
    User toEntity(UserDto dto);
}