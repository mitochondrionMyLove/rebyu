package com.capstone.rebyu.assessment.repository;

import com.capstone.rebyu.assessment.entity.DiagramQuestionConfig;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DiagramQuestionConfigRepository extends JpaRepository<DiagramQuestionConfig, Long> {
    Optional<DiagramQuestionConfig> findByQuestion_QuestionId(Long questionId);
}
