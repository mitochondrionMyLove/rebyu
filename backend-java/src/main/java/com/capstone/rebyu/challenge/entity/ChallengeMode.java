package com.capstone.rebyu.challenge.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "challenge_modes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChallengeMode {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long challengeModeId;

    @Column(nullable = false, unique = true, length = 100)
    private String name;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "is_timed", nullable = false)
    private boolean isTimed = false;

    @OneToMany(mappedBy = "challengeMode", fetch = FetchType.LAZY)
    private List<ChallengeSession> challengeSessions;
}
