package com.capstone.rebyu.repositories;

import com.capstone.rebyu.models.Question;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuestionRepository extends JpaRepository<Question, Long> {
}
