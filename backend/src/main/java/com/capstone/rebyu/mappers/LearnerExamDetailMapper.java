package com.capstone.rebyu.mappers;

import com.capstone.rebyu.dto.LearnerExamDetailDto;
import com.capstone.rebyu.models.LearnerExamDetail;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface LearnerExamDetailMapper {
    @Mapping(source = "id.learnerId", target = "learnerId")
    @Mapping(source = "id.examId", target = "examId")
    @Mapping(source = "id.attemptNo", target = "attemptNo")
    @Mapping(source = "id.questionId", target = "questionId")
    @Mapping(source = "lesson.lessonId", target = "lessonId")
    LearnerExamDetailDto toDto(LearnerExamDetail entity);

    @Mapping(source = "learnerId", target = "id.learnerId")
    @Mapping(source = "examId", target = "id.examId")
    @Mapping(source = "attemptNo", target = "id.attemptNo")
    @Mapping(source = "questionId", target = "id.questionId")
    @Mapping(source = "lessonId", target = "lesson.lessonId")
    LearnerExamDetail toEntity(LearnerExamDetailDto dto);
}
