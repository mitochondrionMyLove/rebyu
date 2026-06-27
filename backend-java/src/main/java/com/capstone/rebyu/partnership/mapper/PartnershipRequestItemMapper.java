package com.capstone.rebyu.partnership.mapper;



import com.capstone.rebyu.partnership.entity.PartnershipRequest;
import com.capstone.rebyu.certification.entity.Certification;
import com.capstone.rebyu.partnership.dto.PartnershipRequestItemDto;
import com.capstone.rebyu.partnership.entity.PartnershipRequestItem;
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
