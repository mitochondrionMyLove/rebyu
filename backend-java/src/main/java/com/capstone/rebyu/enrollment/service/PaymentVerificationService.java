package com.capstone.rebyu.enrollment.service;

import com.capstone.rebyu.enrollment.entity.LearnerOrder;

/**
 * Server-side payment verification abstraction. The frontend claim that a
 * payment succeeded is never trusted; only implementations of this interface
 * decide whether an order's payment reference is valid.
 */
public interface PaymentVerificationService {

    /**
     * @return true when the payment for this order is verified with the
     *         provider backing this implementation.
     */
    boolean verify(LearnerOrder order, String paymentReference);

    /** Provider label recorded with the transaction (e.g. DEV_SIMULATED). */
    String providerName();
}
