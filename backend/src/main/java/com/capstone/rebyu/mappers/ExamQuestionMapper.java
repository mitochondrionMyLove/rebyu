package com.capstone.rebyu.mappers;

import com.capstone.rebyu.dto.ExamQuestionDto;
import com.capstone.rebyu.models.ExamQuestion;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ExamQuestionMapper {
    @Mapping(source = "exam.examId", target = "examId")
    @Mapping(source = "question.questionId", target = "questionId")
    ExamQuestionDto toDto(ExamQuestion entity);

    @Mapping(source = "examId", target = "exam.examId")
    @Mapping(source = "questionId", target = "question.questionId")
    ExamQuestion toEntity(ExamQuestionDto dto);
}
