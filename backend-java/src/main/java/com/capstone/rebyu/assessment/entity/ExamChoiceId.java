package com.capstone.rebyu.assessment.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serial;
import java.io.Serializable;

@Embeddable
@Data
@EqualsAndHashCode(callSuper = false)
public class ExamChoiceId implements Serializable {
    @Column(name = "exam_question_id", nullable = false)
    private Long examQuestionId;

    @Column(name = "choice_id", nullable = false)
    private Long choiceId;

    @Serial
    private static final long serialVersionUID = 1L;
}
