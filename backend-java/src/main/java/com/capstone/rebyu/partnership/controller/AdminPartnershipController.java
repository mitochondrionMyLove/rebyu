package com.capstone.rebyu.partnership.controller;

import com.capstone.rebyu.partnership.dto.AdminPartnershipDtos.PartnershipRequestDetailDto;
import com.capstone.rebyu.partnership.dto.AdminPartnershipDtos.PartnershipRequestSummaryDto;
import com.capstone.rebyu.partnership.dto.AdminPartnershipDtos.ReviewPartnershipRequest;
import com.capstone.rebyu.partnership.service.AdminPartnershipService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** Transaction Two: admin review of partnership requests. */
@RestController
@RequestMapping("/api/admin/partnership-requests")
@RequiredArgsConstructor
public class AdminPartnershipController {

    private final AdminPartnershipService adminPartnershipService;

    @GetMapping
    public List<PartnershipRequestSummaryDto> list(
            @RequestParam(value = "status", required = false) String status) {
        return adminPartnershipService.list(status);
    }

    @GetMapping("/{requestId}")
    public PartnershipRequestDetailDto detail(@PathVariable Long requestId) {
        return adminPartnershipService.getDetail(requestId);
    }

    @PutMapping("/{requestId}/approve")
    public PartnershipRequestDetailDto approve(
            @PathVariable Long requestId,
            @RequestBody(required = false) ReviewPartnershipRequest body,
            @AuthenticationPrincipal Jwt jwt) {
        return adminPartnershipService.approve(
                requestId,
                body != null ? body.remarks() : null,
                reviewerName(jwt));
    }

    @PutMapping("/{requestId}/reject")
    public PartnershipRequestDetailDto reject(
            @PathVariable Long requestId,
            @RequestBody(required = false) ReviewPartnershipRequest body,
            @AuthenticationPrincipal Jwt jwt) {
        return adminPartnershipService.reject(
                requestId,
                body != null ? body.remarks() : null,
                reviewerName(jwt));
    }

    // Records who reviewed the request from the validated token when present.
    private String reviewerName(Jwt jwt) {
        if (jwt == null) {
            return "admin";
        }
        Object email = jwt.getClaims().get("email");
        return email != null ? email.toString() : "admin";
    }
}
