package com.capstone.rebyu.enterprisegroup.repository;

import com.capstone.rebyu.enrollment.entity.OrganizationCertificationLearner;
import com.capstone.rebyu.enterprisegroup.entity.EnterpriseGroup;
import com.capstone.rebyu.enterprisegroup.entity.EnterpriseGroupAssignee;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EnterpriseGroupAssigneeRepository extends JpaRepository<EnterpriseGroupAssignee, Long> {
    List<EnterpriseGroupAssignee> findByEnterpriseGroup_EnterpriseGroupId(Long enterpriseGroupId);

    boolean existsByEnterpriseGroupAndOrgCertLearner(
            EnterpriseGroup enterpriseGroup, OrganizationCertificationLearner orgCertLearner);
}
