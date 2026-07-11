package com.capstone.rebyu.enrollment.repository;

import com.capstone.rebyu.enrollment.entity.OrganizationCertificationLearner;
import com.capstone.rebyu.organization.entity.OrganizationCertificate;
import com.capstone.rebyu.user.entity.Learner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OrganizationCertificationLearnerRepository extends JpaRepository<OrganizationCertificationLearner, Long> {
    boolean existsByOrgCertAndLearner(OrganizationCertificate orgCert, Learner learner);

    List<OrganizationCertificationLearner> findByLearner_LearnerIdAndStatus(
            Long learnerId, OrganizationCertificationLearner.Status status);

    /** Unique active learners under an enterprise — the institutional seat unit. */
    @Query("""
            SELECT COUNT(DISTINCT o.learner.learnerId)
            FROM OrganizationCertificationLearner o
            WHERE o.orgCert.enterprise.enterpriseId = :enterpriseId
              AND o.status = :status
            """)
    long countDistinctActiveLearners(
            @Param("enterpriseId") Long enterpriseId,
            @Param("status") OrganizationCertificationLearner.Status status);
}
