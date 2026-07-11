package com.capstone.rebyu.certification.mapper;

import com.capstone.rebyu.certification.dto.CertificationDto;
import com.capstone.rebyu.certification.entity.Certification;
import com.capstone.rebyu.certification.entity.MajorCategory;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring", uses = MajorCategoryMapper.class)
public interface CertificationMapper {
    CertificationDto toDto(Certification entity);
    @Mapping(target = "status", ignore = true)
    Certification toEntity(CertificationDto dto);

    @AfterMapping
    default  void linkMajorCategory(@MappingTarget Certification certification){
        if(certification.getMajorCategory() != null){
            for(MajorCategory mc : certification.getMajorCategory()){
                mc.setCertification(certification);
            }
        }
    }
}
