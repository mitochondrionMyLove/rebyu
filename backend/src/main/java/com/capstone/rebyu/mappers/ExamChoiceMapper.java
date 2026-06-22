package com.capstone.rebyu.mappers;

import com.capstone.rebyu.dto.ExamChoiceDto;
import com.capstone.rebyu.models.ExamChoice;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ExamChoiceMapper {
    @Mapping(source = "id.examQuestionId", target = "examQuestionId")
    @Mapping(source = "id.choiceId", target = "choiceId")
    ExamChoiceDto toDto(ExamChoice entity);

    @Mapping(source = "examQuestionId", target = "id.examQuestionId")
    @Mapping(source = "choiceId", target = "id.choiceId")
    ExamChoice toEntity(ExamChoiceDto dto);
}
