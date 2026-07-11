package com.capstone.rebyu.enterprisegroup.mapper;

import com.capstone.rebyu.enterprisegroup.dto.EnterpriseGroupAuthorityDto;
import com.capstone.rebyu.enterprisegroup.entity.EnterpriseGroupAuthority;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface EnterpriseGroupAuthorityMapper {
    @Mapping(source = "enterpriseGroup.enterpriseGroupId", target = "enterpriseGroupId")
    @Mapping(source = "user.userId", target = "userId")
    @Mapping(source = "assignedBy.userId", target = "assignedBy")
    EnterpriseGroupAuthorityDto toDto(EnterpriseGroupAuthority entity);

    @Mapping(source = "enterpriseGroupId", target = "enterpriseGroup.enterpriseGroupId")
    @Mapping(source = "userId", target = "user.userId")
    @Mapping(source = "assignedBy", target = "assignedBy.userId")
    EnterpriseGroupAuthority toEntity(EnterpriseGroupAuthorityDto dto);
}
