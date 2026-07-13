package com.capstone.rebyu.community.repository;

import com.capstone.rebyu.community.entity.CommunityCircle;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommunityCircleRepository extends JpaRepository<CommunityCircle, Long> {

    List<CommunityCircle> findAllByOrderByCreatedAtDesc();
}
