package com.capstone.rebyu.assessment.entity;


import com.capstone.rebyu.certification.entity.Lesson;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "questions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long questionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_question_id")
    private Question parentQuestion;

    @Column(name = "question_type", nullable = false, length = 30)
    private String questionType;

    @Column(name = "difficulty_level", nullable = false, length = 10)
    private String difficultyLevel;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String questionText;

    @Column(name = "image_key", length = 255)
    private String imageKey;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lesson_id", nullable = false)
    private Lesson lesson;

    @Column(name = "total_points", nullable = false, columnDefinition = "numeric(5,2) DEFAULT 1")
    private BigDecimal totalPoints = BigDecimal.ONE;

    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Choice> choices = new ArrayList<>();
}
