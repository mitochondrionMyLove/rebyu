package com.capstone.rebyu.learningtools.repository;

import com.capstone.rebyu.learningtools.entity.LearnerMistakeReview;
import com.capstone.rebyu.learningtools.entity.LearnerMistakeReviewId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LearnerMistakeReviewRepository
        extends JpaRepository<LearnerMistakeReview, LearnerMistakeReviewId> {

    List<LearnerMistakeReview> findByLearner_LearnerId(Long learnerId);

    void deleteByLearner_LearnerIdAndSourceQuestion_QuestionId(Long learnerId, Long sourceQuestionId);
}
