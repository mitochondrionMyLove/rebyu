package com.capstone.rebyu.enrollment.repository;

import com.capstone.rebyu.enrollment.entity.LearnerOrder;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LearnerOrderRepository extends JpaRepository<LearnerOrder, Long> {
    List<LearnerOrder> findByLearner_LearnerId(Long learnerId);
}
