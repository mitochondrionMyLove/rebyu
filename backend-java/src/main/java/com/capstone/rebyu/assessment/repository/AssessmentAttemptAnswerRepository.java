package com.capstone.rebyu.assessment.repository;

import com.capstone.rebyu.assessment.entity.AssessmentAttemptAnswer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AssessmentAttemptAnswerRepository
        extends JpaRepository<AssessmentAttemptAnswer, Long> {

    List<AssessmentAttemptAnswer> findByAttempt_AssessmentAttemptId(Long assessmentAttemptId);

    Optional<AssessmentAttemptAnswer> findByAttempt_AssessmentAttemptIdAndAttemptQuestion_AttemptQuestionId(
            Long assessmentAttemptId, Long attemptQuestionId);
}
