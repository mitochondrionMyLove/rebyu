package com.capstone.rebyu.certification.repository;

import com.capstone.rebyu.certification.entity.LessonVideo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LessonVideoRepository extends JpaRepository<LessonVideo, Long> {

    Optional<LessonVideo> findByLessonIdAndToolId(
            Integer lessonId,
            String toolId
    );

    List<LessonVideo> findAllByLessonId(Integer lessonId);
}