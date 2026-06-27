package com.capstone.rebyu.assessment.mapper;



import com.capstone.rebyu.assessment.entity.DifficultyLevel;
import com.capstone.rebyu.assessment.entity.QuestionType;
import com.capstone.rebyu.certification.entity.Lesson;
import com.capstone.rebyu.assessment.dto.QuestionDto;
import com.capstone.rebyu.assessment.entity.Question;
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
