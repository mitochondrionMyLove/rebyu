package com.capstone.rebyu.assessment.repository;

import com.capstone.rebyu.assessment.entity.LearnerExamDetail;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LearnerExamDetailRepository extends JpaRepository<LearnerExamDetail, Long> {
    List<LearnerExamDetail> findByLearner_LearnerIdAndExam_ExamIdAndAttemptNo(Long learnerId, Long examId, Integer attemptNo);

    boolean existsByQuestion_QuestionId(Long questionId);
}
