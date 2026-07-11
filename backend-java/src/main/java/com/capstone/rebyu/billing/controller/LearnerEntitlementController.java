package com.capstone.rebyu.billing.controller;

import com.capstone.rebyu.billing.dto.EntitlementDtos.LearnerEntitlementsDto;
import com.capstone.rebyu.billing.dto.EntitlementDtos.LearnerSubscriptionDto;
import com.capstone.rebyu.billing.service.LearnerEntitlementService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

/**
 * Learner-facing entitlement + subscription reads. learnerId follows the
 * existing learner-endpoint convention; premium enforcement happens in the
 * services that guard each feature, not here.
 */
@RestController
@RequestMapping("/api/learner")
@RequiredArgsConstructor
public class LearnerEntitlementController {

    private final LearnerEntitlementService learnerEntitlementService;

    @GetMapping("/entitlements")
    public LearnerEntitlementsDto getEntitlements(
            @RequestParam Long learnerId,
            @RequestParam(required = false) Long certificationId) {
        return learnerEntitlementService.getEffectiveEntitlements(learnerId, certificationId);
    }

    @GetMapping("/subscription")
    public LearnerSubscriptionDto getSubscription(@RequestParam Long learnerId) {
        return learnerEntitlementService.getSubscriptionView(learnerId);
    }
}
