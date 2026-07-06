package com.capstone.rebyu.assessment.repository;

import com.capstone.rebyu.assessment.entity.AssessmentAttemptQuestion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AssessmentAttemptQuestionRepository
        extends JpaRepository<AssessmentAttemptQuestion, Long> {

    List<AssessmentAttemptQuestion> findByAttempt_AssessmentAttemptIdOrderByDisplayOrderAsc(
            Long assessmentAttemptId);
}
