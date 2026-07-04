package com.capstone.rebyu.ai.service;

import com.capstone.rebyu.ai.assistant.QuestionGenerationAssistant;
import com.capstone.rebyu.ai.dto.AiQuestionGenerationRequest;
import com.capstone.rebyu.ai.dto.QuestionTypeRequest;
import com.capstone.rebyu.ai.entity.KnowledgeDocument;
import com.capstone.rebyu.assessment.dto.QuestionDto;
import com.capstone.rebyu.assessment.entity.*;
import com.capstone.rebyu.assessment.mapper.QuestionMapper;
import com.capstone.rebyu.assessment.repository.*;
import com.capstone.rebyu.certification.entity.Certification;
import com.capstone.rebyu.certification.entity.Lesson;
import com.capstone.rebyu.certification.repository.CertificationRepository;
import com.capstone.rebyu.certification.repository.LessonRepository;
import com.fasterxml.jackson.core.type.TypeReference;
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
import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@Transactional
public class QuestionGenerationService {

    private final QuestionRepository questionRepository;
    private final ChoiceRepository choiceRepository;
    private final TextQuestionConfigRepository textQuestionConfigRepository;
    private final ProgrammingQuestionConfigRepository programmingQuestionConfigRepository;
    private final ProgrammingTestCaseRepository programmingTestCaseRepository;
    private final DiagramQuestionConfigRepository diagramQuestionConfigRepository;
    private final LessonRepository lessonRepository;
    private final CertificationRepository certificationRepository;
    private final DocumentIngestionService documentIngestionService;
    private final QuestionGenerationAssistant questionGenerationAssistant;
    private final ContentRetriever questionContentRetriever;
    private final QuestionMapper questionMapper;
    private final ObjectMapper objectMapper;

    public QuestionGenerationService(
            QuestionRepository questionRepository,
            ChoiceRepository choiceRepository,
            TextQuestionConfigRepository textQuestionConfigRepository,
            ProgrammingQuestionConfigRepository programmingQuestionConfigRepository,
            ProgrammingTestCaseRepository programmingTestCaseRepository,
            DiagramQuestionConfigRepository diagramQuestionConfigRepository,
            LessonRepository lessonRepository,
            CertificationRepository certificationRepository,
            DocumentIngestionService documentIngestionService,
            QuestionGenerationAssistant questionGenerationAssistant,
            @Qualifier("questionContentRetriever") ContentRetriever questionContentRetriever,
            QuestionMapper questionMapper,
            ObjectMapper objectMapper
    ) {
        this.questionRepository = questionRepository;
        this.choiceRepository = choiceRepository;
        this.textQuestionConfigRepository = textQuestionConfigRepository;
        this.programmingQuestionConfigRepository = programmingQuestionConfigRepository;
        this.programmingTestCaseRepository = programmingTestCaseRepository;
        this.diagramQuestionConfigRepository = diagramQuestionConfigRepository;
        this.lessonRepository = lessonRepository;
        this.certificationRepository = certificationRepository;
        this.documentIngestionService = documentIngestionService;
        this.questionGenerationAssistant = questionGenerationAssistant;
        this.questionContentRetriever = questionContentRetriever;
        this.questionMapper = questionMapper;
        this.objectMapper = objectMapper;
    }

    public List<QuestionDto> generateAndSave(
            AiQuestionGenerationRequest request,
            List<MultipartFile> files
    ) throws IOException {
        Lesson lesson = lessonRepository.findById(request.getLessonId())
                .orElseThrow(() -> new EntityNotFoundException("Lesson not found: " + request.getLessonId()));

        
        String certTitle = resolveCertTitle(request.getCertificationId());
        String lessonTitle = lesson.getName();

        
        if (files != null) {
            for (MultipartFile file : files) {
                if (file != null && !file.isEmpty()) {
                    log.info("Ingesting file '{}' for question generation (certId={})",
                            file.getOriginalFilename(), request.getCertificationId());
                    documentIngestionService.ingest(file, request.getCertificationId(), KnowledgeDocument.UseCase.QUESTION);
                }
            }
        }

        
        String queryText = certTitle + " " + lessonTitle;
        List<Content> contents = questionContentRetriever.retrieve(Query.from(queryText));
        String referenceContext = contents.stream()
                .map(c -> c.textSegment().text())
                .collect(Collectors.joining("\n\n---\n\n"));

        if (referenceContext.isBlank()) {
            referenceContext = "No reference documents available. Generate based on the topic, lesson, and your knowledge.";
        }

        
        Map<String, Object> requestData = new LinkedHashMap<>();
        requestData.put("certificationId", request.getCertificationId());
        requestData.put("certificationTitle", certTitle);
        requestData.put("lessonId", request.getLessonId());
        requestData.put("lessonTitle", lessonTitle);
        requestData.put("questionSpecs", request.getQuestionTypes());
        if (request.getAdditionalInstructions() != null && !request.getAdditionalInstructions().isBlank()) {
            requestData.put("additionalInstructions", request.getAdditionalInstructions());
        }
        String requestJson = objectMapper.writeValueAsString(requestData);

        log.info("Generating questions for lessonId={} with specs: {}", request.getLessonId(), request.getQuestionTypes());
        String aiResponse = questionGenerationAssistant.generateQuestions(requestJson, referenceContext);

        List<Map<String, Object>> generatedQuestions = parseJsonArray(aiResponse);
        log.info("AI returned {} questions for lessonId={}", generatedQuestions.size(), request.getLessonId());

        List<QuestionDto> savedQuestions = new ArrayList<>();
        for (Map<String, Object> qData : generatedQuestions) {
            try {
                QuestionDto saved = persistQuestion(qData, lesson);
                if (saved != null) savedQuestions.add(saved);
            } catch (Exception e) {
                log.error("Failed to persist question: {}", qData.get("question"), e);
            }
        }

        log.info("Saved {}/{} generated questions for lessonId={}", savedQuestions.size(), generatedQuestions.size(), request.getLessonId());
        return savedQuestions;
    }

    private QuestionDto persistQuestion(Map<String, Object> data, Lesson lesson) {
        String questionType = str(data, "questionType");
        String questionText = str(data, "question");
        String difficulty = str(data, "difficulty");

        if (questionType == null || questionText == null || difficulty == null) {
            log.warn("Skipping question with missing required fields: {}", data);
            return null;
        }

        Question question = new Question();
        question.setQuestionType(questionType);
        question.setDifficultyLevel(difficulty);
        question.setQuestionText(questionText);
        question.setLesson(lesson);
        question.setImageKey(null);
        question.setTotalPoints(BigDecimal.ONE);
        question = questionRepository.save(question);

        return switch (questionType) {
            case "MCQ" -> {
                saveMcqChoices(data, question);
                yield reload(question.getQuestionId());
            }
            case "SHORT_ANSWER" -> {
                saveTextConfig(question, str(data, "correctAnswer"), "EXACT_MATCH");
                yield reload(question.getQuestionId());
            }
            case "DESCRIPTIVE" -> {
                String rubric = str(data, "rubricBasedAnswer");
                saveTextConfig(question, rubric != null ? rubric : "", "AI_SEMANTIC");
                yield reload(question.getQuestionId());
            }
            case "PROGRAMMING" -> {
                saveProgrammingConfig(data, question);
                yield reload(question.getQuestionId());
            }
            case "DIAGRAM" -> {
                saveDiagramConfig(data, question);
                yield reload(question.getQuestionId());
            }
            default -> {
                log.warn("Unknown questionType '{}' — saved question text only", questionType);
                yield questionMapper.toDto(question);
            }
        };
    }

    private void saveMcqChoices(Map<String, Object> data, Question question) {
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> choiceList = (List<Map<String, Object>>) data.get("choices");
        if (choiceList == null || choiceList.isEmpty()) return;

        List<Choice> choices = choiceList.stream().map(c -> Choice.builder()
                .question(question)
                .choiceText(str(c, "choiceText") != null ? str(c, "choiceText") : "")
                .correct(Boolean.TRUE.equals(c.get("isCorrect")))
                .explanation(str(c, "explanation"))
                .imageKey(null)
                .build()
        ).toList();
        choiceRepository.saveAll(choices);
    }

    private void saveTextConfig(Question question, String answer, String checkingMethod) {
        TextQuestionConfig config = TextQuestionConfig.builder()
                .question(question)
                .correctAnswer(answer != null ? answer : "")
                .checkingMethod(checkingMethod)
                .build();
        textQuestionConfigRepository.save(config);
    }

    private void saveProgrammingConfig(Map<String, Object> data, Question question) {
        String starterCode = str(data, "starterCode");
        ProgrammingQuestionConfig config = ProgrammingQuestionConfig.builder()
                .question(question)
                .starterCode(starterCode != null ? starterCode : "")
                .build();
        config = programmingQuestionConfigRepository.save(config);

        @SuppressWarnings("unchecked")
        List<Map<String, Object>> testCaseList = (List<Map<String, Object>>) data.get("testCases");
        if (testCaseList != null && !testCaseList.isEmpty()) {
            ProgrammingQuestionConfig finalConfig = config;
            List<ProgrammingTestCase> testCases = testCaseList.stream().map(tc -> ProgrammingTestCase.builder()
                    .programmingQuestionConfig(finalConfig)
                    .inputData(str(tc, "inputData") != null ? str(tc, "inputData") : "")
                    .expectedOutput(str(tc, "expectedOutput") != null ? str(tc, "expectedOutput") : "")
                    .build()
            ).toList();
            programmingTestCaseRepository.saveAll(testCases);
        }
    }

    private void saveDiagramConfig(Map<String, Object> data, Question question) {
        String diagramType = str(data, "diagramType");
        String instructions = str(data, "instructions");
        DiagramQuestionConfig config = DiagramQuestionConfig.builder()
                .question(question)
                .diagramType(diagramType != null ? diagramType : "OTHER")
                .instructions(instructions != null ? instructions : "")
                
                .referenceDiagramXml("")
                .referenceDiagramJson("{}")
                .build();
        diagramQuestionConfigRepository.save(config);
    }

    private QuestionDto reload(Long questionId) {
        return questionRepository.findById(questionId)
                .map(questionMapper::toDto)
                .orElseThrow(() -> new EntityNotFoundException("Question not found after save: " + questionId));
    }

    private String resolveCertTitle(Long certificationId) {
        if (certificationId == null) return "";
        return certificationRepository.findById(certificationId)
                .map(Certification::getTitle)
                .orElse("");
    }

    private List<Map<String, Object>> parseJsonArray(String json) {
        if (json == null || json.isBlank()) return List.of();
        try {
            
            String cleaned = json.trim();
            if (cleaned.startsWith("```")) {
                cleaned = cleaned.replaceFirst("```[a-zA-Z]*\\n?", "").replaceAll("```$", "").trim();
            }
            
            if (cleaned.startsWith("{")) {
                Map<String, Object> wrapper = objectMapper.readValue(cleaned, new TypeReference<>() {});
                Object inner = wrapper.get("questions");
                if (inner instanceof List) {
                    
                    return (List<Map<String, Object>>) inner;
                }
            }
            return objectMapper.readValue(cleaned, new TypeReference<>() {});
        } catch (Exception e) {
            log.error("Failed to parse AI question response as JSON array: {}", json, e);
            return List.of();
        }
    }

    private static String str(Map<String, Object> map, String key) {
        Object v = map.get(key);
        return v != null ? v.toString() : null;
    }
}
