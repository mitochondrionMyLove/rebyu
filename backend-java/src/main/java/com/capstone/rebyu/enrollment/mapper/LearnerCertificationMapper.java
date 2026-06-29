package com.capstone.rebyu.enrollment.mapper;

import com.capstone.rebyu.enrollment.dto.LearnerCertificationDto;
import com.capstone.rebyu.enrollment.entity.LearnerCertification;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface LearnerCertificationMapper {
    @Mapping(source = "learner.learnerId", target = "learnerId")
    @Mapping(source = "certification.certificationId", target = "certificationId")
    @Mapping(source = "orderDetail.orderDetailId", target = "orderDetailId")
    LearnerCertificationDto toDto(LearnerCertification entity);

    @Mapping(source = "learnerId", target = "learner.learnerId")
    @Mapping(source = "certificationId", target = "certification.certificationId")
    @Mapping(source = "orderDetailId", target = "orderDetail.orderDetailId")
    LearnerCertification toEntity(LearnerCertificationDto dto);
}
