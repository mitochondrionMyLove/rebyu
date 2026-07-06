package com.capstone.rebyu.enrollment.service;

import com.capstone.rebyu.enrollment.entity.LearnerOrder;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

/**
 * DEV/TEST-ONLY payment verifier. No real payment provider is integrated in
 * this codebase, so this clearly labeled simulation accepts references that
 * embed the order number issued by the backend ("SIM-{orderNumber}"). Replace
 * with a real provider implementation before production use.
 */
@Slf4j
@Component
public class DevSimulatedPaymentVerifier implements PaymentVerificationService {

    @Override
    public boolean verify(LearnerOrder order, String paymentReference) {
        boolean valid = paymentReference != null
                && paymentReference.equals("SIM-" + order.getOrderNumber());
        if (!valid) {
            log.warn("Simulated payment verification failed for order {}", order.getOrderId());
        }
        return valid;
    }

    @Override
    public String providerName() {
        return "DEV_SIMULATED";
    }
}
