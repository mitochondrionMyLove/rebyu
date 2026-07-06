package com.capstone.rebyu.ai.service;

import com.capstone.rebyu.ai.assistant.LessonGenerationAssistant;
import com.capstone.rebyu.ai.collector.LessonDraftCollector;
import com.capstone.rebyu.ai.context.LessonGenerationExecutionContext;
import com.capstone.rebyu.ai.context.LessonGenerationExecutionContext.SourceChunk;
import com.capstone.rebyu.ai.dto.GeneratedLessonSectionDraftDto;
import com.capstone.rebyu.ai.dto.LessonGenerationDraftResponseDto;
import com.capstone.rebyu.ai.dto.LessonGenerationDraftResponseDto.LessonGenerationAnalysisDto;
import com.capstone.rebyu.ai.entity.KnowledgeDocument;
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
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
public class LessonGenerationService {

    private static final int MAX_DOC_CHARS = 10_000;
    private static final int MAX_CHUNK_CHARS = 2_500;

    record LessonContext(Long lessonId, String lessonTitle, String middleTitle,
                         String majorTitle, String certTitle, Long certId) {}

    private final LessonRepository lessonRepository;
    private final DocumentIngestionService documentIngestionService;
    private final LessonGenerationAssistant lessonGenerationAssistant;
    private final ContentRetriever lessonContentRetriever;
    private final AiUploadValidator aiUploadValidator;
    private final LessonToolDraftValidator lessonToolDraftValidator;
    private final LessonDraftCollector lessonDraftCollector;
    private final LessonGenerationExecutionContext generationExecutionContext;
    private final LessonDraftJsonParser lessonDraftJsonParser;
    private final ObjectMapper objectMapper;

    // Self-proxy so @Transactional on loadLessonContext is honored (a direct
    // call would be self-invocation and bypass the transaction).
    @org.springframework.beans.factory.annotation.Autowired
    @org.springframework.context.annotation.Lazy
    private LessonGenerationService self;

    public LessonGenerationService(
            LessonRepository lessonRepository,
            DocumentIngestionService documentIngestionService,
            LessonGenerationAssistant lessonGenerationAssistant,
            @Qualifier("lessonContentRetriever") ContentRetriever lessonContentRetriever,
            AiUploadValidator aiUploadValidator,
            LessonToolDraftValidator lessonToolDraftValidator,
            LessonDraftCollector lessonDraftCollector,
            LessonGenerationExecutionContext generationExecutionContext,
            LessonDraftJsonParser lessonDraftJsonParser,
            ObjectMapper objectMapper
    ) {
        this.lessonRepository = lessonRepository;
        this.documentIngestionService = documentIngestionService;
        this.lessonGenerationAssistant = lessonGenerationAssistant;
        this.lessonContentRetriever = lessonContentRetriever;
        this.aiUploadValidator = aiUploadValidator;
        this.lessonToolDraftValidator = lessonToolDraftValidator;
        this.lessonDraftCollector = lessonDraftCollector;
        this.generationExecutionContext = generationExecutionContext;
        this.lessonDraftJsonParser = lessonDraftJsonParser;
        this.objectMapper = objectMapper;
    }

    public LessonGenerationDraftResponseDto generateDrafts(
            Long lessonId,
            List<MultipartFile> files,
            String additionalInstructions
    ) throws IOException {
        aiUploadValidator.validate(files);

        LessonContext ctx = self.loadLessonContext(lessonId);
        List<String> warnings = new ArrayList<>();

        StringBuilder rawText = new StringBuilder();
        int uploadedFiles = 0;
        for (MultipartFile file : files) {
            if (file != null && !file.isEmpty()) {
                uploadedFiles++;
                rawText.append(documentIngestionService.extractDocumentText(file)).append("\n\n");
                documentIngestionService.ingest(file, ctx.certId(), KnowledgeDocument.UseCase.LESSON);
            }
        }
        aiUploadValidator.requireReadableText(rawText.toString());

        String retrievedKnowledge = retrieveRelatedKnowledge(ctx);
        List<SourceChunk> sourceChunks = buildSourceChunks(rawText.toString(), retrievedKnowledge);

        lessonDraftCollector.clear();
        generationExecutionContext.clear();
        generationExecutionContext.initialize(sourceChunks);

        Map<String, Object> requestData = new LinkedHashMap<>();
        requestData.put("lessonId", ctx.lessonId());
        requestData.put("lessonTitle", ctx.lessonTitle());
        requestData.put("middleCategoryTitle", ctx.middleTitle());
        requestData.put("majorCategoryTitle", ctx.majorTitle());
        requestData.put("certificationTitle", ctx.certTitle());
        requestData.put("availableSourceChunks", sourceChunks.stream()
                .map(chunk -> Map.of("sourceChunkId", chunk.id()))
                .toList());
        if (additionalInstructions != null && !additionalInstructions.isBlank()) {
            requestData.put("additionalInstructions", additionalInstructions);
        }
        String requestJson = objectMapper.writeValueAsString(requestData);
        String referenceContext = generationExecutionContext.formatForPrompt();

        log.info("Generating lesson draft for lessonId={} ({})", lessonId, ctx.lessonTitle());

        List<GeneratedLessonSectionDraftDto> sections = null;
        for (int attempt = 1; attempt <= 2 && (sections == null || sections.isEmpty()); attempt++) {
            String raw = lessonGenerationAssistant.generateLessonDraft(requestJson, referenceContext);
            sections = lessonDraftJsonParser.parseSections(raw, warnings);
            if (sections.isEmpty()) {
                log.warn("Attempt {}/2 produced no lesson sections for lessonId={}; raw excerpt: {}",
                        attempt, lessonId,
                        raw == null ? "null"
                                : raw.substring(0, Math.min(raw.length(), 500)));
            }
        }
        if (sections == null || sections.isEmpty()) {
            throw new InvalidAiResponseException("The AI did not create any lesson sections.");
        }
        lessonToolDraftValidator.validateCollectedDrafts(sections);

        int toolCount = sections.stream()
                .mapToInt(section -> section.content() == null ? 0 : section.content().size())
                .sum();

        log.info("Generated lesson draft for lessonId={} with {} sections and {} tools",
                lessonId, sections.size(), toolCount);

        return new LessonGenerationDraftResponseDto(
                sections,
                new LessonGenerationAnalysisDto(
                        ctx.lessonId(),
                        ctx.lessonTitle(),
                        sections.size(),
                        toolCount,
                        sourceChunks.size(),
                        uploadedFiles
                ),
                List.copyOf(warnings)
        );
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

    private String retrieveRelatedKnowledge(LessonContext ctx) {
        String queryText = String.join(" ", ctx.certTitle(), ctx.majorTitle(), ctx.middleTitle(), ctx.lessonTitle());
        try {
            List<Content> contents = lessonContentRetriever.retrieve(Query.from(queryText));
            return contents.stream()
                    .map(c -> c.textSegment().text())
                    .collect(Collectors.joining("\n\n---\n\n"));
        } catch (Exception e) {
            log.warn("Reference retrieval failed for lessonId={}: {}", ctx.lessonId(), e.getMessage());
            return "";
        }
    }

    private List<SourceChunk> buildSourceChunks(String extractedText, String retrievedKnowledge) {
        List<SourceChunk> chunks = new ArrayList<>();
        int chunkIndex = 1;

        String documentText = extractedText.length() > MAX_DOC_CHARS
                ? extractedText.substring(0, MAX_DOC_CHARS)
                : extractedText;

        for (String part : splitIntoChunks(documentText)) {
            if (!part.isBlank()) {
                chunks.add(new SourceChunk("chunk-" + chunkIndex++, part.trim()));
            }
        }

        if (retrievedKnowledge != null && !retrievedKnowledge.isBlank()) {
            for (String part : splitIntoChunks(retrievedKnowledge)) {
                if (!part.isBlank()) {
                    chunks.add(new SourceChunk("chunk-" + chunkIndex++, part.trim()));
                }
            }
        }

        return chunks;
    }

    private List<String> splitIntoChunks(String text) {
        if (text == null || text.isBlank()) {
            return List.of();
        }

        List<String> chunks = new ArrayList<>();
        String remaining = text.trim();

        while (!remaining.isEmpty()) {
            if (remaining.length() <= MAX_CHUNK_CHARS) {
                chunks.add(remaining);
                break;
            }

            int splitAt = findSplitPoint(remaining, MAX_CHUNK_CHARS);
            chunks.add(remaining.substring(0, splitAt).trim());
            remaining = remaining.substring(splitAt).trim();
        }

        return chunks;
    }

    private int findSplitPoint(String text, int maxLength) {
        int preferred = Math.min(maxLength, text.length());
        int paragraphBreak = text.lastIndexOf("\n\n", preferred);
        if (paragraphBreak >= preferred / 2) {
            return paragraphBreak;
        }

        int sentenceBreak = Math.max(
                text.lastIndexOf(". ", preferred),
                Math.max(text.lastIndexOf("! ", preferred), text.lastIndexOf("? ", preferred))
        );
        if (sentenceBreak >= preferred / 2) {
            return sentenceBreak + 1;
        }

        int spaceBreak = text.lastIndexOf(' ', preferred);
        if (spaceBreak >= preferred / 2) {
            return spaceBreak;
        }

        return preferred;
    }
}
