package com.capstone.rebyu.enrollment.mapper;


import com.capstone.rebyu.certification.entity.Certification;
import com.capstone.rebyu.enrollment.dto.OrganizationCertificationLearnerDto;
import com.capstone.rebyu.enrollment.entity.OrganizationCertificationLearner;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface OrganizationCertificationLearnerMapper {
    @Mapping(source = "organization.enterpriseId", target = "organizationId")
    @Mapping(source = "certification.certificationId", target = "certificationId")
    @Mapping(source = "learner.learnerId", target = "learnerId")
    OrganizationCertificationLearnerDto toDto(OrganizationCertificationLearner entity);

    @Mapping(source = "organizationId", target = "organization.enterpriseId")
    @Mapping(source = "certificationId", target = "certification.certificationId")
    @Mapping(source = "learnerId", target = "learner.learnerId")
    OrganizationCertificationLearner toEntity(OrganizationCertificationLearnerDto dto);
}
