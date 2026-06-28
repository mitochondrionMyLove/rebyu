package com.capstone.rebyu.challenge.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "challenge_mode_industries")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChallengeModeIndustry {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long challengeModeIndustriesId;

    @Column(nullable = false, length = 100)
    private String industry;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "challenge_mode_id", nullable = false)
    private ChallengeMode challengeMode;
}
