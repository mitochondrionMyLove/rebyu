package com.capstone.rebyu.assessment.mapper;



import com.capstone.rebyu.assessment.dto.ExamDto;
import com.capstone.rebyu.assessment.entity.Exam;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

@Mapper(componentModel = "spring")
public interface ExamMapper {
    @Mapping(source = "certification.certificationId", target = "certificationId")
    @Mapping(source = "examType.examTypeId", target = "examTypeId")
    @Mapping(source = "lesson.lessonId", target = "lessonId")
    @Mapping(source = "entity", target = "status", qualifiedByName = "effectiveStatus")
    ExamDto toDto(Exam entity);

    @Mapping(source = "certificationId", target = "certification.certificationId")
    @Mapping(source = "examTypeId", target = "examType.examTypeId")
    @Mapping(source = "lessonId", target = "lesson", qualifiedByName = "lessonFromId")
    @Mapping(source = "status", target = "status", qualifiedByName = "statusFromString")
    Exam toEntity(ExamDto dto);

    @Named("effectiveStatus")
    default String effectiveStatus(Exam entity) {
        return entity.effectiveStatus().name();
    }

    @Named("statusFromString")
    default Exam.Status statusFromString(String status) {
        if (status == null || status.isBlank()) {
            return null;
        }
        return Exam.Status.valueOf(status.trim().toUpperCase());
    }

    @Named("lessonFromId")
    default com.capstone.rebyu.certification.entity.Lesson lessonFromId(Long lessonId) {
        if (lessonId == null) {
            return null;
        }
        com.capstone.rebyu.certification.entity.Lesson lesson =
                new com.capstone.rebyu.certification.entity.Lesson();
        lesson.setLessonId(lessonId);
        return lesson;
    }
}
