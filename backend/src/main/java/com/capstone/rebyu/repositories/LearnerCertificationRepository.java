package com.capstone.rebyu.repositories;

import com.capstone.rebyu.models.LearnerCertification;
import com.capstone.rebyu.models.LearnerCertificationId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LearnerCertificationRepository extends JpaRepository<LearnerCertification, LearnerCertificationId> {
}
