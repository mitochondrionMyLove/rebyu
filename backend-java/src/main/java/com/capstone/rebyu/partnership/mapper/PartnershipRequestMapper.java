package com.capstone.rebyu.partnership.mapper;


import com.capstone.rebyu.organization.entity.Enterprise;
import com.capstone.rebyu.partnership.dto.PartnershipRequestDto;
import com.capstone.rebyu.partnership.entity.PartnershipRequest;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface PartnershipRequestMapper {
    @Mapping(source = "enterprise.enterpriseId", target = "enterpriseId")
    PartnershipRequestDto toDto(PartnershipRequest entity);

    @Mapping(source = "enterpriseId", target = "enterprise.enterpriseId")
    PartnershipRequest toEntity(PartnershipRequestDto dto);
}
