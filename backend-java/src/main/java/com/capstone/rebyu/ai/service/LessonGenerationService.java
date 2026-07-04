package com.capstone.rebyu.ai.service;

import com.capstone.rebyu.ai.assistant.LessonGenerationAssistant;
import com.capstone.rebyu.ai.dto.AILessonStructureDTO;
import com.capstone.rebyu.ai.dto.LessonSectionDTO;
import com.capstone.rebyu.ai.dto.LessonToolDTO;
import com.capstone.rebyu.ai.entity.KnowledgeDocument;
import com.capstone.rebyu.certification.dto.LessonComponentResponseDto;
import com.capstone.rebyu.certification.entity.Lesson;
import com.capstone.rebyu.certification.entity.MajorCategory;
import com.capstone.rebyu.certification.entity.MiddleCategory;
import com.capstone.rebyu.certification.repository.LessonRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import dev.langchain4j.rag.content.Content;
import dev.langchain4j.rag.content.retriever.ContentRetriever;
import dev.langchain4j.rag.query.Query;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Service
@Transactional
public class LessonGenerationService {

    private static final Set<String> MEDIA_TOOL_TYPES = Set.of("image", "video", "image-left-text", "image-right-text");

    private final LessonRepository lessonRepository;
    private final DocumentIngestionService documentIngestionService;
    private final LessonGenerationAssistant lessonGenerationAssistant;
    private final ContentRetriever lessonContentRetriever;
    private final LessonEmbeddingService lessonEmbeddingService;
    private final ObjectMapper objectMapper;

    public LessonGenerationService(
            LessonRepository lessonRepository,
            DocumentIngestionService documentIngestionService,
            LessonGenerationAssistant lessonGenerationAssistant,
            @Qualifier("lessonContentRetriever") ContentRetriever lessonContentRetriever,
            LessonEmbeddingService lessonEmbeddingService,
            ObjectMapper objectMapper
    ) {
        this.lessonRepository = lessonRepository;
        this.documentIngestionService = documentIngestionService;
        this.lessonGenerationAssistant = lessonGenerationAssistant;
        this.lessonContentRetriever = lessonContentRetriever;
        this.lessonEmbeddingService = lessonEmbeddingService;
        this.objectMapper = objectMapper;
    }

    public LessonComponentResponseDto generateAndSave(
            Long lessonId,
            List<MultipartFile> files,
            String additionalInstructions
    ) throws IOException {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new EntityNotFoundException("Lesson not found: " + lessonId));

        // Navigate lazy chain within transaction to get certification context
        MiddleCategory mid = lesson.getMiddleCategory();
        MajorCategory major = mid.getMajorCategory();
        String certTitle = major.getCertification() != null ? major.getCertification().getTitle() : "";
        Long certId = major.getCertification() != null ? major.getCertification().getCertificationId() : null;

        // Ingest uploaded files into the lesson embedding store
        if (files != null) {
            for (MultipartFile file : files) {
                if (file != null && !file.isEmpty()) {
                    log.info("Ingesting file '{}' for lesson {}", file.getOriginalFilename(), lessonId);
                    documentIngestionService.ingest(file, certId, KnowledgeDocument.UseCase.LESSON);
                }
            }
        }

        // Retrieve relevant context from lesson embeddings
        String queryText = String.join(" ", certTitle, major.getTitle(), mid.getTitle(), lesson.getName());
        List<Content> contents = lessonContentRetriever.retrieve(Query.from(queryText));
        String referenceContext = contents.stream()
                .map(c -> c.textSegment().text())
                .collect(Collectors.joining("\n\n---\n\n"));

        if (referenceContext.isBlank()) {
            referenceContext = "No uploaded reference documents available. Generate based on the topic and your knowledge.";
        }

        // Build the generation request
        Map<String, Object> requestData = new LinkedHashMap<>();
        requestData.put("lessonId", lessonId);
        requestData.put("lessonTitle", lesson.getName());
        requestData.put("middleCategoryTitle", mid.getTitle());
        requestData.put("majorCategoryTitle", major.getTitle());
        requestData.put("certificationTitle", certTitle);
        if (additionalInstructions != null && !additionalInstructions.isBlank()) {
            requestData.put("additionalInstructions", additionalInstructions);
        }
        String requestJson = objectMapper.writeValueAsString(requestData);

        log.info("Generating lesson structure for lessonId={} ({})", lessonId, lesson.getName());
        AILessonStructureDTO structure = lessonGenerationAssistant.generateLesson(requestJson, referenceContext);

        // Strip any media tools the AI may have included despite instructions
        AILessonStructureDTO clean = stripMediaTools(structure);
        String structureJson = objectMapper.writeValueAsString(clean);

        lesson.setLessonComponentStructure(structureJson);
        lessonRepository.save(lesson);
        log.info("Saved generated lesson for lessonId={} with {} sections", lessonId,
                clean.getSections() != null ? clean.getSections().size() : 0);

        lessonEmbeddingService.embedLessonContent(lessonId, certId, lesson.getName(), structureJson);

        // Images and videos are empty — user uploads them separately via /api/files/upload
        return new LessonComponentResponseDto(structureJson, Map.of(), Map.of());
    }

    private AILessonStructureDTO stripMediaTools(AILessonStructureDTO structure) {
        if (structure == null || structure.getSections() == null) {
            return new AILessonStructureDTO(List.of());
        }
        List<LessonSectionDTO> cleaned = structure.getSections().stream()
                .map(section -> {
                    List<LessonToolDTO> tools = section.getContent() == null
                            ? List.of()
                            : section.getContent().stream()
                                    .filter(t -> t.getType() != null && !MEDIA_TOOL_TYPES.contains(t.getType()))
                                    .map(t -> {
                                        if (t.getData() == null) return t;
                                        Map<String, Object> data = new LinkedHashMap<>(t.getData());
                                        data.remove("imageKey");
                                        data.remove("videoKey");
                                        data.values().removeIf(v -> v == null);
                                        return new LessonToolDTO(t.getId(), t.getType(), data);
                                    })
                                    .toList();
                    return new LessonSectionDTO(section.getId(), section.getSectionName(), tools);
                })
                .toList();
        return new AILessonStructureDTO(cleaned);
    }
}
