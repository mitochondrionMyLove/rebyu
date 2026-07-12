package com.capstone.rebyu.diagram.dto;

import java.math.BigDecimal;
import java.util.List;

/**
 * Deterministic (non-AI) diagram grading result. {@code status}:
 * GRADED (a real score was computed — may still be 0 for a blank/weak
 * submission), EMPTY_SUBMISSION (nothing meaningful was drawn — a
 * definitive, fair 0), or INVALID_REFERENCE (the admin's reference diagram
 * has no gradeable nodes — never penalize the learner for that; the caller
 * leaves the answer pending rather than fabricating a score).
 * {@code elementResults} never echoes reference label text — only enough to
 * audit which required element matched, in case this is ever surfaced later.
 */
public record DiagramGradingResultDto(
        String status,
        BigDecimal earnedPoints,
        BigDecimal maxPoints,
        String feedback,
        List<ElementResultDto> elementResults
) {
    public record ElementResultDto(
            String kind,          // NODE | EDGE
            boolean matched,
            String matchQuality,  // STRONG | PARTIAL | WEAK | NONE
            BigDecimal earnedPoints,
            BigDecimal maxPoints
    ) {}
}
