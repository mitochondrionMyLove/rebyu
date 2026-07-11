package com.capstone.rebyu.billing.service;

import com.capstone.rebyu.billing.dto.EntitlementDtos.PlanEntitlementDto;
import com.capstone.rebyu.billing.dto.EntitlementDtos.SubscriptionPlanDto;
import com.capstone.rebyu.billing.entity.SubscriptionPlan;
import com.capstone.rebyu.billing.repository.PlanEntitlementRepository;
import com.capstone.rebyu.billing.repository.SubscriptionPlanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** Read access to the configured plans and their entitlements. */
@Service
@RequiredArgsConstructor
public class SubscriptionPlanService {

    private final SubscriptionPlanRepository subscriptionPlanRepository;
    private final PlanEntitlementRepository planEntitlementRepository;

    @Transactional(readOnly = true)
    public List<SubscriptionPlanDto> getPlans(SubscriptionPlan.CustomerType customerType) {
        return subscriptionPlanRepository
                .findByCustomerTypeAndStatusOrderByDisplayOrderAsc(customerType, "ACTIVE")
                .stream()
                .map(this::toDto)
                .toList();
    }

    private SubscriptionPlanDto toDto(SubscriptionPlan plan) {
        List<PlanEntitlementDto> entitlements = planEntitlementRepository
                .findBySubscriptionPlan_SubscriptionPlanId(plan.getSubscriptionPlanId())
                .stream()
                .map(entitlement -> new PlanEntitlementDto(
                        entitlement.getEntitlementCode(),
                        entitlement.isEnabled(),
                        entitlement.getLimitValue()))
                .toList();
        return new SubscriptionPlanDto(
                plan.getSubscriptionPlanId(),
                plan.getPlanCode(),
                plan.getPlanName(),
                plan.getCustomerType().name(),
                plan.getDescription(),
                plan.getBillingInterval().name(),
                plan.getAmount(),
                plan.getCurrency(),
                plan.isFree(),
                plan.isCustomPricing(),
                plan.getStatus(),
                entitlements);
    }
}
