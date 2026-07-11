package com.capstone.rebyu.assessment.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * One rubric line for a subjectively-graded question (diagram / descriptive).
 * Learner-safe to expose the name and max points; awarded points and feedback
 * are only revealed after evaluation and when the assessment allows it.
 */
@Entity
@Table(name = "question_rubric_criteria")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuestionRubricCriterion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "rubric_criterion_id")
    private Long rubricCriterionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    private Question question;

    @Column(name = "name", nullable = false, length = 150)
    private String name;

    @Column(name = "max_points", nullable = false, precision = 5, scale = 2)
    private BigDecimal maxPoints = BigDecimal.ONE;

    @Column(name = "display_order", nullable = false)
    private Integer displayOrder = 1;
}
