package com.capstone.rebyu.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "exam_results")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExamResult {
    @EmbeddedId
    private ExamResultId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "learner_id")
    @MapsId("learnerId")
    private Learner learner;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exam_id")
    @MapsId("examId")
    private Exam exam;

    @Column(name = "date_taken", nullable = false)
    private LocalDateTime dateTaken;

    @Column(nullable = false)
    private BigDecimal score;

    private Integer duration;

    @Column(nullable = false)
    private boolean result;
}
