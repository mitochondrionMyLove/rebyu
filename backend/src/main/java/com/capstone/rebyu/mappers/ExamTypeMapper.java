package com.capstone.rebyu.mappers;

import com.capstone.rebyu.dto.ExamTypeDto;
import com.capstone.rebyu.models.ExamType;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ExamTypeMapper {
    ExamTypeDto toDto(ExamType entity);

    ExamType toEntity(ExamTypeDto dto);
}
