package com.capstone.rebyu.mappers;

import com.capstone.rebyu.dto.ExamResultDto;
import com.capstone.rebyu.models.ExamResult;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ExamResultMapper {
    @Mapping(source = "id.learnerId", target = "learnerId")
    @Mapping(source = "id.examId", target = "examId")
    @Mapping(source = "id.attemptNo", target = "attemptNo")
    ExamResultDto toDto(ExamResult entity);

    @Mapping(source = "learnerId", target = "id.learnerId")
    @Mapping(source = "examId", target = "id.examId")
    @Mapping(source = "attemptNo", target = "id.attemptNo")
    ExamResult toEntity(ExamResultDto dto);
}
