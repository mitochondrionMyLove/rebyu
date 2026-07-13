package com.capstone.rebyu.community.repository;

import com.capstone.rebyu.community.entity.CommunityPost;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommunityPostRepository extends JpaRepository<CommunityPost, Long> {

    List<CommunityPost> findByPostTypeOrderByCreatedAtDesc(String postType);

    List<CommunityPost> findAllByOrderByCreatedAtDesc();

    long countByAuthor_LearnerId(Long learnerId);
}
