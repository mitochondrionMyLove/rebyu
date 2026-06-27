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
@Table(name = "learner_lesson_mastery")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LearnerLessonMastery {

    public enum MasteryLevel {
        WEAK, DEVELOPING, GOOD, MASTERED
    }

    @EmbeddedId
    private LearnerLessonMasteryId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "learner_id")
    @MapsId("learnerId")
    private Learner learner;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lesson_id")
    @MapsId("lessonId")
    private Lesson lesson;

    @Column(name = "mastery_probability", nullable = false)
    private Double masteryProbability = 0.0;

    @Enumerated(EnumType.STRING)
    @Column(name = "mastery_level", nullable = false, length = 20)
    private MasteryLevel masteryLevel;

    @Column(name = "last_updated", nullable = false)
    private LocalDateTime lastUpdated;
}
