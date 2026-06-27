package com.capstone.rebyu.assessment.mapper;

import com.capstone.rebyu.assessment.dto.ExamTypeDto;
import com.capstone.rebyu.assessment.entity.ExamType;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ExamTypeMapper {
    ExamTypeDto toDto(ExamType entity);

    ExamType toEntity(ExamTypeDto dto);
}
