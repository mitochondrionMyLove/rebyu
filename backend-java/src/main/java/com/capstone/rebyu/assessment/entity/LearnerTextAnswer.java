package com.capstone.rebyu.assessment.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "learner_text_answers")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LearnerTextAnswer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long learnerTextAnswerId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "learner_exam_detail_id", nullable = false, unique = true)
    private LearnerExamDetail learnerExamDetail;

    @Column(name = "answer_text", nullable = false, columnDefinition = "TEXT")
    private String answerText;
}
