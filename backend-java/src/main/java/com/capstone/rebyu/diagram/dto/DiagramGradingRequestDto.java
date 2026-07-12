package com.capstone.rebyu.diagram.dto;

import java.math.BigDecimal;

/** One diagram to grade: the admin's reference draw.io XML vs. the learner's submission. */
public record DiagramGradingRequestDto(
        String referenceXml,
        String learnerXml,
        BigDecimal maxPoints
) {}
