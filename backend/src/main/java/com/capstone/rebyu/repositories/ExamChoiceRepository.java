package com.capstone.rebyu.repositories;

import com.capstone.rebyu.models.ExamChoice;
import com.capstone.rebyu.models.ExamChoiceId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExamChoiceRepository extends JpaRepository<ExamChoice, ExamChoiceId> {
}
