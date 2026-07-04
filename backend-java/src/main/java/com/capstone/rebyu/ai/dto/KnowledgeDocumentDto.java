package com.capstone.rebyu.ai.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class KnowledgeDocumentDto {
    private Long knowledgeDocumentId;
    private String originalFilename;
    private String contentType;
    private Long fileSize;
    private Integer chunkCount;
    private String status;
    private LocalDateTime uploadedAt;
    private LocalDateTime processedAt;
    private Long certificationId;
    private String useCase;
}
