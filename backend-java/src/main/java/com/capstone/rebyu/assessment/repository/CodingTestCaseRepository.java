package com.capstone.rebyu.assessment.repository;

import com.capstone.rebyu.assessment.entity.CodingTestCase;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CodingTestCaseRepository extends JpaRepository<CodingTestCase, Long> {
    List<CodingTestCase> findByNoChoiceQuestion_NoChoiceQuestionId(Long noChoiceQuestionId);
}
