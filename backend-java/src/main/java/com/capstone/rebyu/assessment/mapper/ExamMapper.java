package com.capstone.rebyu.assessment.mapper;



import com.capstone.rebyu.assessment.entity.ExamType;
import com.capstone.rebyu.certification.entity.Certification;
import com.capstone.rebyu.assessment.dto.ExamDto;
import com.capstone.rebyu.assessment.entity.Exam;
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
