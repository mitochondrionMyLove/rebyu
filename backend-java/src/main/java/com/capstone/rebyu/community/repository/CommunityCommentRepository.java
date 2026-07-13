package com.capstone.rebyu.community.repository;

import com.capstone.rebyu.community.entity.CommunityComment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommunityCommentRepository extends JpaRepository<CommunityComment, Long> {

    List<CommunityComment> findByPost_PostIdOrderByCreatedAtAsc(Long postId);

    long countByPost_PostId(Long postId);
}
