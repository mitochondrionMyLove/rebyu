package com.capstone.rebyu.certification.repository;

import com.capstone.rebyu.certification.entity.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface LessonRepository extends JpaRepository<Lesson, Long> {
    List<Lesson> findByMiddleCategory_MiddleCategoryId(Long middleCategoryId);

    List<Lesson> findByMiddleCategory_MajorCategory_Certification_CertificationId(Long certificationId);

    @Query("SELECT l FROM Lesson l " +
            "JOIN FETCH l.middleCategory mc " +
            "JOIN FETCH mc.majorCategory maj " +
            "WHERE maj.certification.certificationId = :certificationId")
    List<Lesson> findAllWithCategoriesByCertificationId(@Param("certificationId") Long certificationId);
}
