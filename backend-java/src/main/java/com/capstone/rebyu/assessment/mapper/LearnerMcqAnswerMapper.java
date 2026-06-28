package com.capstone.rebyu.assessment.mapper;

import com.capstone.rebyu.assessment.dto.LearnerMcqAnswerDto;
import com.capstone.rebyu.assessment.entity.LearnerMcqAnswer;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface LearnerMcqAnswerMapper {
    @Mapping(source = "learnerExamDetail.learnerExamDetailId", target = "learnerExamDetailId")
    @Mapping(source = "choice.choiceId", target = "choiceId")
    LearnerMcqAnswerDto toDto(LearnerMcqAnswer entity);

    @Mapping(source = "learnerExamDetailId", target = "learnerExamDetail.learnerExamDetailId")
    @Mapping(source = "choiceId", target = "choice.choiceId")
    LearnerMcqAnswer toEntity(LearnerMcqAnswerDto dto);
}
