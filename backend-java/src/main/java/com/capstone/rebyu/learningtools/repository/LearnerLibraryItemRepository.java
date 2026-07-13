package com.capstone.rebyu.learningtools.repository;

import com.capstone.rebyu.learningtools.entity.LearnerLibraryItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LearnerLibraryItemRepository extends JpaRepository<LearnerLibraryItem, Long> {

    List<LearnerLibraryItem> findByLearner_LearnerIdOrderByCreatedAtDesc(Long learnerId);

    Optional<LearnerLibraryItem> findByLibraryItemIdAndLearner_LearnerId(Long libraryItemId, Long learnerId);

    long deleteByLibraryItemIdAndLearner_LearnerId(Long libraryItemId, Long learnerId);
}
