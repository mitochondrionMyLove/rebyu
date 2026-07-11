package com.capstone.rebyu.certification.dto;

import java.util.List;

/**
 * Structured publishing readiness for a certification (spec §30). Drives the
 * admin publishing checklist and gates the Publish Certification action.
 * `missingRequirements` = a required assessment does not exist; `invalidRequirements`
 * = an existing assessment is not ready.
 */
public record CertificationPublishRequirementsDto(
        boolean publishable,
        List<MissingRequirementDto> missingRequirements,
        List<InvalidRequirementDto> invalidRequirements
) {
    public record MissingRequirementDto(
            String type,
            Long scopeId,
            String title,
            String reason
    ) {
    }

    public record InvalidRequirementDto(
            Long examId,
            String title,
            String reason,
            List<Long> affectedQuestionIds
    ) {
    }
}
