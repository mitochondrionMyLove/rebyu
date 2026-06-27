package com.capstone.rebyu.assessment.repository;

import com.capstone.rebyu.assessment.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuestionRepository extends JpaRepository<Question, Long> {
}
