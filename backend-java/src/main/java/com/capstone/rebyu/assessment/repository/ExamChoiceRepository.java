package com.capstone.rebyu.assessment.repository;

import com.capstone.rebyu.assessment.entity.ExamChoice;
import com.capstone.rebyu.assessment.entity.ExamChoiceId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExamChoiceRepository extends JpaRepository<ExamChoice, ExamChoiceId> {
}
