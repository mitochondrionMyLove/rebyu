package com.capstone.rebyu.enrollment.mapper;

import com.capstone.rebyu.enrollment.dto.LearnerCertificationDto;
import com.capstone.rebyu.enrollment.entity.LearnerCertification;
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
