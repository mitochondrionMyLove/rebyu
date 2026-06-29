package com.capstone.rebyu.organization.mapper;

import com.capstone.rebyu.organization.dto.EnterpriseVerificationDocumentDto;
import com.capstone.rebyu.organization.entity.EnterpriseVerificationDocument;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface EnterpriseVerificationDocumentMapper {
    @Mapping(source = "enterprise.enterpriseId", target = "enterpriseId")
    EnterpriseVerificationDocumentDto toDto(EnterpriseVerificationDocument entity);

    @Mapping(source = "enterpriseId", target = "enterprise.enterpriseId")
    EnterpriseVerificationDocument toEntity(EnterpriseVerificationDocumentDto dto);
}
