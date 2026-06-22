package com.capstone.rebyu.mappers;

import com.capstone.rebyu.dto.MiddleCategoryDto;
import com.capstone.rebyu.models.MiddleCategory;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface MiddleCategoryMapper {
    @Mapping(source = "majorCategory.majorCategoryId", target = "majorCategoryId")
    MiddleCategoryDto toDto(MiddleCategory entity);

    @Mapping(source = "majorCategoryId", target = "majorCategory.majorCategoryId")
    MiddleCategory toEntity(MiddleCategoryDto dto);
}
