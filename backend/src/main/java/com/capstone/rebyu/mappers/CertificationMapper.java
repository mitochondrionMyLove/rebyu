package com.capstone.rebyu.mappers;

import com.capstone.rebyu.dto.CertificationDto;
import com.capstone.rebyu.models.Certification;
import com.capstone.rebyu.models.MajorCategory;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring", uses = MajorCategoryMapper.class)
public interface CertificationMapper {
    CertificationDto toDto(Certification entity);
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
