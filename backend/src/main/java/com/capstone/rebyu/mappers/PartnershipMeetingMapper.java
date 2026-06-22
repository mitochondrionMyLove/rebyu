package com.capstone.rebyu.mappers;

import com.capstone.rebyu.dto.PartnershipMeetingDto;
import com.capstone.rebyu.models.PartnershipMeeting;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface PartnershipMeetingMapper {
    @Mapping(source = "enterprise.enterpriseId", target = "enterpriseId")
    @Mapping(source = "partnershipRequest.requestId", target = "requestId")
    PartnershipMeetingDto toDto(PartnershipMeeting entity);

    @Mapping(source = "enterpriseId", target = "enterprise.enterpriseId")
    @Mapping(source = "requestId", target = "partnershipRequest.requestId")
    PartnershipMeeting toEntity(PartnershipMeetingDto dto);
}
