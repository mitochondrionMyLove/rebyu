package com.capstone.rebyu.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "challenge_sessions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChallengeSession {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long challengeSessionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "challenge_mode_id")
    private ChallengeMode challengeMode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "learner_id")
    private Learner learner;

    @Column(name = "started_time", nullable = false)
    private LocalDateTime startedTime;

    @Column(name = "ended_time")
    private LocalDateTime endedTime;

    private Integer score;

    @Column(length = 20)
    private String status; // PASSED or FAILED
}
