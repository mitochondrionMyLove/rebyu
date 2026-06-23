package com.capstone.rebyu.mappers;

import com.capstone.rebyu.dto.CertificationDto;
import com.capstone.rebyu.models.Certification;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = MajorCategoryMapper.class)
public interface CertificationMapper {
    CertificationDto toDto(Certification entity);
    Certification toEntity(CertificationDto dto);
}
