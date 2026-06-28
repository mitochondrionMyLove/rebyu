package com.capstone.rebyu.assessment.mapper;

import com.capstone.rebyu.assessment.dto.LearnerDiagramAnswerDto;
import com.capstone.rebyu.assessment.entity.LearnerDiagramAnswer;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface LearnerDiagramAnswerMapper {
    @Mapping(source = "learnerExamDetail.learnerExamDetailId", target = "learnerExamDetailId")
    LearnerDiagramAnswerDto toDto(LearnerDiagramAnswer entity);

    @Mapping(source = "learnerExamDetailId", target = "learnerExamDetail.learnerExamDetailId")
    LearnerDiagramAnswer toEntity(LearnerDiagramAnswerDto dto);
}
