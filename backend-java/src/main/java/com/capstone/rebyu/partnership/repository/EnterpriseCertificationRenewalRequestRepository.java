package com.capstone.rebyu.partnership.repository;

import com.capstone.rebyu.partnership.entity.EnterpriseCertificationRenewalRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EnterpriseCertificationRenewalRequestRepository extends JpaRepository<EnterpriseCertificationRenewalRequest, Long> {
    List<EnterpriseCertificationRenewalRequest> findByOrgCert_OrgCertId(Long orgCertId);
}
