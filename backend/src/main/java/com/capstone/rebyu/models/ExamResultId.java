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
public class ExamResultId implements Serializable {
    @Column(name = "learner_id", nullable = false)
    private Long learnerId;

    @Column(name = "exam_id", nullable = false)
    private Long examId;

    @Column(name = "attempt_no", nullable = false)
    private Integer attemptNo;

    @Serial
    private static final long serialVersionUID = 1L;
}
