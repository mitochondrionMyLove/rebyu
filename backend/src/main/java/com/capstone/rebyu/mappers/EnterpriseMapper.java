package com.capstone.rebyu.mappers;

import com.capstone.rebyu.dto.EnterpriseDto;
import com.capstone.rebyu.models.Enterprise;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface EnterpriseMapper {
    EnterpriseDto toDto(Enterprise entity);

    Enterprise toEntity(EnterpriseDto dto);
}
