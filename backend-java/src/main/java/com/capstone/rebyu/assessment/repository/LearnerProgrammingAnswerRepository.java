package com.capstone.rebyu.assessment.repository;

import com.capstone.rebyu.assessment.entity.LearnerProgrammingAnswer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LearnerProgrammingAnswerRepository extends JpaRepository<LearnerProgrammingAnswer, Long> {
    Optional<LearnerProgrammingAnswer> findByLearnerExamDetail_LearnerExamDetailId(Long learnerExamDetailId);
}
