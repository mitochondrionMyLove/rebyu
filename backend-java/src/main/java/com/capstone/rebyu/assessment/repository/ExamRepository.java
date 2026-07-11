package com.capstone.rebyu.assessment.repository;

import com.capstone.rebyu.assessment.entity.Exam;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExamRepository extends JpaRepository<Exam, Long> {
    List<Exam> findByCertification_CertificationId(Long certificationId);

    // Per-scope uniqueness checks (spec §5): one required assessment per scope.
    boolean existsByLesson_LessonId(Long lessonId);

    boolean existsByMiddleCategory_MiddleCategoryId(Long middleCategoryId);

    boolean existsByMajorCategory_MajorCategoryId(Long majorCategoryId);

    boolean existsByCertification_CertificationIdAndExamType_ExamTypeText(
            Long certificationId, String examTypeText);
}
