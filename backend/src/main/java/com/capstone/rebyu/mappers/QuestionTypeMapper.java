package com.capstone.rebyu.mappers;

import com.capstone.rebyu.dto.QuestionTypeDto;
import com.capstone.rebyu.models.QuestionType;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface QuestionTypeMapper {
    QuestionTypeDto toDto(QuestionType entity);

    QuestionType toEntity(QuestionTypeDto dto);
}
