package com.capstone.rebyu.progress.entity;



import com.capstone.rebyu.certification.entity.Lesson;
import com.capstone.rebyu.user.entity.Learner;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "learner_weak_areas")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WeakArea {

    public enum WeaknessLevel{
        LOW, MODERATE, HIGH
    }
    @EmbeddedId
    private WeakAreaId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "learner_id")
    @MapsId("learnerId")
    private Learner learner;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lesson_id")
    @MapsId("lessonId")
    private Lesson lesson;

    private int totalAttempts;
    private int correctCount;
    private int incorrectCount;
    private double accuracyRate;
    private Double masteryProbability;

    @Enumerated(EnumType.STRING)
    private WeaknessLevel weaknessLevel;

    private LocalDateTime lastUpdated;





}
