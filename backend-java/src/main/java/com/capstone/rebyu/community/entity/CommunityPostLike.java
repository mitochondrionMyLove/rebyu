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
@Table(name = "community_post_likes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommunityPostLike {

    @EmbeddedId
    private CommunityPostMemberId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("postId")
    @JoinColumn(name = "post_id")
    private CommunityPost post;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("learnerId")
    @JoinColumn(name = "learner_id")
    private Learner learner;

    @Column(name = "created_at", nullable = false)
    @Builder.Default
    private OffsetDateTime createdAt = OffsetDateTime.now();
}
