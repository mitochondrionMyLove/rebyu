package com.capstone.rebyu.assessment.entity;

import com.capstone.rebyu.certification.entity.Lesson;
import com.capstone.rebyu.user.entity.Learner;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "learner_exam_details")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LearnerExamDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long learnerExamDetailId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "learner_id", nullable = false)
    private Learner learner;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exam_id", nullable = false)
    private Exam exam;

    @Column(name = "attempt_no", nullable = false)
    private Integer attemptNo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exam_question_id", nullable = false)
    private ExamQuestion examQuestion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    private Question question;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lesson_id", nullable = false)
    private Lesson lesson;

    @Column(name = "user_answer", nullable = false, length = 500)
    private String userAnswer;

    @Column(nullable = false)
    private Boolean result;

    @Column(name = "answered_at", nullable = false)
    private LocalDateTime answeredAt;

    @Column(name = "earned_score", precision = 5, scale = 2)
    private BigDecimal earnedScore;
}
