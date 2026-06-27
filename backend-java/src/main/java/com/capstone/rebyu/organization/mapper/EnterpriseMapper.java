package com.capstone.rebyu.organization.mapper;

import com.capstone.rebyu.organization.dto.EnterpriseDto;
import com.capstone.rebyu.organization.entity.Enterprise;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface EnterpriseMapper {
    EnterpriseDto toDto(Enterprise entity);

    Enterprise toEntity(EnterpriseDto dto);
}
