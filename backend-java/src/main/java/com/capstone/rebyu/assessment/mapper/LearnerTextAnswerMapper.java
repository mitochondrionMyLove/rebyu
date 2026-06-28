package com.capstone.rebyu.assessment.mapper;

import com.capstone.rebyu.assessment.dto.LearnerTextAnswerDto;
import com.capstone.rebyu.assessment.entity.LearnerTextAnswer;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface LearnerTextAnswerMapper {
    @Mapping(source = "learnerExamDetail.learnerExamDetailId", target = "learnerExamDetailId")
    LearnerTextAnswerDto toDto(LearnerTextAnswer entity);

    @Mapping(source = "learnerExamDetailId", target = "learnerExamDetail.learnerExamDetailId")
    LearnerTextAnswer toEntity(LearnerTextAnswerDto dto);
}
