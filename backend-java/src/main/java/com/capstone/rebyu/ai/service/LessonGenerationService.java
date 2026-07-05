package com.capstone.rebyu.ai.service;

import com.capstone.rebyu.ai.assistant.LessonGenerationAssistant;
import com.capstone.rebyu.ai.dto.AILessonStructureDTO;
import com.capstone.rebyu.ai.entity.KnowledgeDocument;
import com.capstone.rebyu.certification.dto.LessonComponentResponseDto;
import com.capstone.rebyu.certification.entity.Lesson;
import com.capstone.rebyu.certification.entity.MajorCategory;
import com.capstone.rebyu.certification.entity.MiddleCategory;
import com.capstone.rebyu.certification.repository.LessonRepository;
import com.capstone.rebyu.common.InvalidAiResponseException;
import com.fasterxml.jackson.databind.ObjectMapper;
import dev.langchain4j.rag.content.Content;
import dev.langchain4j.rag.content.retriever.ContentRetriever;
import dev.langchain4j.rag.query.Query;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
public class LessonGenerationService {

    private static final int MAX_DOC_CHARS = 10_000;

    record LessonContext(Long lessonId, String lessonTitle, String middleTitle,
                         String majorTitle, String certTitle, Long certId) {}

    private final LessonRepository lessonRepository;
    private final DocumentIngestionService documentIngestionService;
    private final LessonGenerationAssistant lessonGenerationAssistant;
    private final ContentRetriever lessonContentRetriever;
    private final LessonEmbeddingService lessonEmbeddingService;
    private final AiUploadValidator aiUploadValidator;
    private final LessonContentValidator lessonContentValidator;
    private final ObjectMapper objectMapper;

    @Autowired @Lazy
    private LessonGenerationService self;

    public LessonGenerationService(
            LessonRepository lessonRepository,
            DocumentIngestionService documentIngestionService,
            LessonGenerationAssistant lessonGenerationAssistant,
            @Qualifier("lessonContentRetriever") ContentRetriever lessonContentRetriever,
            LessonEmbeddingService lessonEmbeddingService,
            AiUploadValidator aiUploadValidator,
            LessonContentValidator lessonContentValidator,
            ObjectMapper objectMapper
    ) {
        this.lessonRepository = lessonRepository;
        this.documentIngestionService = documentIngestionService;
        this.lessonGenerationAssistant = lessonGenerationAssistant;
        this.lessonContentRetriever = lessonContentRetriever;
        this.lessonEmbeddingService = lessonEmbeddingService;
        this.aiUploadValidator = aiUploadValidator;
        this.lessonContentValidator = lessonContentValidator;
        this.objectMapper = objectMapper;
    }







    public LessonComponentResponseDto generateAndSave(
            Long lessonId,
            List<MultipartFile> files,
            String additionalInstructions
    ) throws IOException {
        aiUploadValidator.validate(files);

        LessonContext ctx = self.loadLessonContext(lessonId);

        StringBuilder rawText = new StringBuilder();
        for (MultipartFile file : files) {
            if (file != null && !file.isEmpty()) {
                rawText.append(documentIngestionService.extractDocumentText(file)).append("\n\n");
                documentIngestionService.ingest(file, ctx.certId(), KnowledgeDocument.UseCase.LESSON);
            }
        }
        aiUploadValidator.requireReadableText(rawText.toString());

        String referenceContext = buildReferenceContext(ctx, rawText.toString());

        Map<String, Object> requestData = new LinkedHashMap<>();
        requestData.put("lessonId", ctx.lessonId());
        requestData.put("lessonTitle", ctx.lessonTitle());
        requestData.put("middleCategoryTitle", ctx.middleTitle());
        requestData.put("majorCategoryTitle", ctx.majorTitle());
        requestData.put("certificationTitle", ctx.certTitle());
        if (additionalInstructions != null && !additionalInstructions.isBlank()) {
            requestData.put("additionalInstructions", additionalInstructions);
        }
        String requestJson = objectMapper.writeValueAsString(requestData);

        log.info("Generating lesson structure for lessonId={} ({})", lessonId, ctx.lessonTitle());
        AILessonStructureDTO clean = generateValidatedStructure(requestJson, referenceContext, lessonId);

        String structureJson;
        try {
            structureJson = objectMapper.writeValueAsString(clean.getSections());
        } catch (Exception e) {
            throw new InvalidAiResponseException("The AI returned lesson content that could not be serialized.", e);
        }

        self.saveGeneratedStructure(lessonId, structureJson);
        log.info("Saved generated lesson for lessonId={} with {} sections",
                lessonId, clean.getSections().size());

        lessonEmbeddingService.embedLessonContent(lessonId, ctx.certId(), ctx.lessonTitle(), structureJson);

        return new LessonComponentResponseDto(structureJson, Map.of(), Map.of());
    }

    @Transactional(readOnly = true)
    public LessonContext loadLessonContext(Long lessonId) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new EntityNotFoundException("Lesson not found: " + lessonId));

        MiddleCategory mid = lesson.getMiddleCategory();
        MajorCategory major = mid.getMajorCategory();
        String certTitle = major.getCertification() != null ? major.getCertification().getTitle() : "";
        Long certId = major.getCertification() != null ? major.getCertification().getCertificationId() : null;

        return new LessonContext(lesson.getLessonId(), lesson.getName(),
                mid.getTitle(), major.getTitle(), certTitle, certId);
    }

    @Transactional
    public void saveGeneratedStructure(Long lessonId, String structureJson) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new EntityNotFoundException("Lesson not found: " + lessonId));
        lesson.setLessonComponentStructure(structureJson);
        lessonRepository.save(lesson);
    }






    private AILessonStructureDTO generateValidatedStructure(
            String requestJson,
            String referenceContext,
            Long lessonId
    ) {
        InvalidAiResponseException lastError = null;

        for (int attempt = 1; attempt <= 2; attempt++) {
            AILessonStructureDTO structure =
                    lessonGenerationAssistant.generateLesson(requestJson, referenceContext);
            AILessonStructureDTO clean = lessonContentValidator.ensureRequiredTools(
                    lessonContentValidator.sanitize(structure)
            );

            try {
                lessonContentValidator.validate(clean);
                return clean;
            } catch (InvalidAiResponseException e) {
                lastError = e;
                log.warn("Attempt {}/2 for lessonId={} rejected: {} — returned shape: {}",
                        attempt, lessonId, e.getMessage(),
                        lessonContentValidator.describeStructure(structure));
            }
        }

        throw lastError;
    }

    private String buildReferenceContext(LessonContext ctx, String extractedText) {
        String documentText = extractedText.length() > MAX_DOC_CHARS
                ? extractedText.substring(0, MAX_DOC_CHARS)
                : extractedText;

        String queryText = String.join(" ", ctx.certTitle(), ctx.majorTitle(), ctx.middleTitle(), ctx.lessonTitle());
        String retrieved = "";
        try {
            List<Content> contents = lessonContentRetriever.retrieve(Query.from(queryText));
            retrieved = contents.stream()
                    .map(c -> c.textSegment().text())
                    .collect(Collectors.joining("\n\n---\n\n"));
        } catch (Exception e) {
            log.warn("Reference retrieval failed for lessonId={}: {}", ctx.lessonId(), e.getMessage());
        }

        if (retrieved.isBlank()) {
            return documentText;
        }
        return documentText + "\n\n--- Related reference material ---\n\n" + retrieved;
    }
}
