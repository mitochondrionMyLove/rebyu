package com.capstone.rebyu.repositories;

import com.capstone.rebyu.models.LearnerExamDetail;
import com.capstone.rebyu.models.LearnerExamDetailId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LearnerExamDetailRepository extends JpaRepository<LearnerExamDetail, LearnerExamDetailId> {
}
