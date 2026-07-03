package com.capstone.rebyu.assessment.entity;


import com.capstone.rebyu.certification.entity.Lesson;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "questions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@ToString(onlyExplicitlyIncluded = true)
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    @ToString.Include
    private Long questionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_question_id")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Question parentQuestion;

    @ToString.Include
    @Column(name = "question_type", nullable = false, length = 30)
    private String questionType;

    @ToString.Include
    @Column(name = "difficulty_level", nullable = false, length = 10)
    private String difficultyLevel;

    @ToString.Include
    @Column(nullable = false, columnDefinition = "TEXT")
    private String questionText;

    @Column(name = "image_key", length = 255)
    private String imageKey;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lesson_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Lesson lesson;

    @ToString.Include
    @Column(name = "total_points", nullable = false, precision = 5, scale = 2)
    private BigDecimal totalPoints = BigDecimal.ONE;

    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<Choice> choices = new ArrayList<>();
}
