package com.capstone.rebyu.assessment.mapper;

import com.capstone.rebyu.assessment.dto.SubQuestionDto;
import com.capstone.rebyu.assessment.entity.SubQuestion;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface SubQuestionMapper {
    @Mapping(source = "noChoiceQuestion.noChoiceQuestionId", target = "noChoiceQuestionId")
    SubQuestionDto toDto(SubQuestion entity);

    @Mapping(source = "noChoiceQuestionId", target = "noChoiceQuestion.noChoiceQuestionId")
    SubQuestion toEntity(SubQuestionDto dto);
}
