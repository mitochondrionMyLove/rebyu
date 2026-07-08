package com.capstone.rebyu.assessment.repository;

import com.capstone.rebyu.assessment.entity.ExamQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;

import java.util.List;

public interface ExamQuestionRepository extends JpaRepository<ExamQuestion, Long> {
    boolean existsByQuestion_QuestionId(Long questionId);

    List<ExamQuestion> findByExam_ExamIdOrderByDisplayOrderAsc(Long examId);

    long countByExam_ExamId(Long examId);

    @Modifying
    void deleteByExam_ExamId(Long examId);
}
