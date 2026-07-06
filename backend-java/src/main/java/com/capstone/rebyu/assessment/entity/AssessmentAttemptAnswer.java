package com.capstone.rebyu.assessment.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * A learner's answer to one attempt question. Correctness and points are set
 * only by server-side scoring; learner-supplied values are never trusted.
 */
@Entity
@Table(
        name = "assessment_attempt_answers",
        uniqueConstraints = @UniqueConstraint(
                name = "uq_attempt_answer_question",
                columnNames = {"assessment_attempt_id", "attempt_question_id"}
        )
)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssessmentAttemptAnswer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long attemptAnswerId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assessment_attempt_id", nullable = false)
    private AssessmentAttempt attempt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "attempt_question_id", nullable = false)
    private AssessmentAttemptQuestion attemptQuestion;

    /** Free-text answer (short answer, descriptive, sub-question JSON). */
    @Column(name = "learner_answer", columnDefinition = "TEXT")
    private String learnerAnswer;

    @Column(name = "selected_choice_id")
    private Long selectedChoiceId;

    @Column(name = "submitted_code", columnDefinition = "TEXT")
    private String submittedCode;

    @Column(name = "programming_language", length = 30)
    private String programmingLanguage;

    @Column(name = "diagram_submission_data", columnDefinition = "TEXT")
    private String diagramSubmissionData;

    /** Null until scored; stays null for pending manual evaluation. */
    @Column(name = "is_correct")
    private Boolean isCorrect;

    @Column(name = "earned_points", precision = 5, scale = 2)
    private BigDecimal earnedPoints;

    @Column(name = "pending_manual_evaluation", nullable = false)
    private boolean pendingManualEvaluation = false;

    @Column(name = "answered_at")
    private LocalDateTime answeredAt;
}
