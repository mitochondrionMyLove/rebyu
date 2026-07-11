package com.capstone.rebyu.billing.service;

import com.capstone.rebyu.billing.dto.EntitlementDtos.InstitutionalLicenseDto;
import com.capstone.rebyu.billing.dto.EntitlementDtos.UsageMetricDto;
import com.capstone.rebyu.billing.entitlement.CapacityLimitReachedException;
import com.capstone.rebyu.billing.entitlement.Entitlements;
import com.capstone.rebyu.billing.entitlement.InstitutionalEntitlementRequiredException;
import com.capstone.rebyu.billing.entity.InstitutionalLicense;
import com.capstone.rebyu.billing.entity.PlanEntitlement;
import com.capstone.rebyu.billing.repository.InstitutionalLicenseRepository;
import com.capstone.rebyu.billing.repository.PlanEntitlementRepository;
import com.capstone.rebyu.enrollment.entity.OrganizationCertificationLearner;
import com.capstone.rebyu.enrollment.repository.OrganizationCertificationLearnerRepository;
import com.capstone.rebyu.enterprisegroup.entity.EnterpriseGroup;
import com.capstone.rebyu.enterprisegroup.entity.EnterpriseGroupAuthority;
import com.capstone.rebyu.enterprisegroup.repository.EnterpriseGroupAuthorityRepository;
import com.capstone.rebyu.enterprisegroup.repository.EnterpriseGroupRepository;
import com.capstone.rebyu.organization.entity.OrganizationCertificate;
import com.capstone.rebyu.organization.repository.OrganizationCertificateRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Centralized institutional (B2B) entitlement + capacity authority. Everything
 * derives from the enterprise's active license and validated usage counts —
 * never from stored counters the caller supplies.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class InstitutionalEntitlementService {

    private final InstitutionalLicenseRepository licenseRepository;
    private final PlanEntitlementRepository planEntitlementRepository;
    private final OrganizationCertificationLearnerRepository orgCertLearnerRepository;
    private final OrganizationCertificateRepository orgCertificateRepository;
    private final EnterpriseGroupRepository groupRepository;
    private final EnterpriseGroupAuthorityRepository authorityRepository;

    @Transactional(readOnly = true)
    public Optional<InstitutionalLicense> getCurrentInstitutionalLicense(Long enterpriseId) {
        return licenseRepository.findFirstByEnterprise_EnterpriseIdOrderByCreatedAtDesc(enterpriseId);
    }

    /** The most recent license that currently grants access, if any. */
    @Transactional(readOnly = true)
    public Optional<InstitutionalLicense> getActiveLicense(Long enterpriseId) {
        return licenseRepository.findByEnterprise_EnterpriseIdOrderByCreatedAtDesc(enterpriseId).stream()
                .filter(InstitutionalLicense::isCurrentlyActive)
                .findFirst();
    }

    /** Enabled entitlements of the active license's plan, keyed by code. */
    @Transactional(readOnly = true)
    public Map<String, PlanEntitlement> getInstitutionalEntitlements(Long enterpriseId) {
        return getActiveLicense(enterpriseId)
                .map(this::planEntitlements)
                .orElse(Map.of());
    }

    @Transactional(readOnly = true)
    public boolean hasInstitutionalEntitlement(Long enterpriseId, String entitlementCode) {
        return getInstitutionalEntitlements(enterpriseId).containsKey(entitlementCode);
    }

    @Transactional(readOnly = true)
    public void requireInstitutionalEntitlement(Long enterpriseId, String entitlementCode) {
        if (!hasInstitutionalEntitlement(enterpriseId, entitlementCode)) {
            throw new InstitutionalEntitlementRequiredException(entitlementCode);
        }
    }

    @Transactional(readOnly = true)
    public InstitutionalLicenseDto getLicenseUsageSummary(Long enterpriseId) {
        InstitutionalLicense license = getActiveLicense(enterpriseId).orElse(null);
        if (license == null) {
            return new InstitutionalLicenseDto(
                    null, enterpriseId, null, null, null, null, "NONE",
                    null, null, false, Set.of(), List.of());
        }
        Map<String, PlanEntitlement> entitlements = planEntitlements(license);
        List<UsageMetricDto> usage = List.of(
                metric(Entitlements.SEAT_LIMIT, seatsUsed(enterpriseId), seatLimit(license, entitlements)),
                metric(Entitlements.GROUP_LIMIT, groupsUsed(enterpriseId), limit(license.getCustomGroupLimit(), entitlements, Entitlements.GROUP_LIMIT)),
                metric(Entitlements.AUTHORITY_LIMIT, authoritiesUsed(enterpriseId), limit(license.getCustomAuthorityLimit(), entitlements, Entitlements.AUTHORITY_LIMIT)),
                metric(Entitlements.CERTIFICATION_ALLOCATION_LIMIT, certificationsUsed(enterpriseId),
                        limit(license.getCustomCertificationLimit(), entitlements, Entitlements.CERTIFICATION_ALLOCATION_LIMIT))
        );
        return new InstitutionalLicenseDto(
                license.getInstitutionalLicenseId(),
                enterpriseId,
                license.getSubscriptionPlan().getPlanCode(),
                license.getSubscriptionPlan().getPlanName(),
                license.getSubscriptionPlan().getBillingInterval().name(),
                license.getContractNumber(),
                license.getLicenseStatus().name(),
                license.getCurrentPeriodStart(),
                license.getCurrentPeriodEnd(),
                license.isCancelAtPeriodEnd(),
                entitlements.keySet(),
                usage);
    }

    // ----- capacity checks (throw on limit reached) -----

    @Transactional(readOnly = true)
    public void requireAvailableLearnerSeat(Long enterpriseId) {
        InstitutionalLicense license = requireActiveLicense(enterpriseId);
        int limit = seatLimit(license, planEntitlements(license));
        checkCapacity("LEARNER_SEAT_LIMIT_REACHED", seatsUsed(enterpriseId), limit,
                "The institutional learner-seat limit has been reached.");
    }

    @Transactional(readOnly = true)
    public void requireAvailableGroupCapacity(Long enterpriseId) {
        InstitutionalLicense license = requireActiveLicense(enterpriseId);
        int limit = limit(license.getCustomGroupLimit(), planEntitlements(license), Entitlements.GROUP_LIMIT);
        checkCapacity("GROUP_LIMIT_REACHED", groupsUsed(enterpriseId), limit,
                "The institutional group limit has been reached.");
    }

    @Transactional(readOnly = true)
    public void requireAvailableAuthorityCapacity(Long enterpriseId) {
        InstitutionalLicense license = requireActiveLicense(enterpriseId);
        int limit = limit(license.getCustomAuthorityLimit(), planEntitlements(license), Entitlements.AUTHORITY_LIMIT);
        checkCapacity("AUTHORITY_LIMIT_REACHED", authoritiesUsed(enterpriseId), limit,
                "The institutional authority limit has been reached.");
    }

    @Transactional(readOnly = true)
    public void requireAvailableCertificationCapacity(Long enterpriseId) {
        InstitutionalLicense license = requireActiveLicense(enterpriseId);
        int limit = limit(license.getCustomCertificationLimit(), planEntitlements(license),
                Entitlements.CERTIFICATION_ALLOCATION_LIMIT);
        checkCapacity("CERTIFICATION_ALLOCATION_LIMIT_REACHED", certificationsUsed(enterpriseId), limit,
                "The institutional certification-allocation limit has been reached.");
    }

    // ----- internals -----

    private InstitutionalLicense requireActiveLicense(Long enterpriseId) {
        return getActiveLicense(enterpriseId).orElseThrow(() ->
                new InstitutionalEntitlementRequiredException(
                        "INSTITUTIONAL_LICENSE",
                        "This organization does not have an active institutional license."));
    }

    private Map<String, PlanEntitlement> planEntitlements(InstitutionalLicense license) {
        return planEntitlementRepository
                .findBySubscriptionPlan_SubscriptionPlanId(license.getSubscriptionPlan().getSubscriptionPlanId())
                .stream()
                .filter(PlanEntitlement::isEnabled)
                .collect(Collectors.toMap(PlanEntitlement::getEntitlementCode, entitlement -> entitlement,
                        (existing, ignored) -> existing));
    }

    private int seatsUsed(Long enterpriseId) {
        return (int) orgCertLearnerRepository.countDistinctActiveLearners(
                enterpriseId, OrganizationCertificationLearner.Status.active);
    }

    private int groupsUsed(Long enterpriseId) {
        return (int) groupRepository.countByEnterprise_EnterpriseIdAndStatus(
                enterpriseId, EnterpriseGroup.Status.active);
    }

    private int authoritiesUsed(Long enterpriseId) {
        return (int) authorityRepository.countDistinctActiveAuthorities(
                enterpriseId, EnterpriseGroupAuthority.Status.active);
    }

    private int certificationsUsed(Long enterpriseId) {
        return (int) orgCertificateRepository.countByEnterprise_EnterpriseIdAndStatus(
                enterpriseId, OrganizationCertificate.Status.active);
    }

    private int seatLimit(InstitutionalLicense license, Map<String, PlanEntitlement> entitlements) {
        return limit(license.getCustomSeatLimit(), entitlements, Entitlements.SEAT_LIMIT);
    }

    /** Custom contract override wins; otherwise the plan's limit; else 0. */
    private int limit(Integer customLimit, Map<String, PlanEntitlement> entitlements, String code) {
        if (customLimit != null) {
            return customLimit;
        }
        PlanEntitlement entitlement = entitlements.get(code);
        return entitlement != null && entitlement.getLimitValue() != null ? entitlement.getLimitValue() : 0;
    }

    private void checkCapacity(String code, int used, int limit, String message) {
        if (used >= limit) {
            throw new CapacityLimitReachedException(code, limit, used, message);
        }
    }

    private UsageMetricDto metric(String code, int used, int limit) {
        return new UsageMetricDto(code, used, limit);
    }
}
