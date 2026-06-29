package com.capstone.rebyu.partnership.mapper;

import com.capstone.rebyu.partnership.dto.EnterpriseInvoiceItemDto;
import com.capstone.rebyu.partnership.entity.EnterpriseInvoiceItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface EnterpriseInvoiceItemMapper {
    @Mapping(source = "enterpriseInvoice.enterpriseInvoiceId", target = "enterpriseInvoiceId")
    @Mapping(source = "certification.certificationId", target = "certificationId")
    EnterpriseInvoiceItemDto toDto(EnterpriseInvoiceItem entity);

    @Mapping(source = "enterpriseInvoiceId", target = "enterpriseInvoice.enterpriseInvoiceId")
    @Mapping(source = "certificationId", target = "certification.certificationId")
    EnterpriseInvoiceItem toEntity(EnterpriseInvoiceItemDto dto);
}
