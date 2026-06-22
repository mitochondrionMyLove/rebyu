package com.capstone.rebyu.repositories;

import com.capstone.rebyu.models.LearnerAchievement;
import com.capstone.rebyu.models.LearnerAchievementId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LearnerAchievementRepository extends JpaRepository<LearnerAchievement, LearnerAchievementId> {
}
