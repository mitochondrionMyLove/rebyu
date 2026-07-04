package com.capstone.rebyu.ai.repository;

import com.capstone.rebyu.ai.entity.KnowledgeDocument;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface KnowledgeDocumentRepository extends JpaRepository<KnowledgeDocument, Long> {
    List<KnowledgeDocument> findByStatus(KnowledgeDocument.DocumentStatus status);
}
