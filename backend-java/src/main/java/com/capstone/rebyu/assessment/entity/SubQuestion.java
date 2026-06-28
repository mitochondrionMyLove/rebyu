package com.capstone.rebyu.assessment.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "sub_questions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubQuestion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long subQuestionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "no_choice_question_id", nullable = false)
    private NoChoiceQuestion noChoiceQuestion;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String questionText;
}
