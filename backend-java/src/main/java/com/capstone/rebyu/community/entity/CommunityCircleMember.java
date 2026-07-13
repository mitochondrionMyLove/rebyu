package com.capstone.rebyu.community.entity;

import com.capstone.rebyu.user.entity.Learner;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.OffsetDateTime;

@Entity
@Table(name = "community_circle_members")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommunityCircleMember {

    @EmbeddedId
    private CommunityCircleMemberId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("circleId")
    @JoinColumn(name = "circle_id")
    private CommunityCircle circle;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("learnerId")
    @JoinColumn(name = "learner_id")
    private Learner learner;

    @Column(name = "joined_at", nullable = false)
    @Builder.Default
    private OffsetDateTime joinedAt = OffsetDateTime.now();
}
