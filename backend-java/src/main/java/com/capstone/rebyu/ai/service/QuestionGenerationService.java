package com.capstone.rebyu.ai.service;

import com.capstone.rebyu.ai.assistant.QuestionGenerationAssistant;
import com.capstone.rebyu.ai.dto.AiQuestionGenerationRequest;
import com.capstone.rebyu.ai.entity.KnowledgeDocument;
import com.capstone.rebyu.assessment.dto.QuestionDto;
import com.capstone.rebyu.assessment.entity.*;
import com.capstone.rebyu.assessment.mapper.QuestionMapper;
import com.capstone.rebyu.assessment.repository.*;
import com.capstone.rebyu.certification.entity.Certification;
import com.capstone.rebyu.certification.entity.Lesson;
import com.capstone.rebyu.certification.repository.CertificationRepository;
import com.capstone.rebyu.certification.repository.LessonRepository;
import com.capstone.rebyu.common.InvalidAiResponseException;
import com.fasterxml.jackson.core.type.TypeReference;
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
import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
public class QuestionGenerationService {

    private static final int MAX_DOC_CHARS = 10_000;
    private static final int MAX_QUESTIONS_PER_TYPE = 50;

    private static final Set<String> SUPPORTED_TYPES = Set.of(
            "MCQ", "SHORT_ANSWER", "DESCRIPTIVE", "PROGRAMMING", "DIAGRAM"
    );
    private static final Set<String> SUPPORTED_DIFFICULTIES = Set.of("easy", "average", "hard");

    record LessonRef(Long lessonId, String title) {}
    record CertContext(String certTitle, Map<Long, LessonRef> lessonsById) {}

    private final QuestionRepository questionRepository;
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
    private final AiUploadValidator aiUploadValidator;
    private final ObjectMapper objectMapper;

    @Autowired @Lazy
    private QuestionGenerationService self;

    public QuestionGenerationService(
            QuestionRepository questionRepository,
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
            AiUploadValidator aiUploadValidator,
            ObjectMapper objectMapper
    ) {
        this.questionRepository = questionRepository;
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
        this.aiUploadValidator = aiUploadValidator;
        this.objectMapper = objectMapper;
    }







    public List<QuestionDto> generateAndSave(
            AiQuestionGenerationRequest request,
            List<MultipartFile> files
    ) throws IOException {
        Map<String, Integer> requestedCounts = normalizeCounts(request.getQuestionCounts());
        aiUploadValidator.validate(files);

        CertContext ctx = self.loadCertificationContext(request.getCertificationId());
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
        String requestJson = objectMapper.writeValueAsString(requestData);

        log.info("Generating questions for certificationId={} with counts {}",
                request.getCertificationId(), requestedCounts);
        String aiResponse = questionGenerationAssistant.generateQuestions(requestJson, referenceContext);

        List<Map<String, Object>> generatedQuestions = parseJsonArray(aiResponse);
        validateBatch(generatedQuestions, requestedCounts, ctx);

        List<QuestionDto> saved = self.persistBatch(generatedQuestions);
        log.info("Saved {} generated questions for certificationId={}",
                saved.size(), request.getCertificationId());
        return saved;
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





    @Transactional
    public List<QuestionDto> persistBatch(List<Map<String, Object>> generatedQuestions) {
        List<QuestionDto> saved = new ArrayList<>();
        for (Map<String, Object> qData : generatedQuestions) {
            saved.add(persistQuestion(qData));
        }
        return saved;
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

    private void validateBatch(
            List<Map<String, Object>> generatedQuestions,
            Map<String, Integer> requestedCounts,
            CertContext ctx
    ) {
        if (generatedQuestions.isEmpty()) {
            throw new InvalidAiResponseException("The AI returned no questions. Please try again.");
        }

        Map<String, Integer> returnedCounts = new LinkedHashMap<>();

        for (Map<String, Object> data : generatedQuestions) {
            String type = getNormalizedQuestionType(data);
            String questionText = str(data, "question");
            String difficulty = str(data, "difficulty");
            Long suggestedLessonId = longOf(data.get("suggestedLessonId"));

            if (type == null || !SUPPORTED_TYPES.contains(type)) {
                throw new InvalidAiResponseException(
                        "The AI returned a question with an unsupported type: " + type
                );
            }
            if (questionText == null || questionText.isBlank()) {
                throw new InvalidAiResponseException("The AI returned a question without a prompt.");
            }
            if (difficulty == null || !SUPPORTED_DIFFICULTIES.contains(difficulty)) {
                throw new InvalidAiResponseException(
                        "The AI returned an invalid difficulty '" + difficulty + "' (allowed: easy, average, hard)."
                );
            }
            if (suggestedLessonId == null || !ctx.lessonsById().containsKey(suggestedLessonId)) {
                throw new InvalidAiResponseException(
                        "The AI suggested a lesson that does not belong to the selected certification "
                                + "(suggestedLessonId=" + suggestedLessonId + ")."
                );
            }

            validateAnswerData(type, data);
            returnedCounts.merge(type, 1, Integer::sum);
        }

        if (!returnedCounts.equals(requestedCounts)) {
            throw new InvalidAiResponseException(
                    "The AI did not return the requested number of questions per type. "
                            + "Requested " + requestedCounts + " but received " + returnedCounts + "."
            );
        }
    }

    private void validateAnswerData(String type, Map<String, Object> data) {
        switch (type) {
            case "MCQ" -> {
                List<Map<String, Object>> choices = listOfMaps(data.get("choices"));
                if (choices == null || choices.size() < 2) {
                    throw new InvalidAiResponseException("The AI returned an MCQ without enough answer choices.");
                }
                long correctCount = choices.stream()
                        .filter(c -> Boolean.TRUE.equals(c.get("isCorrect")))
                        .count();
                if (correctCount != 1) {
                    throw new InvalidAiResponseException(
                            "The AI returned an MCQ without exactly one correct choice."
                    );
                }
                for (Map<String, Object> choice : choices) {
                    String text = str(choice, "choiceText");
                    if (text == null || text.isBlank()) {
                        throw new InvalidAiResponseException("The AI returned an MCQ with an empty choice.");
                    }
                }
            }
            case "SHORT_ANSWER" -> {
                String answer = str(data, "correctAnswer");
                if (answer == null || answer.isBlank()) {
                    throw new InvalidAiResponseException(
                            "The AI returned a short-answer question without a correct answer."
                    );
                }
            }
            case "DESCRIPTIVE" -> {
                String rubric = str(data, "rubricBasedAnswer");
                if (rubric == null || rubric.isBlank()) {
                    throw new InvalidAiResponseException(
                            "The AI returned a descriptive question without a model answer or rubric."
                    );
                }
            }
            case "PROGRAMMING" -> {
                List<Map<String, Object>> testCases = listOfMaps(data.get("testCases"));
                if (testCases == null || testCases.isEmpty()) {
                    throw new InvalidAiResponseException(
                            "The AI returned a programming question without test cases."
                    );
                }
                for (Map<String, Object> testCase : testCases) {
                    String expected = str(testCase, "expectedOutput");
                    if (expected == null || expected.isBlank()) {
                        throw new InvalidAiResponseException(
                                "The AI returned a programming test case without an expected output."
                        );
                    }
                }
            }
            case "DIAGRAM" -> {
                String instructions = str(data, "instructions");
                if (instructions == null || instructions.isBlank()) {
                    throw new InvalidAiResponseException(
                            "The AI returned a diagram question without instructions."
                    );
                }
            }
            default -> throw new InvalidAiResponseException("Unsupported question type: " + type);
        }
    }

    private QuestionDto persistQuestion(Map<String, Object> data) {
        String aiType = str(data, "questionType");
        Long lessonId = longOf(data.get("suggestedLessonId"));

        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new EntityNotFoundException("Lesson not found: " + lessonId));

        Question question = new Question();

        question.setQuestionType(toStoredQuestionType(aiType));
        question.setDifficultyLevel(str(data, "difficulty"));
        question.setQuestionText(str(data, "question"));
        question.setLesson(lesson);
        question.setImageKey(null);
        question.setTotalPoints(BigDecimal.ONE);

        if ("MCQ".equals(aiType)) {
            for (Map<String, Object> choiceData : listOfMaps(data.get("choices"))) {
                Choice choice = Choice.builder()
                        .question(question)
                        .choiceText(str(choiceData, "choiceText"))
                        .correct(Boolean.TRUE.equals(choiceData.get("isCorrect")))
                        .explanation(str(choiceData, "explanation"))
                        .imageKey(null)
                        .build();
                question.getChoices().add(choice);
            }
        }

        question = questionRepository.save(question);

        switch (aiType) {
            case "SHORT_ANSWER" -> saveTextConfig(question, str(data, "correctAnswer"), "EXACT_MATCH");
            case "DESCRIPTIVE" -> saveTextConfig(question, str(data, "rubricBasedAnswer"), "AI_SEMANTIC");
            case "PROGRAMMING" -> saveProgrammingConfig(data, question);
            case "DIAGRAM" -> saveDiagramConfig(data, question);
            default -> {  }
        }

        return questionMapper.toDto(question);
    }

    private String toStoredQuestionType(String aiType) {
        return switch (aiType) {
            case "PROGRAMMING", "DIAGRAM" -> "CRITICAL_THINKING";
            default -> aiType;
        };
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

        ProgrammingQuestionConfig finalConfig = config;
        List<ProgrammingTestCase> testCases = listOfMaps(data.get("testCases")).stream()
                .map(tc -> ProgrammingTestCase.builder()
                        .programmingQuestionConfig(finalConfig)
                        .inputData(str(tc, "inputData") != null ? str(tc, "inputData") : "")
                        .expectedOutput(str(tc, "expectedOutput"))
                        .build())
                .toList();
        programmingTestCaseRepository.saveAll(testCases);
    }

    private void saveDiagramConfig(Map<String, Object> data, Question question) {
        String diagramType = str(data, "diagramType");
        DiagramQuestionConfig config = DiagramQuestionConfig.builder()
                .question(question)
                .diagramType(diagramType != null ? diagramType : "OTHER")
                .instructions(str(data, "instructions"))

                .referenceDiagramXml("")
                .referenceDiagramJson("{}")
                .build();
        diagramQuestionConfigRepository.save(config);
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

    private List<Map<String, Object>> parseJsonArray(String json) {
        if (json == null || json.isBlank()) {
            throw new InvalidAiResponseException("The AI returned an empty response.");
        }
        try {
            String cleaned = json.trim();
            if (cleaned.startsWith("```")) {
                cleaned = cleaned.replaceFirst("```[a-zA-Z]*\\n?", "").replaceAll("```$", "").trim();
            }
            if (cleaned.startsWith("{")) {
                Map<String, Object> wrapper = objectMapper.readValue(cleaned, new TypeReference<>() {});
                Object inner = wrapper.get("questions");
                if (inner instanceof List) {
                    @SuppressWarnings("unchecked")
                    List<Map<String, Object>> questions = (List<Map<String, Object>>) inner;
                    return questions;
                }
            }
            return objectMapper.readValue(cleaned, new TypeReference<>() {});
        } catch (Exception e) {
            log.error("Failed to parse AI question response as JSON array", e);
            throw new InvalidAiResponseException("The AI returned malformed question JSON. Please try again.", e);
        }
    }

    @SuppressWarnings("unchecked")
    private static List<Map<String, Object>> listOfMaps(Object value) {
        if (value instanceof List<?> list) {
            return (List<Map<String, Object>>) list;
        }
        return null;
    }

    private static Long longOf(Object value) {
        if (value instanceof Number number) {
            return number.longValue();
        }
        if (value instanceof String text) {
            try {
                return Long.parseLong(text.trim());
            } catch (NumberFormatException ignored) {
                return null;
            }
        }
        return null;
    }

    private static String str(Map<String, Object> map, String key) {
        Object v = map.get(key);
        return v != null ? v.toString() : null;
    }

    /**
     * Extracts and normalizes the questionType from AI response maps.
     * Supports both "questionType" and the older/alternate "type" key,
     * and trims/upper-cases the value for robust validation.
     */
    private static String getNormalizedQuestionType(Map<String, Object> map) {
        Object v = map.get("questionType");
        if (v == null) v = map.get("type");
        if (v == null) return null;
        return v.toString().trim().toUpperCase(Locale.ROOT);
    }
}
