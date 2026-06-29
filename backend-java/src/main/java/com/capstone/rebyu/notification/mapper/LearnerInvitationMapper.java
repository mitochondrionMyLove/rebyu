package com.capstone.rebyu.notification.mapper;

import com.capstone.rebyu.notification.dto.LearnerInvitationDto;
import com.capstone.rebyu.notification.entity.LearnerInvitation;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface LearnerInvitationMapper {
    @Mapping(source = "orgCert.orgCertId", target = "orgCertId")
    @Mapping(source = "learner.learnerId", target = "learnerId")
    LearnerInvitationDto toDto(LearnerInvitation entity);

    @Mapping(source = "orgCertId", target = "orgCert.orgCertId")
    @Mapping(source = "learnerId", target = "learner.learnerId")
    LearnerInvitation toEntity(LearnerInvitationDto dto);
}
