package com.capstone.rebyu.assessment.mapper;


import com.capstone.rebyu.assessment.entity.Question;
import com.capstone.rebyu.assessment.dto.ChoiceDto;
import com.capstone.rebyu.assessment.entity.Choice;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ChoiceMapper {
    @Mapping(source = "question.questionId", target = "questionId")
    ChoiceDto toDto(Choice entity);

    @Mapping(source = "questionId", target = "question.questionId")
    Choice toEntity(ChoiceDto dto);
}
