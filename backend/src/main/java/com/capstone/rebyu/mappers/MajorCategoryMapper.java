package com.capstone.rebyu.mappers;

import com.capstone.rebyu.dto.MajorCategoryDto;
import com.capstone.rebyu.models.MajorCategory;
import com.capstone.rebyu.models.MiddleCategory;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring", uses = MiddleCategoryMapper.class)
public interface MajorCategoryMapper {
    @Mapping(source = "certification.certificationId", target = "certificationId")
    MajorCategoryDto toDto(MajorCategory entity);

    @Mapping(source = "certificationId", target = "certification.certificationId")
    MajorCategory toEntity(MajorCategoryDto dto);

    @AfterMapping
    default void linkMiddleCategory(@MappingTarget MajorCategory majorCategory){
        if(majorCategory.getMiddleCategory() != null){
            for(MiddleCategory middleCategory : majorCategory.getMiddleCategory()){
                middleCategory.setMajorCategory(majorCategory);
            }
        }
    }
}
