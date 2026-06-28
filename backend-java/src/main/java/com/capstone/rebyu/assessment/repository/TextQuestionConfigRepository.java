package com.capstone.rebyu.assessment.repository;

import com.capstone.rebyu.assessment.entity.TextQuestionConfig;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TextQuestionConfigRepository extends JpaRepository<TextQuestionConfig, Long> {
    Optional<TextQuestionConfig> findByQuestion_QuestionId(Long questionId);
}
