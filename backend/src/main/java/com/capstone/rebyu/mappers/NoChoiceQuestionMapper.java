package com.capstone.rebyu.mappers;

import com.capstone.rebyu.dto.NoChoiceQuestionDto;
import com.capstone.rebyu.models.NoChoiceQuestion;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface NoChoiceQuestionMapper {
    NoChoiceQuestionDto toDto(NoChoiceQuestion entity);

    NoChoiceQuestion toEntity(NoChoiceQuestionDto dto);
}
