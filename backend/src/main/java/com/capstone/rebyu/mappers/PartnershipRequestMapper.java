package com.capstone.rebyu.mappers;

import com.capstone.rebyu.dto.PartnershipRequestDto;
import com.capstone.rebyu.models.PartnershipRequest;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface PartnershipRequestMapper {
    @Mapping(source = "enterprise.enterpriseId", target = "enterpriseId")
    PartnershipRequestDto toDto(PartnershipRequest entity);

    @Mapping(source = "enterpriseId", target = "enterprise.enterpriseId")
    PartnershipRequest toEntity(PartnershipRequestDto dto);
}
