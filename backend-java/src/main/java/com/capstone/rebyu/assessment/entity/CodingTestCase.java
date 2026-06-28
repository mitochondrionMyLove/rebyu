package com.capstone.rebyu.assessment.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "coding_test_cases")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CodingTestCase {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long codingTestCaseId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "no_choice_question_id", nullable = false)
    private NoChoiceQuestion noChoiceQuestion;

    @Column(name = "test_case", nullable = false, length = 100)
    private String testCase;
}
