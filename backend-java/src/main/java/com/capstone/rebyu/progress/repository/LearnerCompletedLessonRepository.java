package com.capstone.rebyu.progress.repository;

import com.capstone.rebyu.progress.entity.LearnerCompletedLesson;
import com.capstone.rebyu.progress.entity.LearnerCompletedLessonId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LearnerCompletedLessonRepository extends JpaRepository<LearnerCompletedLesson, LearnerCompletedLessonId> {
}
