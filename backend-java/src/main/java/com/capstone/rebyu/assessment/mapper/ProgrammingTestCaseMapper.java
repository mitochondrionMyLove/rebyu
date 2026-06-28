package com.capstone.rebyu.assessment.mapper;

import com.capstone.rebyu.assessment.dto.ProgrammingTestCaseDto;
import com.capstone.rebyu.assessment.entity.ProgrammingTestCase;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ProgrammingTestCaseMapper {
    @Mapping(source = "programmingQuestionConfig.programmingQuestionConfigId", target = "programmingQuestionConfigId")
    ProgrammingTestCaseDto toDto(ProgrammingTestCase entity);

    @Mapping(source = "programmingQuestionConfigId", target = "programmingQuestionConfig.programmingQuestionConfigId")
    ProgrammingTestCase toEntity(ProgrammingTestCaseDto dto);
}
