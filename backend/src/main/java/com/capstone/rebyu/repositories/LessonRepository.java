package com.capstone.rebyu.repositories;

import com.capstone.rebyu.models.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LessonRepository extends JpaRepository<Lesson, Long> {
}
