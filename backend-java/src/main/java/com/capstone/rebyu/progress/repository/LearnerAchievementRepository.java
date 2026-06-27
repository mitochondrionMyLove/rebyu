package com.capstone.rebyu.progress.repository;

import com.capstone.rebyu.progress.entity.LearnerAchievement;
import com.capstone.rebyu.progress.entity.LearnerAchievementId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LearnerAchievementRepository extends JpaRepository<LearnerAchievement, LearnerAchievementId> {
}
