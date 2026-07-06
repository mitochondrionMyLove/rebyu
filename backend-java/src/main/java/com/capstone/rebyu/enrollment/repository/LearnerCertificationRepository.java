package com.capstone.rebyu.enrollment.repository;

import com.capstone.rebyu.enrollment.entity.LearnerCertification;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LearnerCertificationRepository extends JpaRepository<LearnerCertification, Long> {

    java.util.Optional<LearnerCertification> findFirstByLearner_LearnerIdAndCertification_CertificationIdAndStatus(
            Long learnerId, Long certificationId, LearnerCertification.Status status);

    java.util.List<LearnerCertification> findByLearner_LearnerId(Long learnerId);

    boolean existsByLearner_LearnerIdAndCertification_CertificationIdAndStatus(
            Long learnerId, Long certificationId, LearnerCertification.Status status);
}
