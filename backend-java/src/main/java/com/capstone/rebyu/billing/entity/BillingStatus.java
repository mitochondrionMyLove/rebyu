package com.capstone.rebyu.billing.entity;

/** Lifecycle status shared by learner subscriptions and institutional licenses. */
public enum BillingStatus {
    PENDING, TRIALING, ACTIVE, PAST_DUE, SUSPENDED, CANCELED, EXPIRED, PAYMENT_FAILED;

    /** True when the subscription/license currently grants access. */
    public boolean grantsAccess() {
        return this == ACTIVE || this == TRIALING;
    }
}
