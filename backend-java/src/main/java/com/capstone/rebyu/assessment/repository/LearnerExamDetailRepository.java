package com.capstone.rebyu.assessment.repository;

import com.capstone.rebyu.assessment.entity.LearnerExamDetail;
import com.capstone.rebyu.assessment.entity.LearnerExamDetailId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LearnerExamDetailRepository extends JpaRepository<LearnerExamDetail, LearnerExamDetailId> {
}
