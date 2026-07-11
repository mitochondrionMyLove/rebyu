package com.capstone.rebyu.assessment.repository;

import com.capstone.rebyu.assessment.entity.Exam;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExamRepository extends JpaRepository<Exam, Long> {
    List<Exam> findByCertification_CertificationId(Long certificationId);
}
