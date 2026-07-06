package com.capstone.rebyu.organization.repository;

import com.capstone.rebyu.organization.entity.Enterprise;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EnterpriseRepository extends JpaRepository<Enterprise, Long> {

    Optional<Enterprise> findByPrimaryContactEmailIgnoreCase(String email);

    Optional<Enterprise> findByEnterpriseNameIgnoreCase(String enterpriseName);
}
