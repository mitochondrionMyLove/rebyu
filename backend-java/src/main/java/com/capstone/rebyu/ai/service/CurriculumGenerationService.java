package com.capstone.rebyu.ai.service;

import com.capstone.rebyu.ai.assistant.CurriculumPlanningAssistant;
import com.capstone.rebyu.ai.assistant.LessonGenerationAssistant;
import com.capstone.rebyu.ai.dto.AILessonStructureDTO;
import com.capstone.rebyu.ai.dto.CurriculumLessonDTO;
import com.capstone.rebyu.ai.dto.CurriculumMajorCategoryDTO;
import com.capstone.rebyu.ai.dto.CurriculumMiddleCategoryDTO;
import com.capstone.rebyu.ai.dto.CurriculumPlanDTO;
import com.capstone.rebyu.ai.dto.LessonSectionDTO;
import com.capstone.rebyu.ai.dto.LessonToolDTO;
import com.capstone.rebyu.ai.entity.KnowledgeDocument;
import com.capstone.rebyu.certification.dto.CertificationDto;
import com.capstone.rebyu.certification.entity.Certification;
import com.capstone.rebyu.certification.entity.Lesson;
import com.capstone.rebyu.certification.entity.MajorCategory;
import com.capstone.rebyu.certification.entity.MiddleCategory;
import com.capstone.rebyu.certification.mapper.CertificationMapper;
import com.capstone.rebyu.certification.repository.CertificationRepository;
import com.capstone.rebyu.certification.repository.LessonRepository;
import com.capstone.rebyu.certification.repository.MajorCategoryRepository;
import com.capstone.rebyu.certification.repository.MiddleCategoryRepository;
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
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
public class CurriculumGenerationService {

    private static final List<String> VALID_TOOL_TYPES = List.of(
            "heading", "subheading", "description",
            "unordered-list", "ordered-list",
            "tabs", "accordion", "flip-grid",
            "image", "video", "image-left-text", "image-right-text"
    );
    private static final List<String> MEDIA_TYPES = List.of("image", "video", "image-left-text", "image-right-text");
    private static final int MAX_DOC_CHARS = 10_000;
    private static final int MAX_MAJOR_CATEGORIES = 2;
    private static final int MAX_MIDDLE_CATEGORIES = 2;
    private static final int MAX_LESSONS = 1;

    record LessonCtx(Long lessonId, String lessonTitle, String midTitle, String majorTitle, String certTitle) {}

    private final CertificationRepository certificationRepository;
    private final MajorCategoryRepository majorCategoryRepository;
    private final MiddleCategoryRepository middleCategoryRepository;
    private final LessonRepository lessonRepository;
    private final DocumentIngestionService documentIngestionService;
    private final CurriculumPlanningAssistant curriculumPlanningAssistant;
    private final LessonGenerationAssistant lessonGenerationAssistant;
    private final ContentRetriever lessonContentRetriever;
    private final CertificationMapper certificationMapper;
    private final ObjectMapper objectMapper;
    private final LessonEmbeddingService lessonEmbeddingService;

    @Autowired @Lazy
    private CurriculumGenerationService self;

    public CurriculumGenerationService(
            CertificationRepository certificationRepository,
            MajorCategoryRepository majorCategoryRepository,
            MiddleCategoryRepository middleCategoryRepository,
            LessonRepository lessonRepository,
            DocumentIngestionService documentIngestionService,
            CurriculumPlanningAssistant curriculumPlanningAssistant,
            LessonGenerationAssistant lessonGenerationAssistant,
            @Qualifier("lessonContentRetriever") ContentRetriever lessonContentRetriever,
            CertificationMapper certificationMapper,
            ObjectMapper objectMapper,
            LessonEmbeddingService lessonEmbeddingService
    ) {
        this.certificationRepository = certificationRepository;
        this.majorCategoryRepository = majorCategoryRepository;
        this.middleCategoryRepository = middleCategoryRepository;
        this.lessonRepository = lessonRepository;
        this.documentIngestionService = documentIngestionService;
        this.curriculumPlanningAssistant = curriculumPlanningAssistant;
        this.lessonGenerationAssistant = lessonGenerationAssistant;
        this.lessonContentRetriever = lessonContentRetriever;
        this.certificationMapper = certificationMapper;
        this.objectMapper = objectMapper;
        this.lessonEmbeddingService = lessonEmbeddingService;
    }

    
    public CertificationDto generateCurriculum(
            Long certificationId,
            List<MultipartFile> files,
            String additionalInstructions
    ) throws IOException {
        
        String certTitle = self.fetchCertificationTitle(certificationId);
        String certDescription = self.fetchCertificationDescription(certificationId);


        StringBuilder rawText = new StringBuilder();
        if (files != null) {
            for (MultipartFile file : files) {
                if (file != null && !file.isEmpty()) {
                    log.info("Extracting text from '{}'", file.getOriginalFilename());
                    rawText.append(documentIngestionService.extractDocumentText(file)).append("\n\n");
                    documentIngestionService.ingest(file, certificationId, KnowledgeDocument.UseCase.LESSON);
                }
            }
        }

        String documentContent = rawText.isEmpty()
                ? "No document provided. Generate a complete curriculum based on:\nTitle: " + certTitle + "\nDescription: " + certDescription
                : truncate(rawText.toString(), MAX_DOC_CHARS);


        Map<String, Object> planRequest = new LinkedHashMap<>();
        planRequest.put("certificationTitle", certTitle);
        planRequest.put("certificationDescription", certDescription);
        if (additionalInstructions != null && !additionalInstructions.isBlank()) {
            planRequest.put("additionalInstructions", additionalInstructions);
        }
        String planRequestJson = objectMapper.writeValueAsString(planRequest);

        log.info("Calling CurriculumPlanningAssistant for '{}'", certTitle);
        String planJson = curriculumPlanningAssistant.planCurriculum(planRequestJson, documentContent);

        CurriculumPlanDTO plan = parseCurriculumPlan(planJson);
        if (plan.getMajorCategories() == null || plan.getMajorCategories().isEmpty()) {
            throw new IllegalStateException("AI returned an empty curriculum plan");
        }


        List<LessonCtx> lessons = self.createSkeletonStructure(certificationId, certTitle, plan);
        log.info("Created {} lesson skeletons for certification {}", lessons.size(), certificationId);




        for (int i = 0; i < lessons.size(); i++) {
            LessonCtx ctx = lessons.get(i);
            try {
                if (i > 0) {
                    Thread.sleep(7_000);
                }
                String content = generateLessonContent(ctx, additionalInstructions);
                self.saveLessonContent(ctx.lessonId(), content);
                lessonEmbeddingService.embedLessonContent(ctx.lessonId(), certificationId, ctx.lessonTitle(), content);
                log.info("[{}/{}] Saved lesson '{}' (id={})", i + 1, lessons.size(), ctx.lessonTitle(), ctx.lessonId());
            } catch (InterruptedException ie) {
                Thread.currentThread().interrupt();
                log.warn("Lesson generation interrupted at lesson {}", ctx.lessonTitle());
                break;
            } catch (Exception e) {
                log.warn("Content generation failed for lesson '{}' id={}: {}", ctx.lessonTitle(), ctx.lessonId(), e.getMessage());
            }
        }
        return self.fetchCertificationDto(certificationId);
    }

    @Transactional(readOnly = true)
    public String fetchCertificationTitle(Long certificationId) {
        return certificationRepository.findById(certificationId)
                .map(Certification::getTitle)
                .orElseThrow(() -> new EntityNotFoundException("Certification not found: " + certificationId));
    }

    @Transactional(readOnly = true)
    public String fetchCertificationDescription(Long certificationId) {
        return certificationRepository.findById(certificationId)
                .map(Certification::getDescription)
                .orElse("");
    }

    @Transactional
    public List<LessonCtx> createSkeletonStructure(Long certificationId, String certTitle, CurriculumPlanDTO plan) {
        Certification cert = certificationRepository.findById(certificationId).orElseThrow();
        List<LessonCtx> lessonContexts = new ArrayList<>();

        List<CurriculumMajorCategoryDTO> majorList = plan.getMajorCategories().stream()
                .limit(MAX_MAJOR_CATEGORIES).toList();
        for (CurriculumMajorCategoryDTO majorDto : majorList) {
            MajorCategory major = new MajorCategory();
            major.setCertification(cert);
            major.setTitle(majorDto.getTitle());
            major = majorCategoryRepository.save(major);

            if (majorDto.getMiddleCategories() == null) continue;
            List<CurriculumMiddleCategoryDTO> middleList = majorDto.getMiddleCategories().stream()
                    .limit(MAX_MIDDLE_CATEGORIES).toList();
            for (CurriculumMiddleCategoryDTO midDto : middleList) {
                MiddleCategory middle = new MiddleCategory();
                middle.setMajorCategory(major);
                middle.setTitle(midDto.getTitle());
                middle = middleCategoryRepository.save(middle);

                if (midDto.getLessons() == null) continue;
                List<CurriculumLessonDTO> lessonList = midDto.getLessons().stream()
                        .limit(MAX_LESSONS).toList();
                for (CurriculumLessonDTO lessonDto : lessonList) {
                    Lesson lesson = new Lesson();
                    lesson.setMiddleCategory(middle);
                    lesson.setName(lessonDto.getTitle());
                    lesson.setLessonComponentStructure("[]");
                    lesson = lessonRepository.save(lesson);

                    lessonContexts.add(new LessonCtx(
                            lesson.getLessonId(),
                            lesson.getName(),
                            middle.getTitle(),
                            major.getTitle(),
                            certTitle
                    ));
                }
            }
        }
        return lessonContexts;
    }

    @Transactional
    public void saveLessonContent(Long lessonId, String contentJson) {
        Lesson lesson = lessonRepository.findById(lessonId).orElseThrow();
        lesson.setLessonComponentStructure(contentJson);
        lessonRepository.save(lesson);
    }

    @Transactional(readOnly = true)
    public CertificationDto fetchCertificationDto(Long certificationId) {
        Certification cert = certificationRepository.findByIdWithFullTree(certificationId)
                .orElseThrow(() -> new EntityNotFoundException("Certification not found: " + certificationId));
        return certificationMapper.toDto(cert);
    }

    private String generateLessonContent(LessonCtx ctx, String additionalInstructions) throws Exception {
        String queryText = String.join(" ", ctx.certTitle(), ctx.majorTitle(), ctx.midTitle(), ctx.lessonTitle());
        List<Content> contents = lessonContentRetriever.retrieve(Query.from(queryText));
        String referenceContext = contents.stream()
                .map(c -> c.textSegment().text())
                .collect(Collectors.joining("\n\n---\n\n"));

        if (referenceContext.isBlank()) {
            referenceContext = "No reference documents available. Generate based on your knowledge of the topic.";
        }

        Map<String, Object> req = new LinkedHashMap<>();
        req.put("lessonId", ctx.lessonId());
        req.put("lessonTitle", ctx.lessonTitle());
        req.put("middleCategoryTitle", ctx.midTitle());
        req.put("majorCategoryTitle", ctx.majorTitle());
        req.put("certificationTitle", ctx.certTitle());
        if (additionalInstructions != null && !additionalInstructions.isBlank()) {
            req.put("additionalInstructions", additionalInstructions);
        }
        String requestJson = objectMapper.writeValueAsString(req);

        AILessonStructureDTO structure = lessonGenerationAssistant.generateLesson(requestJson, referenceContext);
        AILessonStructureDTO clean = stripMediaTools(structure);
        return objectMapper.writeValueAsString(clean.getSections());
    }

    private CurriculumPlanDTO parseCurriculumPlan(String raw) {
        try {
            String json = raw.trim();
            
            if (json.startsWith("```")) {
                int start = json.indexOf('\n') + 1;
                int end = json.lastIndexOf("```");
                json = end > start ? json.substring(start, end).trim() : json.substring(start).trim();
            }
            
            int objStart = json.indexOf('{');
            int objEnd = json.lastIndexOf('}');
            if (objStart != -1 && objEnd > objStart) {
                json = json.substring(objStart, objEnd + 1);
            }
            return objectMapper.readValue(json, CurriculumPlanDTO.class);
        } catch (Exception e) {
            log.error("Failed to parse curriculum plan JSON. Raw response: {}", raw, e);
            throw new IllegalStateException("AI returned invalid curriculum plan JSON", e);
        }
    }

    private AILessonStructureDTO stripMediaTools(AILessonStructureDTO structure) {
        if (structure == null || structure.getSections() == null) {
            return new AILessonStructureDTO(List.of());
        }
        List<LessonSectionDTO> cleaned = structure.getSections().stream()
                .map(section -> {
                    List<LessonToolDTO> tools = section.getContent() == null ? List.of()
                            : section.getContent().stream()
                                    .filter(t -> t.getType() != null && VALID_TOOL_TYPES.contains(t.getType()))
                                    .map(t -> {
                                        if (!MEDIA_TYPES.contains(t.getType()) || t.getData() == null) return t;
                                        Map<String, Object> data = new LinkedHashMap<>(t.getData());
                                        data.remove("file");
                                        data.put("imageKey", "");
                                        data.put("videoKey", "");
                                        return new LessonToolDTO(t.getId(), t.getType(), data);
                                    })
                                    .toList();
                    return new LessonSectionDTO(section.getId(), section.getSectionName(), tools);
                })
                .toList();
        return new AILessonStructureDTO(cleaned);
    }

    private static String truncate(String text, int maxChars) {
        return text.length() <= maxChars ? text : text.substring(0, maxChars);
    }
}
