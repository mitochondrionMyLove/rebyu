package com.capstone.rebyu.partnership.mapper;

import com.capstone.rebyu.partnership.dto.EnterpriseInvoiceDto;
import com.capstone.rebyu.partnership.entity.EnterpriseInvoice;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface EnterpriseInvoiceMapper {
    @Mapping(source = "enterprise.enterpriseId", target = "enterpriseId")
    @Mapping(source = "partnershipRequest.requestId", target = "partnershipRequestId")
    @Mapping(source = "renewalRequest.renewalRequestId", target = "renewalRequestId")
    @Mapping(source = "verifiedByUser.userId", target = "verifiedByUserId")
    EnterpriseInvoiceDto toDto(EnterpriseInvoice entity);

    @Mapping(source = "enterpriseId", target = "enterprise.enterpriseId")
    @Mapping(source = "partnershipRequestId", target = "partnershipRequest.requestId")
    @Mapping(source = "renewalRequestId", target = "renewalRequest.renewalRequestId")
    @Mapping(source = "verifiedByUserId", target = "verifiedByUser.userId")
    EnterpriseInvoice toEntity(EnterpriseInvoiceDto dto);
}
