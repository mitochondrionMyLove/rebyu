package com.capstone.rebyu.assessment.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "learner_programming_answers")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LearnerProgrammingAnswer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long learnerProgrammingAnswerId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "learner_exam_detail_id", nullable = false, unique = true)
    private LearnerExamDetail learnerExamDetail;

    @Column(name = "programming_language", nullable = false, length = 30)
    private String programmingLanguage;

    @Column(name = "submitted_code", nullable = false, columnDefinition = "TEXT")
    private String submittedCode;
}
