package com.capstone.rebyu.assessment.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "exam_choices")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExamChoice {
    @EmbeddedId
    private ExamChoiceId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exam_question_id")
    @MapsId("examQuestionId")
    private ExamQuestion examQuestion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "choice_id")
    @MapsId("choiceId")
    private Choice choice;

    @Column(name = "display_order", nullable = false)
    private Integer displayOrder;
}
