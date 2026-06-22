package com.capstone.rebyu.mappers;

import com.capstone.rebyu.dto.ExamDto;
import com.capstone.rebyu.models.Exam;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ExamMapper {
    @Mapping(source = "certification.certificationId", target = "certificationId")
    @Mapping(source = "examType.examTypeId", target = "examTypeId")
    ExamDto toDto(Exam entity);

    @Mapping(source = "certificationId", target = "certification.certificationId")
    @Mapping(source = "examTypeId", target = "examType.examTypeId")
    Exam toEntity(ExamDto dto);
}
