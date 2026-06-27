package com.capstone.rebyu.enrollment.repository;

import com.capstone.rebyu.enrollment.entity.LearnerCertification;
import com.capstone.rebyu.enrollment.entity.LearnerCertificationId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LearnerCertificationRepository extends JpaRepository<LearnerCertification, LearnerCertificationId> {
}
