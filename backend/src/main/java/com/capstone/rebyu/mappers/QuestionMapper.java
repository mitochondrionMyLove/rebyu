package com.capstone.rebyu.mappers;

import com.capstone.rebyu.dto.QuestionDto;
import com.capstone.rebyu.models.Question;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface QuestionMapper {
    @Mapping(source = "questionType.questionTypeId", target = "questionTypeId")
    @Mapping(source = "difficultyLevel.difficultyLevelId", target = "difficultyLevelId")
    @Mapping(source = "lesson.lessonId", target = "lessonId")
    QuestionDto toDto(Question entity);

    @Mapping(source = "questionTypeId", target = "questionType.questionTypeId")
    @Mapping(source = "difficultyLevelId", target = "difficultyLevel.difficultyLevelId")
    @Mapping(source = "lessonId", target = "lesson.lessonId")
    Question toEntity(QuestionDto dto);
}
