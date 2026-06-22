package com.capstone.rebyu.mappers;

import com.capstone.rebyu.dto.UserTypeDto;
import com.capstone.rebyu.models.UserType;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserTypeMapper {
    UserTypeDto toDto(UserType entity);

    UserType toEntity(UserTypeDto dto);
}
