package com.capstone.rebyu.assessment.mapper;

import com.capstone.rebyu.assessment.dto.TextQuestionConfigDto;
import com.capstone.rebyu.assessment.entity.TextQuestionConfig;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface TextQuestionConfigMapper {
    @Mapping(source = "question.questionId", target = "questionId")
    TextQuestionConfigDto toDto(TextQuestionConfig entity);

    @Mapping(source = "questionId", target = "question.questionId")
    TextQuestionConfig toEntity(TextQuestionConfigDto dto);
}
