package com.capstone.rebyu.repositories;

import com.capstone.rebyu.models.ExamResult;
import com.capstone.rebyu.models.ExamResultId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExamResultRepository extends JpaRepository<ExamResult, ExamResultId> {
}
