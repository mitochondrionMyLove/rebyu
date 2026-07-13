package com.capstone.rebyu.community.repository;

import com.capstone.rebyu.community.entity.CommunityPostLike;
import com.capstone.rebyu.community.entity.CommunityPostMemberId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommunityPostLikeRepository extends JpaRepository<CommunityPostLike, CommunityPostMemberId> {

    long countByPost_PostId(Long postId);

    boolean existsByPost_PostIdAndLearner_LearnerId(Long postId, Long learnerId);

    void deleteByPost_PostIdAndLearner_LearnerId(Long postId, Long learnerId);
}
