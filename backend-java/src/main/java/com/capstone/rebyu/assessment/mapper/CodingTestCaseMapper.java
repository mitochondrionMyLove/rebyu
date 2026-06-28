package com.capstone.rebyu.assessment.mapper;

import com.capstone.rebyu.assessment.dto.CodingTestCaseDto;
import com.capstone.rebyu.assessment.entity.CodingTestCase;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CodingTestCaseMapper {
    @Mapping(source = "noChoiceQuestion.noChoiceQuestionId", target = "noChoiceQuestionId")
    CodingTestCaseDto toDto(CodingTestCase entity);

    @Mapping(source = "noChoiceQuestionId", target = "noChoiceQuestion.noChoiceQuestionId")
    CodingTestCase toEntity(CodingTestCaseDto dto);
}
