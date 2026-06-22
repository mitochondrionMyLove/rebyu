package com.capstone.rebyu.models;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serial;
import java.io.Serializable;

@Embeddable
@Data
@EqualsAndHashCode(callSuper = false)
public class LearnerCertificationId implements Serializable {
    @Column(name = "learner_id", nullable = false)
    private Long learnerId;

    @Column(name = "certification_id", nullable = false)
    private Long certificationId;

    @Serial
    private static final long serialVersionUID = 1L;
}
