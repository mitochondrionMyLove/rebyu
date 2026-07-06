package com.capstone.rebyu.enrollment.repository;

import com.capstone.rebyu.enrollment.entity.OrganizationCertificationLearner;
import com.capstone.rebyu.organization.entity.OrganizationCertificate;
import com.capstone.rebyu.user.entity.Learner;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrganizationCertificationLearnerRepository extends JpaRepository<OrganizationCertificationLearner, Long> {
    boolean existsByOrgCertAndLearner(OrganizationCertificate orgCert, Learner learner);
}
