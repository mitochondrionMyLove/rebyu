package com.capstone.rebyu.assessment.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "no_choice_questions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NoChoiceQuestion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long noChoiceQuestionId;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String questionText;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String answerText;

    @Column(name = "image_key", length = 255)
    private String imageKey;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String explanation;

    @Column(name = "difficulty_level", nullable = false, length = 10)
    private String difficultyLevel;

    @Column(name = "question_type", nullable = false, length = 30)
    private String questionType;

    @OneToMany(mappedBy = "noChoiceQuestion", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SubQuestion> subQuestions;
}
