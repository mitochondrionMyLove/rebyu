package com.capstone.rebyu.mappers;

import com.capstone.rebyu.dto.LearnerCertificationDto;
import com.capstone.rebyu.models.LearnerCertification;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface LearnerCertificationMapper {
    @Mapping(source = "id.learnerId", target = "learnerId")
    @Mapping(source = "id.certificationId", target = "certificationId")
    LearnerCertificationDto toDto(LearnerCertification entity);

    @Mapping(source = "learnerId", target = "id.learnerId")
    @Mapping(source = "certificationId", target = "id.certificationId")
    LearnerCertification toEntity(LearnerCertificationDto dto);
}
