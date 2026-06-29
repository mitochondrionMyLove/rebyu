package com.capstone.rebyu.challenge.entity;


import com.capstone.rebyu.user.entity.Learner;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "challenge_sessions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChallengeSession {

    public enum Status {
        in_progress, passed, failed, abandoned
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long challengeSessionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "challenge_mode_id", nullable = false)
    private ChallengeMode challengeMode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "learner_id", nullable = false)
    private Learner learner;

    @Column(name = "started_at", nullable = false)
    private LocalDateTime startedAt;

    @Column(name = "ended_at")
    private LocalDateTime endedAt;

    @Column(precision = 5, scale = 2)
    private BigDecimal score;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Status status = Status.in_progress;
}
