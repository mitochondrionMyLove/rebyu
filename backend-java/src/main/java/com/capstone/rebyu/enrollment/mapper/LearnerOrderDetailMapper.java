package com.capstone.rebyu.enrollment.mapper;

import com.capstone.rebyu.enrollment.dto.LearnerOrderDetailDto;
import com.capstone.rebyu.enrollment.entity.LearnerOrderDetail;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface LearnerOrderDetailMapper {
    @Mapping(source = "order.orderId", target = "orderId")
    @Mapping(source = "certification.certificationId", target = "certificationId")
    LearnerOrderDetailDto toDto(LearnerOrderDetail entity);

    @Mapping(source = "orderId", target = "order.orderId")
    @Mapping(source = "certificationId", target = "certification.certificationId")
    LearnerOrderDetail toEntity(LearnerOrderDetailDto dto);
}
