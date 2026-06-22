package com.capstone.rebyu.repositories;

import com.capstone.rebyu.models.LearnerCompletedLesson;
import com.capstone.rebyu.models.LearnerCompletedLessonId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LearnerCompletedLessonRepository extends JpaRepository<LearnerCompletedLesson, LearnerCompletedLessonId> {
}
