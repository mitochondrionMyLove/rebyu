package com.capstone.rebyu.challenge.repository;

import com.capstone.rebyu.challenge.entity.ChallengeSession;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChallengeSessionRepository extends JpaRepository<ChallengeSession, Long> {

    List<ChallengeSession> findByLearner_LearnerId(Long learnerId);
}
