package com.capstone.rebyu.assessment.repository;

import com.capstone.rebyu.assessment.entity.AssessmentAttemptExecution;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AssessmentAttemptExecutionRepository
        extends JpaRepository<AssessmentAttemptExecution, Long> {

    List<AssessmentAttemptExecution> findByAttemptQuestion_AttemptQuestionIdOrderByCreatedAtDesc(
            Long attemptQuestionId, Pageable pageable);
}
