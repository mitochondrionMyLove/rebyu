package com.capstone.rebyu.partnership.mapper;

import com.capstone.rebyu.partnership.dto.EnterpriseCertificationRenewalRequestDto;
import com.capstone.rebyu.partnership.entity.EnterpriseCertificationRenewalRequest;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface EnterpriseCertificationRenewalRequestMapper {
    @Mapping(source = "orgCert.orgCertId", target = "orgCertId")
    EnterpriseCertificationRenewalRequestDto toDto(EnterpriseCertificationRenewalRequest entity);

    @Mapping(source = "orgCertId", target = "orgCert.orgCertId")
    EnterpriseCertificationRenewalRequest toEntity(EnterpriseCertificationRenewalRequestDto dto);
}
