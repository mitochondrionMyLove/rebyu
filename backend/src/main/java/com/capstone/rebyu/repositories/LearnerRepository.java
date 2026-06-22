package com.capstone.rebyu.repositories;

import com.capstone.rebyu.models.Learner;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LearnerRepository extends JpaRepository<Learner, Long> {
}
