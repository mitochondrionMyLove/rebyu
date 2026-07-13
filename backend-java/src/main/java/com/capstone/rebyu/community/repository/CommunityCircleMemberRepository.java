package com.capstone.rebyu.community.repository;

import com.capstone.rebyu.community.entity.CommunityCircleMember;
import com.capstone.rebyu.community.entity.CommunityCircleMemberId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommunityCircleMemberRepository
        extends JpaRepository<CommunityCircleMember, CommunityCircleMemberId> {

    long countByCircle_CircleId(Long circleId);

    boolean existsByCircle_CircleIdAndLearner_LearnerId(Long circleId, Long learnerId);
}
