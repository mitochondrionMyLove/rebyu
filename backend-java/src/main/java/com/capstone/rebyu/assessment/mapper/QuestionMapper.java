package com.capstone.rebyu.assessment.mapper;

import com.capstone.rebyu.assessment.dto.ChoiceDto;
import com.capstone.rebyu.assessment.dto.QuestionDto;
import com.capstone.rebyu.assessment.entity.Choice;
import com.capstone.rebyu.assessment.entity.Question;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.ArrayList;
import java.util.List;

@Mapper(componentModel = "spring", uses = {ChoiceMapper.class})
public abstract class QuestionMapper {

    @Autowired
    protected ChoiceMapper choiceMapper;

    @Mapping(source = "lesson.lessonId", target = "lessonId")
    @Mapping(source = "parentQuestion.questionId", target = "parentQuestionId")
    public abstract QuestionDto toDto(Question entity);

    @Mapping(source = "lessonId", target = "lesson.lessonId")
    @Mapping(source = "parentQuestionId", target = "parentQuestion.questionId")
    @Mapping(target = "choices", ignore = true)
    public abstract Question toEntity(QuestionDto dto);

    @AfterMapping
    protected void afterToEntity(QuestionDto dto, @MappingTarget Question entity) {
        List<Choice> choices = new ArrayList<>();
        if (dto.getChoices() != null) {
            for (ChoiceDto choiceDto : dto.getChoices()) {
                Choice choice = choiceMapper.toEntity(choiceDto);
                choice.setChoiceId(null);
                choice.setQuestion(entity);
                choices.add(choice);
            }
        }
        entity.setChoices(choices);
    }
}
