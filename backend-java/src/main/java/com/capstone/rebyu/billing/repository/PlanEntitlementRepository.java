package com.capstone.rebyu.billing.repository;

import com.capstone.rebyu.billing.entity.PlanEntitlement;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PlanEntitlementRepository extends JpaRepository<PlanEntitlement, Long> {
    List<PlanEntitlement> findBySubscriptionPlan_SubscriptionPlanId(Long subscriptionPlanId);
}
