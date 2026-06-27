package com.capstone.rebyu.partnership.mapper;


import com.capstone.rebyu.partnership.entity.PartnershipRequest;
import com.capstone.rebyu.organization.entity.Enterprise;
import com.capstone.rebyu.partnership.dto.PartnershipMeetingDto;
import com.capstone.rebyu.partnership.entity.PartnershipMeeting;
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
