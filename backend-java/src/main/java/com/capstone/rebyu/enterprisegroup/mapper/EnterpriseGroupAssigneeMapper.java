package com.capstone.rebyu.enterprisegroup.mapper;

import com.capstone.rebyu.enterprisegroup.dto.EnterpriseGroupAssigneeDto;
import com.capstone.rebyu.enterprisegroup.entity.EnterpriseGroupAssignee;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface EnterpriseGroupAssigneeMapper {
    @Mapping(source = "enterpriseGroup.enterpriseGroupId", target = "enterpriseGroupId")
    @Mapping(source = "orgCertLearner.orgCertLearnerId", target = "orgCertLearnerId")
    @Mapping(source = "orgCertLearner.orgCert.orgCertId", target = "orgCertId")
    @Mapping(source = "orgCertLearner.learner.learnerId", target = "learnerId")
    @Mapping(source = "assignedBy.userId", target = "assignedBy")
    EnterpriseGroupAssigneeDto toDto(EnterpriseGroupAssignee entity);

    @Mapping(source = "enterpriseGroupId", target = "enterpriseGroup.enterpriseGroupId")
    @Mapping(source = "orgCertLearnerId", target = "orgCertLearner.orgCertLearnerId")
    @Mapping(source = "assignedBy", target = "assignedBy.userId")
    EnterpriseGroupAssignee toEntity(EnterpriseGroupAssigneeDto dto);
}
