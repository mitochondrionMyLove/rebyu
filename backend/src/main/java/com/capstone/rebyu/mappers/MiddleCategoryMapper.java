package com.capstone.rebyu.mappers;

import com.capstone.rebyu.dto.MiddleCategoryDto;
import com.capstone.rebyu.models.Lesson;
import com.capstone.rebyu.models.MajorCategory;
import com.capstone.rebyu.models.MiddleCategory;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring", uses = LessonMapper.class)
public interface MiddleCategoryMapper {
    @Mapping(source = "majorCategory.majorCategoryId", target = "majorCategoryId")
    MiddleCategoryDto toDto(MiddleCategory entity);

    @Mapping(source = "majorCategoryId", target = "majorCategory.majorCategoryId")
    MiddleCategory toEntity(MiddleCategoryDto dto);

    @AfterMapping
    default void linkLesson(@MappingTarget MiddleCategory middleCategory){
        if(middleCategory.getLessons() != null){
           for(Lesson lesson : middleCategory.getLessons()){
               lesson.setMiddleCategory(middleCategory);
           }
        }
    }
}
