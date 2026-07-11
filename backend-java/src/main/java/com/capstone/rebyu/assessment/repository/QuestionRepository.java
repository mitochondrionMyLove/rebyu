package com.capstone.rebyu.assessment.repository;

import com.capstone.rebyu.assessment.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findByLesson_LessonId(Long lessonId);

    List<Question> findByParentQuestion_QuestionId(Long questionId);

    // Scope-derived eligibility (top-level questions only; sub-questions ride
    // with their parent). Ordered for stable picker display.
    List<Question> findByParentQuestionIsNullAndLesson_LessonIdOrderByQuestionIdAsc(Long lessonId);

    List<Question> findByParentQuestionIsNullAndLesson_MiddleCategory_MiddleCategoryIdOrderByQuestionIdAsc(
            Long middleCategoryId);

    List<Question> findByParentQuestionIsNullAndLesson_MiddleCategory_MajorCategory_MajorCategoryIdOrderByQuestionIdAsc(
            Long majorCategoryId);

    List<Question> findByParentQuestionIsNullAndLesson_MiddleCategory_MajorCategory_Certification_CertificationIdOrderByQuestionIdAsc(
            Long certificationId);

    @Modifying(flushAutomatically = true, clearAutomatically = true)
    @Query("DELETE FROM Question q WHERE q.questionId = :id")
    void deleteByQuestionId(@Param("id") Long id);
}
