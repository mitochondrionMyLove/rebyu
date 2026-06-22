package com.capstone.rebyu.repositories;

import com.capstone.rebyu.models.LearnerLessonMastery;
import com.capstone.rebyu.models.LearnerLessonMasteryId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LearnerLessonMasteryRepository extends JpaRepository<LearnerLessonMastery, LearnerLessonMasteryId> {
}
