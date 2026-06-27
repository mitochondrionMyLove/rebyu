package com.capstone.rebyu.progress.repository;

import com.capstone.rebyu.progress.entity.LearnerLessonMastery;
import com.capstone.rebyu.progress.entity.LearnerLessonMasteryId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LearnerLessonMasteryRepository extends JpaRepository<LearnerLessonMastery, LearnerLessonMasteryId> {
}
