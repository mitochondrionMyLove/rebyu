package com.capstone.rebyu.assessment.mapper;

import com.capstone.rebyu.assessment.dto.NoChoiceQuestionDto;
import com.capstone.rebyu.assessment.dto.SubQuestionDto;
import com.capstone.rebyu.assessment.entity.NoChoiceQuestion;
import com.capstone.rebyu.assessment.entity.SubQuestion;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@Mapper(componentModel = "spring", uses = {SubQuestionMapper.class})
public abstract class NoChoiceQuestionMapper {

    @Autowired
    protected SubQuestionMapper subQuestionMapper;

    public abstract NoChoiceQuestionDto toDto(NoChoiceQuestion entity);

    @Mapping(target = "subQuestions", ignore = true)
    public abstract NoChoiceQuestion toEntity(NoChoiceQuestionDto dto);

    @AfterMapping
    protected void afterToEntity(NoChoiceQuestionDto dto, @MappingTarget NoChoiceQuestion entity) {
        if (dto.getSubQuestions() == null) {
            entity.setSubQuestions(null);
            return;
        }
        List<SubQuestion> subQuestions = dto.getSubQuestions().stream()
                .map(subQuestionMapper::toEntity)
                .peek(sq -> { sq.setSubQuestionId(null); sq.setNoChoiceQuestion(entity); })
                .toList();
        entity.setSubQuestions(subQuestions);
    }
}
