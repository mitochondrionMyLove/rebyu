package com.capstone.rebyu.billing.entitlement;

import lombok.Getter;

/**
 * Thrown when a learner requests a premium feature without personal Pro or an
 * eligible institution-sponsored entitlement. Rendered as a structured 403.
 */
@Getter
public class PremiumAccessRequiredException extends RuntimeException {

    private final String code = "PREMIUM_ACCESS_REQUIRED";
    private final String feature;
    private final String eligiblePlan;

    public PremiumAccessRequiredException(String feature) {
        super("This feature requires REBYU Pro or an eligible institutional license.");
        this.feature = feature;
        this.eligiblePlan = "PRO_MONTHLY";
    }
}
