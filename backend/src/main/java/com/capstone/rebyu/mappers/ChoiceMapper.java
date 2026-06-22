package com.capstone.rebyu.mappers;

import com.capstone.rebyu.dto.ChoiceDto;
import com.capstone.rebyu.models.Choice;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ChoiceMapper {
    @Mapping(source = "question.questionId", target = "questionId")
    ChoiceDto toDto(Choice entity);

    @Mapping(source = "questionId", target = "question.questionId")
    Choice toEntity(ChoiceDto dto);
}
