package com.capstone.rebyu.assessment.repository;

import com.capstone.rebyu.assessment.entity.SubQuestion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SubQuestionRepository extends JpaRepository<SubQuestion, Long> {
    List<SubQuestion> findByNoChoiceQuestion_NoChoiceQuestionId(Long noChoiceQuestionId);
}
