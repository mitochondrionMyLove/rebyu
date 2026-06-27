package com.capstone.rebyu.organization.mapper;



import com.capstone.rebyu.organization.entity.Enterprise;
import com.capstone.rebyu.certification.entity.Certification;
import com.capstone.rebyu.organization.dto.OrganizationCertificateDto;
import com.capstone.rebyu.organization.entity.OrganizationCertificate;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface OrganizationCertificateMapper {
    @Mapping(source = "enterprise.enterpriseId", target = "enterpriseId")
    @Mapping(source = "certification.certificationId", target = "certificationId")
    OrganizationCertificateDto toDto(OrganizationCertificate entity);

    @Mapping(source = "enterpriseId", target = "enterprise.enterpriseId")
    @Mapping(source = "certificationId", target = "certification.certificationId")
    OrganizationCertificate toEntity(OrganizationCertificateDto dto);
}
