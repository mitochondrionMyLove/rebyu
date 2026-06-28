package com.capstone.rebyu.assessment.repository;

import com.capstone.rebyu.assessment.entity.LearnerTextAnswer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LearnerTextAnswerRepository extends JpaRepository<LearnerTextAnswer, Long> {
    Optional<LearnerTextAnswer> findByLearnerExamDetail_LearnerExamDetailId(Long learnerExamDetailId);
}
