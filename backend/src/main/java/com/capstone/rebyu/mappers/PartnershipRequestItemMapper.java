package com.capstone.rebyu.mappers;

import com.capstone.rebyu.dto.PartnershipRequestItemDto;
import com.capstone.rebyu.models.PartnershipRequestItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface PartnershipRequestItemMapper {
    @Mapping(source = "partnershipRequest.requestId", target = "requestId")
    @Mapping(source = "certification.certificationId", target = "certificationId")
    PartnershipRequestItemDto toDto(PartnershipRequestItem entity);

    @Mapping(source = "requestId", target = "partnershipRequest.requestId")
    @Mapping(source = "certificationId", target = "certification.certificationId")
    PartnershipRequestItem toEntity(PartnershipRequestItemDto dto);
}
