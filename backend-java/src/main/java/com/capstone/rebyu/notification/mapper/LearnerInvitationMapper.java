package com.capstone.rebyu.notification.mapper;



import com.capstone.rebyu.organization.entity.Enterprise;
import com.capstone.rebyu.certification.entity.Certification;
import com.capstone.rebyu.notification.dto.LearnerInvitationDto;
import com.capstone.rebyu.notification.entity.LearnerInvitation;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface LearnerInvitationMapper {
    @Mapping(source = "enterprise.enterpriseId", target = "enterpriseId")
    @Mapping(source = "certification.certificationId", target = "certificationId")
    @Mapping(source = "learner.learnerId", target = "learnerId")
    LearnerInvitationDto toDto(LearnerInvitation entity);

    @Mapping(source = "enterpriseId", target = "enterprise.enterpriseId")
    @Mapping(source = "certificationId", target = "certification.certificationId")
    @Mapping(source = "learnerId", target = "learner.learnerId")
    LearnerInvitation toEntity(LearnerInvitationDto dto);
}
