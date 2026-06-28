package com.capstone.rebyu.assessment.repository;

import com.capstone.rebyu.assessment.entity.ProgrammingQuestionConfig;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProgrammingQuestionConfigRepository extends JpaRepository<ProgrammingQuestionConfig, Long> {
    Optional<ProgrammingQuestionConfig> findByQuestion_QuestionId(Long questionId);
}
