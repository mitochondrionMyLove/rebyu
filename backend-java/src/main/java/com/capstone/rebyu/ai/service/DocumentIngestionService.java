package com.capstone.rebyu.ai.service;

import com.capstone.rebyu.ai.dto.KnowledgeDocumentDto;
import com.capstone.rebyu.ai.entity.KnowledgeDocument;
import com.capstone.rebyu.ai.entity.KnowledgeDocumentImage;
import com.capstone.rebyu.ai.mapper.KnowledgeDocumentMapper;
import com.capstone.rebyu.ai.repository.KnowledgeDocumentImageRepository;
import com.capstone.rebyu.ai.repository.KnowledgeDocumentRepository;
import dev.langchain4j.data.document.Document;
import dev.langchain4j.data.document.DocumentParser;
import dev.langchain4j.data.document.DocumentSplitter;
import dev.langchain4j.data.document.Metadata;
import dev.langchain4j.data.document.parser.TextDocumentParser;
import dev.langchain4j.data.document.parser.apache.pdfbox.ApachePdfBoxDocumentParser;
import dev.langchain4j.data.document.parser.apache.poi.ApachePoiDocumentParser;
import dev.langchain4j.data.document.splitter.DocumentSplitters;
import dev.langchain4j.data.embedding.Embedding;
import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.store.embedding.EmbeddingStore;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Slf4j
@Service
@Transactional
public class DocumentIngestionService {

    /** Matches the [SOURCE_IMAGE key="..." page=N order=N] markers QuestionSourceImageService inlines into text. */
    private static final Pattern SOURCE_IMAGE_MARKER =
            Pattern.compile("\\[SOURCE_IMAGE key=\"([^\"]+)\"[^]]*]");

    private final KnowledgeDocumentRepository knowledgeDocumentRepository;
    private final KnowledgeDocumentImageRepository knowledgeDocumentImageRepository;
    private final KnowledgeDocumentMapper knowledgeDocumentMapper;
    private final QuestionSourceImageService questionSourceImageService;
    private final EmbeddingModel embeddingModel;
    private final EmbeddingStore<TextSegment> lessonEmbeddingStore;
    private final EmbeddingStore<TextSegment> questionEmbeddingStore;
    private final S3Client s3Client;
    private final JdbcTemplate jdbcTemplate;
    private final String bucketName;

    public DocumentIngestionService(
            KnowledgeDocumentRepository knowledgeDocumentRepository,
            KnowledgeDocumentImageRepository knowledgeDocumentImageRepository,
            KnowledgeDocumentMapper knowledgeDocumentMapper,
            QuestionSourceImageService questionSourceImageService,
            EmbeddingModel embeddingModel,
            @Qualifier("lessonEmbeddingStore") EmbeddingStore<TextSegment> lessonEmbeddingStore,
            @Qualifier("questionEmbeddingStore") EmbeddingStore<TextSegment> questionEmbeddingStore,
            S3Client s3Client,
            JdbcTemplate jdbcTemplate,
            @Value("${aws.s3.bucket-name}") String bucketName
    ) {
        this.knowledgeDocumentRepository = knowledgeDocumentRepository;
        this.knowledgeDocumentImageRepository = knowledgeDocumentImageRepository;
        this.knowledgeDocumentMapper = knowledgeDocumentMapper;
        this.questionSourceImageService = questionSourceImageService;
        this.embeddingModel = embeddingModel;
        this.lessonEmbeddingStore = lessonEmbeddingStore;
        this.questionEmbeddingStore = questionEmbeddingStore;
        this.s3Client = s3Client;
        this.jdbcTemplate = jdbcTemplate;
        this.bucketName = bucketName;
    }

    public KnowledgeDocumentDto ingest(MultipartFile file, Long certificationId, KnowledgeDocument.UseCase useCase) throws IOException {
        KnowledgeDocument doc = KnowledgeDocument.builder()
                .filename(UUID.randomUUID() + "_" + file.getOriginalFilename())
                .originalFilename(file.getOriginalFilename())
                .contentType(file.getContentType())
                .fileSize(file.getSize())
                .certificationId(certificationId)
                .useCase(useCase)
                .status(KnowledgeDocument.DocumentStatus.PROCESSING)
                .uploadedAt(LocalDateTime.now())
                .build();
        doc = knowledgeDocumentRepository.save(doc);

        try {
            String s3Key = "ai-documents/" + doc.getFilename();

            byte[] bytes = file.getBytes();

            s3Client.putObject(
                    PutObjectRequest.builder()
                            .bucket(bucketName)
                            .key(s3Key)
                            .contentType(file.getContentType())
                            .build(),
                    RequestBody.fromBytes(bytes)
            );

            // Text-only extraction stays the existing behavior for every file
            // type; PDF/DOCX additionally get embedded images extracted and
            // marker-tagged in the text (same mechanism as per-request
            // question-generation uploads) so images can be linked to chunks.
            DocumentParser parser = resolveParser(file.getContentType());
            String fallbackText = parser.parse(new ByteArrayInputStream(bytes)).text();
            QuestionSourceImageService.ExtractedSource extracted =
                    questionSourceImageService.extract(file, fallbackText);

            Metadata metadata = new Metadata();
            metadata.put("documentId", String.valueOf(doc.getKnowledgeDocumentId()));
            metadata.put("filename", doc.getOriginalFilename());
            if (certificationId != null) {
                metadata.put("certificationId", String.valueOf(certificationId));
            }
            Document document = Document.from(extracted.text(), metadata);

            DocumentSplitter splitter = DocumentSplitters.recursive(500, 50);
            List<TextSegment> segments = attachImageLinksAndStripMarkers(splitter.split(document));

            EmbeddingStore<TextSegment> targetStore = useCase == KnowledgeDocument.UseCase.QUESTION
                    ? questionEmbeddingStore : lessonEmbeddingStore;

            List<Embedding> embeddings = embeddingModel.embedAll(segments).content();
            addEmbeddingsInBatches(embeddings, segments, targetStore, 20);

            persistExtractedImages(doc, extracted.images());

            doc.setS3Key(s3Key);
            doc.setChunkCount(segments.size());
            doc.setStatus(KnowledgeDocument.DocumentStatus.READY);
            doc.setProcessedAt(LocalDateTime.now());
            doc = knowledgeDocumentRepository.save(doc);

            log.info("Ingested document '{}' into {} chunks", doc.getOriginalFilename(), segments.size());
        } catch (Exception e) {
            log.error("Failed to ingest document '{}'", doc.getOriginalFilename(), e);
            doc.setStatus(KnowledgeDocument.DocumentStatus.FAILED);
            knowledgeDocumentRepository.save(doc);
            throw e;
        }

        return knowledgeDocumentMapper.toDto(doc);
    }

    public List<KnowledgeDocumentDto> ingestAll(List<MultipartFile> files, Long certificationId, KnowledgeDocument.UseCase useCase) throws IOException {
        List<KnowledgeDocumentDto> results = new ArrayList<>();
        for (MultipartFile file : files) {
            results.add(ingest(file, certificationId, useCase));
        }
        return results;
    }

    @Transactional(readOnly = true)
    public List<KnowledgeDocumentDto> getAll() {
        return knowledgeDocumentRepository.findAll().stream()
                .map(knowledgeDocumentMapper::toDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public KnowledgeDocumentDto getById(Long id) {
        return knowledgeDocumentMapper.toDto(findEntity(id));
    }

    public void delete(Long id) {
        KnowledgeDocument doc = findEntity(id);

        if (doc.getS3Key() != null) {
            s3Client.deleteObject(DeleteObjectRequest.builder()
                    .bucket(bucketName)
                    .key(doc.getS3Key())
                    .build());
        }

        // Extracted images are stored separately from the document's own S3
        // object and are never referenced by the embeddings DELETE below, so
        // clean their S3 objects up explicitly; the DB rows cascade with the
        // document via the FK.
        for (KnowledgeDocumentImage image :
                knowledgeDocumentImageRepository.findByKnowledgeDocument_KnowledgeDocumentId(id)) {
            s3Client.deleteObject(DeleteObjectRequest.builder()
                    .bucket(bucketName)
                    .key(image.getImageKey())
                    .build());
        }

        String embeddingsTable = doc.getUseCase() == KnowledgeDocument.UseCase.QUESTION
                ? "question_embeddings" : "lesson_embeddings";
        jdbcTemplate.update(
                "DELETE FROM " + embeddingsTable + " WHERE metadata->>'documentId' = ?",
                id.toString()
        );

        knowledgeDocumentRepository.delete(doc);
        log.info("Deleted document id={}", id);
    }

    private void addEmbeddingsInBatches(List<Embedding> embeddings, List<TextSegment> segments,
                                         EmbeddingStore<TextSegment> store, int batchSize) {
        for (int i = 0; i < embeddings.size(); i += batchSize) {
            int end = Math.min(i + batchSize, embeddings.size());
            store.addAll(embeddings.subList(i, end), segments.subList(i, end));
            log.debug("Stored embedding batch {}-{} of {}", i, end, embeddings.size());
        }
    }

    /**
     * Links each chunk to the images that fell within it: scans every
     * segment for [SOURCE_IMAGE key="..."] markers, records the keys found
     * as a comma-joined "imageKeys" metadata entry (so retrieval can pull
     * images together with their chunk without storing image data in the
     * embedding itself), and strips the marker syntax out of the embedded/
     * searchable text. Segments without any marker are returned unchanged.
     */
    private List<TextSegment> attachImageLinksAndStripMarkers(List<TextSegment> rawSegments) {
        List<TextSegment> result = new ArrayList<>(rawSegments.size());
        for (TextSegment segment : rawSegments) {
            Matcher matcher = SOURCE_IMAGE_MARKER.matcher(segment.text());
            Set<String> keysInSegment = new LinkedHashSet<>();
            while (matcher.find()) {
                keysInSegment.add(matcher.group(1));
            }
            if (keysInSegment.isEmpty()) {
                result.add(segment);
                continue;
            }
            String cleaned = SOURCE_IMAGE_MARKER.matcher(segment.text()).replaceAll("").trim();
            Metadata metadata = segment.metadata().copy();
            metadata.put("imageKeys", String.join(",", keysInSegment));
            result.add(TextSegment.from(cleaned.isBlank() ? segment.text() : cleaned, metadata));
        }
        return result;
    }

    private void persistExtractedImages(
            KnowledgeDocument doc, List<QuestionSourceImageService.ExtractedImage> images) {
        LocalDateTime now = LocalDateTime.now();
        for (QuestionSourceImageService.ExtractedImage image : images) {
            knowledgeDocumentImageRepository.save(KnowledgeDocumentImage.builder()
                    .knowledgeDocument(doc)
                    .imageKey(image.key())
                    .contentType(image.contentType())
                    .pageNumber(image.page())
                    .orderInPage(image.order())
                    .nearbyText(image.nearbyText())
                    .createdAt(now)
                    .build());
        }
        if (!images.isEmpty()) {
            log.info("Linked {} image(s) to document '{}'", images.size(), doc.getOriginalFilename());
        }
    }

    public String extractDocumentText(MultipartFile file) throws IOException {
        DocumentParser parser = resolveParser(file.getContentType());
        Document document = parser.parse(new ByteArrayInputStream(file.getBytes()));
        return document.text();
    }

    private KnowledgeDocument findEntity(Long id) {
        return knowledgeDocumentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("KnowledgeDocument not found: " + id));
    }

    private DocumentParser resolveParser(String contentType) {
        if (contentType == null) return new TextDocumentParser();
        return switch (contentType) {
            case "application/pdf" -> new ApachePdfBoxDocumentParser();
            case "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                 "application/msword" -> new ApachePoiDocumentParser();
            default -> new TextDocumentParser();
        };
    }
}
