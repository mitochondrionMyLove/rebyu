package com.capstone.rebyu.billing.entitlement;

/**
 * Canonical entitlement codes. These match the seeded plan_entitlements rows.
 * Centralized so feature checks never rely on scattered string literals.
 */
public final class Entitlements {

    private Entitlements() {
    }

    // Free (individual) features
    public static final String CERTIFICATION_BROWSING = "CERTIFICATION_BROWSING";
    public static final String LESSON_ACCESS = "LESSON_ACCESS";
    public static final String BASIC_LEARNING = "BASIC_LEARNING";
    public static final String BASIC_COMPLETION_TRACKING = "BASIC_COMPLETION_TRACKING";

    // Premium (individual / institution-sponsored) learner features
    public static final String DETAILED_PROGRESS = "DETAILED_PROGRESS";
    public static final String PROGRESS_ANALYTICS = "PROGRESS_ANALYTICS";
    public static final String MASTERY_ANALYTICS = "MASTERY_ANALYTICS";
    public static final String WEAKNESS_ANALYSIS = "WEAKNESS_ANALYSIS";
    public static final String PERSONALIZED_STUDY_PLAN = "PERSONALIZED_STUDY_PLAN";
    public static final String MOCK_EXAM_ACCESS = "MOCK_EXAM_ACCESS";
    public static final String BATTLES_ACCESS = "BATTLES_ACCESS";
    public static final String CHALLENGES_ACCESS = "CHALLENGES_ACCESS";
    public static final String READINESS_ANALYSIS = "READINESS_ANALYSIS";
    public static final String ADVANCED_RECOMMENDATIONS = "ADVANCED_RECOMMENDATIONS";

    // Institutional management features
    public static final String GROUP_MANAGEMENT = "GROUP_MANAGEMENT";
    public static final String AUTHORITY_MANAGEMENT = "AUTHORITY_MANAGEMENT";
    public static final String LEARNER_ASSIGNMENT = "LEARNER_ASSIGNMENT";
    public static final String BASIC_MONITORING = "BASIC_MONITORING";
    public static final String DETAILED_GROUP_ANALYTICS = "DETAILED_GROUP_ANALYTICS";
    public static final String EXPORT_REPORTS = "EXPORT_REPORTS";
    public static final String ORG_WIDE_ANALYTICS = "ORG_WIDE_ANALYTICS";
    public static final String AUDIT_LOGS = "AUDIT_LOGS";

    // Institutional capacity limits (limit_value carries the number)
    public static final String SEAT_LIMIT = "SEAT_LIMIT";
    public static final String CERTIFICATION_ALLOCATION_LIMIT = "CERTIFICATION_ALLOCATION_LIMIT";
    public static final String GROUP_LIMIT = "GROUP_LIMIT";
    public static final String AUTHORITY_LIMIT = "AUTHORITY_LIMIT";
    public static final String ORG_ADMIN_LIMIT = "ORG_ADMIN_LIMIT";
}
