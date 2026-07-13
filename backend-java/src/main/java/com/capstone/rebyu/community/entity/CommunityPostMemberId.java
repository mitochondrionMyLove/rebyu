package com.capstone.rebyu.community.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.io.Serial;
import java.io.Serializable;

/** Shared (post_id, learner_id) composite key shape for likes and saves. */
@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
public class CommunityPostMemberId implements Serializable {

    @Column(name = "post_id", nullable = false)
    private Long postId;

    @Column(name = "learner_id", nullable = false)
    private Long learnerId;

    @Serial
    private static final long serialVersionUID = 1L;
}
