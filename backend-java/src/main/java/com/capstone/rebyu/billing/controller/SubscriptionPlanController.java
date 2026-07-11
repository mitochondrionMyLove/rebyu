package com.capstone.rebyu.billing.controller;

import com.capstone.rebyu.billing.dto.EntitlementDtos.SubscriptionPlanDto;
import com.capstone.rebyu.billing.entity.SubscriptionPlan;
import com.capstone.rebyu.billing.service.SubscriptionPlanService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subscription-plans")
@RequiredArgsConstructor
public class SubscriptionPlanController {

    private final SubscriptionPlanService subscriptionPlanService;

    @GetMapping("/individual")
    public List<SubscriptionPlanDto> getIndividualPlans() {
        return subscriptionPlanService.getPlans(SubscriptionPlan.CustomerType.INDIVIDUAL);
    }

    @GetMapping("/institutional")
    public List<SubscriptionPlanDto> getInstitutionalPlans() {
        return subscriptionPlanService.getPlans(SubscriptionPlan.CustomerType.INSTITUTION);
    }
}
