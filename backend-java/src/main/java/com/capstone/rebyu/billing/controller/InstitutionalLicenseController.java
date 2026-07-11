package com.capstone.rebyu.billing.controller;

import com.capstone.rebyu.billing.dto.EntitlementDtos.InstitutionalLicenseDto;
import com.capstone.rebyu.billing.service.InstitutionalEntitlementService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

/**
 * Enterprise-facing license + entitlement reads. Ownership of the enterprise is
 * enforced by the surrounding enterprise security; capacity enforcement lives
 * in the institutional entitlement service.
 */
@RestController
@RequestMapping("/api/enterprise")
@RequiredArgsConstructor
public class InstitutionalLicenseController {

    private final InstitutionalEntitlementService institutionalEntitlementService;

    @GetMapping("/license")
    public InstitutionalLicenseDto getLicense(@RequestParam Long enterpriseId) {
        return institutionalEntitlementService.getLicenseUsageSummary(enterpriseId);
    }

    @GetMapping("/license/usage")
    public InstitutionalLicenseDto getLicenseUsage(@RequestParam Long enterpriseId) {
        return institutionalEntitlementService.getLicenseUsageSummary(enterpriseId);
    }

    @GetMapping("/entitlements")
    public Set<String> getEntitlements(@RequestParam Long enterpriseId) {
        return institutionalEntitlementService.getInstitutionalEntitlements(enterpriseId).keySet();
    }
}
