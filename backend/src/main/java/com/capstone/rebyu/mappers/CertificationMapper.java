package com.capstone.rebyu.mappers;

import com.capstone.rebyu.dto.CertificationDto;
import com.capstone.rebyu.models.Certification;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CertificationMapper {
    CertificationDto toDto(Certification entity);

    Certification toEntity(CertificationDto dto);
}
