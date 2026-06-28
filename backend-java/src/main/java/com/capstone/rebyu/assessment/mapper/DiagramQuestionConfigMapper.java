package com.capstone.rebyu.assessment.mapper;

import com.capstone.rebyu.assessment.dto.DiagramQuestionConfigDto;
import com.capstone.rebyu.assessment.entity.DiagramQuestionConfig;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface DiagramQuestionConfigMapper {
    @Mapping(source = "question.questionId", target = "questionId")
    DiagramQuestionConfigDto toDto(DiagramQuestionConfig entity);

    @Mapping(source = "questionId", target = "question.questionId")
    DiagramQuestionConfig toEntity(DiagramQuestionConfigDto dto);
}
