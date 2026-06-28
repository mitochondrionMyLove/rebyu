package com.capstone.rebyu.assessment.repository;

import com.capstone.rebyu.assessment.entity.ProgrammingTestCase;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProgrammingTestCaseRepository extends JpaRepository<ProgrammingTestCase, Long> {
    List<ProgrammingTestCase> findByProgrammingQuestionConfig_ProgrammingQuestionConfigId(Long configId);
}
