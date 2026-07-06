package com.capstone.rebyu.enrollment.controller;

import com.capstone.rebyu.enrollment.dto.PurchaseDtos.*;
import com.capstone.rebyu.enrollment.service.EnrollmentTransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** Learner-facing purchase and enrollment transaction endpoints. */
@RestController
@RequestMapping("/api/learner")
@RequiredArgsConstructor
public class LearnerEnrollmentController {

    private final EnrollmentTransactionService enrollmentTransactionService;

    @PostMapping("/certifications/{certificationId}/purchase")
    @ResponseStatus(HttpStatus.CREATED)
    public PurchaseTransactionDto purchase(
            @PathVariable Long certificationId,
            @Valid @RequestBody PurchaseRequestDto request) {
        return enrollmentTransactionService.purchase(
                certificationId, request.learnerId(), request.idempotencyKey());
    }

    @PostMapping("/purchases/{transactionId}/confirm")
    public PurchaseTransactionDto confirm(
            @PathVariable Long transactionId,
            @Valid @RequestBody ConfirmPaymentRequestDto request) {
        return enrollmentTransactionService.confirmPayment(
                transactionId, request.learnerId(), request.paymentReference());
    }

    @GetMapping("/enrollments")
    public List<LearnerEnrollmentDto> getEnrollments(@RequestParam Long learnerId) {
        return enrollmentTransactionService.getEnrollments(learnerId);
    }
}
