package com.capstone.rebyu.user.mapper;

import com.capstone.rebyu.user.dto.UserTypeDto;
import com.capstone.rebyu.user.entity.UserType;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserTypeMapper {
    UserTypeDto toDto(UserType entity);

    UserType toEntity(UserTypeDto dto);
}
