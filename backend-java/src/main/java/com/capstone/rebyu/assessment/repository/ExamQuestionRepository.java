package com.capstone.rebyu.assessment.repository;

import com.capstone.rebyu.assessment.entity.ExamQuestion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExamQuestionRepository extends JpaRepository<ExamQuestion, Long> {
    boolean existsByQuestion_QuestionId(Long questionId);

    List<ExamQuestion> findByExam_ExamIdOrderByDisplayOrderAsc(Long examId);

    long countByExam_ExamId(Long examId);
}
