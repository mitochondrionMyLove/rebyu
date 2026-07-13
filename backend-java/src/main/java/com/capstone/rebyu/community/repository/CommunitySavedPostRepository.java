package com.capstone.rebyu.community.repository;

import com.capstone.rebyu.community.entity.CommunityPostMemberId;
import com.capstone.rebyu.community.entity.CommunitySavedPost;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommunitySavedPostRepository extends JpaRepository<CommunitySavedPost, CommunityPostMemberId> {

    boolean existsByPost_PostIdAndLearner_LearnerId(Long postId, Long learnerId);

    void deleteByPost_PostIdAndLearner_LearnerId(Long postId, Long learnerId);

    List<CommunitySavedPost> findByLearner_LearnerIdOrderByCreatedAtDesc(Long learnerId);
}
