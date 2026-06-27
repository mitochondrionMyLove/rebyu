package com.capstone.rebyu.certification.repository;

import com.capstone.rebyu.certification.entity.LessonImage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LessonImageRepository extends JpaRepository<LessonImage, Long> {

    Optional<LessonImage> findByLessonIdAndToolId(
            Integer lessonId,
            String toolId
    );

    List<LessonImage> findAllByLessonId(Integer lessonId);
}