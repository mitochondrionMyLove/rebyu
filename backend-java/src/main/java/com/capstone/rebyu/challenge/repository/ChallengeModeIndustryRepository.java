package com.capstone.rebyu.challenge.repository;

import com.capstone.rebyu.challenge.entity.ChallengeModeIndustry;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChallengeModeIndustryRepository extends JpaRepository<ChallengeModeIndustry, Long> {
    List<ChallengeModeIndustry> findByChallengeMode_ChallengeModeId(Long challengeModeId);
}
