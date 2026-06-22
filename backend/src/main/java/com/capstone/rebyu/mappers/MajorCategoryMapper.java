package com.capstone.rebyu.mappers;

import com.capstone.rebyu.dto.MajorCategoryDto;
import com.capstone.rebyu.models.MajorCategory;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface MajorCategoryMapper {
    @Mapping(source = "certification.certificationId", target = "certificationId")
    MajorCategoryDto toDto(MajorCategory entity);

    @Mapping(source = "certificationId", target = "certification.certificationId")
    MajorCategory toEntity(MajorCategoryDto dto);
}
