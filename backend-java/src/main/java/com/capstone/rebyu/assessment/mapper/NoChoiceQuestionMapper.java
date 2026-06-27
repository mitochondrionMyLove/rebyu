package com.capstone.rebyu.assessment.mapper;

import com.capstone.rebyu.assessment.dto.NoChoiceQuestionDto;
import com.capstone.rebyu.assessment.entity.NoChoiceQuestion;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface NoChoiceQuestionMapper {
    NoChoiceQuestionDto toDto(NoChoiceQuestion entity);

    NoChoiceQuestion toEntity(NoChoiceQuestionDto dto);
}
