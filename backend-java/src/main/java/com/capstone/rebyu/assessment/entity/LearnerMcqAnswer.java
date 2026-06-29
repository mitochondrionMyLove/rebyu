package com.capstone.rebyu.assessment.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "learner_mcq_answers")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LearnerMcqAnswer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long learnerMcqAnswerId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "learner_exam_detail_id", nullable = false)
    private LearnerExamDetail learnerExamDetail;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exam_question_id", nullable = false)
    private ExamQuestion examQuestion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "choice_id", nullable = false)
    private Choice choice;
}
