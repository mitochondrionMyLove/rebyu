package com.capstone.rebyu.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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

    @Column(columnDefinition = "TEXT")
    private String explanation;
}
