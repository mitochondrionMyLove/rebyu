package com.capstone.rebyu.ai.service;

import com.capstone.rebyu.ai.assistant.QuestionGenerationAssistant;
import com.capstone.rebyu.ai.dto.AiQuestionGenerationRequest;
import com.capstone.rebyu.ai.dto.GeneratedQuestionDraftDto;
import com.capstone.rebyu.ai.entity.KnowledgeDocument;
import com.capstone.rebyu.certification.entity.Certification;
import com.capstone.rebyu.certification.entity.Lesson;
import com.capstone.rebyu.certification.repository.CertificationRepository;
import com.capstone.rebyu.certification.repository.LessonRepository;
import com.capstone.rebyu.ai.common.InvalidAiGeneratedQuestionException;
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
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
public class QuestionGenerationService {

    private static final int MAX_DOC_CHARS = 10_000;
    private static final int MAX_QUESTIONS_PER_TYPE = 50;
    private static final java.util.Set<String> SUPPORTED_TYPES = java.util.Set.of(
            "MCQ", "SHORT_ANSWER", "DESCRIPTIVE", "PROGRAMMING", "DIAGRAM"
    );

    record LessonRef(Long lessonId, String title) {}
    record CertContext(String certTitle, Map<Long, LessonRef> lessonsById) {}

    private final LessonRepository lessonRepository;
    private final CertificationRepository certificationRepository;
    private final DocumentIngestionService documentIngestionService;
    private final QuestionGenerationAssistant questionGenerationAssistant;
    private final ContentRetriever questionContentRetriever;
    private final AiUploadValidator aiUploadValidator;
    private final GeneratedQuestionDraftValidator generatedQuestionDraftValidator;
    private final ObjectMapper objectMapper;

    public QuestionGenerationService(
            LessonRepository lessonRepository,
            CertificationRepository certificationRepository,
            DocumentIngestionService documentIngestionService,
            QuestionGenerationAssistant questionGenerationAssistant,
            @Qualifier("questionContentRetriever") ContentRetriever questionContentRetriever,
            AiUploadValidator aiUploadValidator,
            GeneratedQuestionDraftValidator generatedQuestionDraftValidator,
            ObjectMapper objectMapper
    ) {
        this.lessonRepository = lessonRepository;
        this.certificationRepository = certificationRepository;
        this.documentIngestionService = documentIngestionService;
        this.questionGenerationAssistant = questionGenerationAssistant;
        this.questionContentRetriever = questionContentRetriever;
        this.aiUploadValidator = aiUploadValidator;
        this.generatedQuestionDraftValidator = generatedQuestionDraftValidator;
        this.objectMapper = objectMapper;
    }

    public List<GeneratedQuestionDraftDto> generateDrafts(
            AiQuestionGenerationRequest request,
            List<MultipartFile> files
    ) throws IOException {
        Map<String, Integer> requestedCounts = normalizeCounts(request.getQuestionCounts());
        aiUploadValidator.validate(files);

        CertContext ctx = loadCertificationContext(request.getCertificationId());
        if (ctx.lessonsById().isEmpty()) {
            throw new IllegalArgumentException(
                    "The selected certification has no lessons yet. Add lessons before generating questions."
            );
        }

        StringBuilder rawText = new StringBuilder();
        for (MultipartFile file : files) {
            if (file != null && !file.isEmpty()) {
                rawText.append(documentIngestionService.extractDocumentText(file)).append("\n\n");
                documentIngestionService.ingest(file, request.getCertificationId(), KnowledgeDocument.UseCase.QUESTION);
            }
        }
        aiUploadValidator.requireReadableText(rawText.toString());

        String referenceContext = buildReferenceContext(ctx, rawText.toString());
        String requestJson = buildRequestJson(request, ctx, requestedCounts);

        log.info("Generating question drafts for certificationId={} with counts {}",
                request.getCertificationId(), requestedCounts);

        List<GeneratedQuestionDraftDto> generatedDrafts;
        try {
            generatedDrafts = questionGenerationAssistant.generateQuestions(requestJson, referenceContext);
        } catch (Exception e) {
            log.error("Failed to deserialize AI question draft response for certificationId={}. Error: {}",
                    request.getCertificationId(), e.getMessage(), e);
            throw new InvalidAiGeneratedQuestionException(
                    "The AI returned invalid question drafts. Please check the format and try again.",
                    e
            );
        }

        generatedQuestionDraftValidator.validate(generatedDrafts, requestedCounts, ctx.lessonsById());

        log.info("Generated {} question draft(s) for certificationId={}",
                generatedDrafts.size(), request.getCertificationId());
        return generatedDrafts;
    }

    @Transactional(readOnly = true)
    public CertContext loadCertificationContext(Long certificationId) {
        Certification cert = certificationRepository.findById(certificationId)
                .orElseThrow(() -> new EntityNotFoundException("Certification not found: " + certificationId));

        Map<Long, LessonRef> lessons = new LinkedHashMap<>();
        for (Lesson lesson : lessonRepository
                .findByMiddleCategory_MajorCategory_Certification_CertificationId(certificationId)) {
            lessons.put(lesson.getLessonId(), new LessonRef(lesson.getLessonId(), lesson.getName()));
        }
        return new CertContext(cert.getTitle(), lessons);
    }

    private Map<String, Integer> normalizeCounts(Map<String, Integer> counts) {
        if (counts == null || counts.isEmpty()) {
            throw new IllegalArgumentException("At least one question count is required.");
        }

        Map<String, Integer> normalized = new LinkedHashMap<>();
        for (Map.Entry<String, Integer> entry : counts.entrySet()) {
            String type = entry.getKey() == null ? "" : entry.getKey().trim().toUpperCase(Locale.ROOT);
            int count = entry.getValue() == null ? 0 : entry.getValue();

            if (count == 0) {
                continue;
            }
            if (!SUPPORTED_TYPES.contains(type)) {
                throw new IllegalArgumentException("Unsupported question type: " + entry.getKey());
            }
            if (count < 0 || count > MAX_QUESTIONS_PER_TYPE) {
                throw new IllegalArgumentException(
                        "Question count for " + type + " must be between 1 and " + MAX_QUESTIONS_PER_TYPE + "."
                );
            }
            normalized.put(type, count);
        }

        if (normalized.isEmpty()) {
            throw new IllegalArgumentException("Request at least one question for any question type.");
        }
        return normalized;
    }

    private String buildRequestJson(
            AiQuestionGenerationRequest request,
            CertContext ctx,
            Map<String, Integer> requestedCounts
    ) throws IOException {
        List<Map<String, Object>> availableLessons = ctx.lessonsById().values().stream()
                .map(l -> Map.<String, Object>of("lessonId", l.lessonId(), "lessonTitle", l.title()))
                .toList();

        Map<String, Object> requestData = new LinkedHashMap<>();
        requestData.put("certificationId", request.getCertificationId());
        requestData.put("certificationTitle", ctx.certTitle());
        requestData.put("availableLessons", availableLessons);
        requestData.put("questionCounts", requestedCounts);
        if (request.getAdditionalInstructions() != null && !request.getAdditionalInstructions().isBlank()) {
            requestData.put("additionalInstructions", request.getAdditionalInstructions());
        }
        return objectMapper.writeValueAsString(requestData);
    }

    private String buildReferenceContext(CertContext ctx, String extractedText) {
        String documentText = extractedText.length() > MAX_DOC_CHARS
                ? extractedText.substring(0, MAX_DOC_CHARS)
                : extractedText;

        String retrieved = "";
        try {
            List<Content> contents = questionContentRetriever.retrieve(Query.from(ctx.certTitle()));
            retrieved = contents.stream()
                    .map(c -> c.textSegment().text())
                    .collect(Collectors.joining("\n\n---\n\n"));
        } catch (Exception e) {
            log.warn("Reference retrieval failed for question generation: {}", e.getMessage());
        }

        if (retrieved.isBlank()) {
            return documentText;
        }
        return documentText + "\n\n--- Related reference material ---\n\n" + retrieved;
    }

}
