package com.capstone.rebyu.assessment.mapper;

import com.capstone.rebyu.assessment.dto.QuestionTypeDto;
import com.capstone.rebyu.assessment.entity.QuestionType;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface QuestionTypeMapper {
    QuestionTypeDto toDto(QuestionType entity);

    QuestionType toEntity(QuestionTypeDto dto);
}
