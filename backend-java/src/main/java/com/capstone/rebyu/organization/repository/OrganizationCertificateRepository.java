package com.capstone.rebyu.organization.repository;

import com.capstone.rebyu.organization.entity.OrganizationCertificate;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OrganizationCertificateRepository extends JpaRepository<OrganizationCertificate, Long> {

    Optional<OrganizationCertificate> findByEnterprise_EnterpriseIdAndCertification_CertificationId(
            Long enterpriseId, Long certificationId);

    List<OrganizationCertificate> findByEnterprise_EnterpriseId(Long enterpriseId);
}
