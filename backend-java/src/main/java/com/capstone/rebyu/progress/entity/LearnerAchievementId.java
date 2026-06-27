package com.capstone.rebyu.progress.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serial;
import java.io.Serializable;

@Embeddable
@Data
@EqualsAndHashCode(callSuper = false)
public class LearnerAchievementId implements Serializable {
    @Column(name = "learner_id", nullable = false)
    private Long learnerId;

    @Column(name = "achievement_id", nullable = false)
    private Long achievementId;

    @Serial
    private static final long serialVersionUID = 1L;
}
