package com.capstone.rebyu.assessment.repository;

import com.capstone.rebyu.assessment.entity.LearnerMcqAnswer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LearnerMcqAnswerRepository extends JpaRepository<LearnerMcqAnswer, Long> {
    List<LearnerMcqAnswer> findByLearnerExamDetail_LearnerExamDetailId(Long learnerExamDetailId);
}
