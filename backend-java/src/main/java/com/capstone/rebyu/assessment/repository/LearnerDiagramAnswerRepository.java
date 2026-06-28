package com.capstone.rebyu.assessment.repository;

import com.capstone.rebyu.assessment.entity.LearnerDiagramAnswer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LearnerDiagramAnswerRepository extends JpaRepository<LearnerDiagramAnswer, Long> {
    Optional<LearnerDiagramAnswer> findByLearnerExamDetail_LearnerExamDetailId(Long learnerExamDetailId);
}
