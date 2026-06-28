package com.capstone.rebyu.assessment.mapper;

import com.capstone.rebyu.assessment.dto.LearnerExamDetailDto;
import com.capstone.rebyu.assessment.entity.LearnerExamDetail;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface LearnerExamDetailMapper {
    @Mapping(source = "learner.learnerId", target = "learnerId")
    @Mapping(source = "exam.examId", target = "examId")
    @Mapping(source = "examQuestion.examQuestionId", target = "examQuestionId")
    @Mapping(source = "question.questionId", target = "questionId")
    @Mapping(source = "lesson.lessonId", target = "lessonId")
    LearnerExamDetailDto toDto(LearnerExamDetail entity);

    @Mapping(source = "learnerId", target = "learner.learnerId")
    @Mapping(source = "examId", target = "exam.examId")
    @Mapping(source = "examQuestionId", target = "examQuestion.examQuestionId")
    @Mapping(source = "questionId", target = "question.questionId")
    @Mapping(source = "lessonId", target = "lesson.lessonId")
    LearnerExamDetail toEntity(LearnerExamDetailDto dto);
}
