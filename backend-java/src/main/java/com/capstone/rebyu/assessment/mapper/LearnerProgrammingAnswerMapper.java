package com.capstone.rebyu.assessment.mapper;

import com.capstone.rebyu.assessment.dto.LearnerProgrammingAnswerDto;
import com.capstone.rebyu.assessment.entity.LearnerProgrammingAnswer;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface LearnerProgrammingAnswerMapper {
    @Mapping(source = "learnerExamDetail.learnerExamDetailId", target = "learnerExamDetailId")
    LearnerProgrammingAnswerDto toDto(LearnerProgrammingAnswer entity);

    @Mapping(source = "learnerExamDetailId", target = "learnerExamDetail.learnerExamDetailId")
    LearnerProgrammingAnswer toEntity(LearnerProgrammingAnswerDto dto);
}
