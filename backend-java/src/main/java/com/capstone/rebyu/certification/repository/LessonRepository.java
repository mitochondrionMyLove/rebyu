package com.capstone.rebyu.certification.repository;

import com.capstone.rebyu.certification.entity.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LessonRepository extends JpaRepository<Lesson, Long> {
    List<Lesson> findByMiddleCategory_MiddleCategoryId(Long middleCategoryId);

    List<Lesson> findByMiddleCategory_MajorCategory_Certification_CertificationId(Long certificationId);
}
