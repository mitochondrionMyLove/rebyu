package com.capstone.rebyu.ai.tools;

import com.capstone.rebyu.assessment.entity.Question;
import com.capstone.rebyu.assessment.repository.QuestionRepository;
import com.capstone.rebyu.certification.repository.CertificationRepository;
import com.capstone.rebyu.certification.repository.LessonRepository;
import dev.langchain4j.agent.tool.P;
import dev.langchain4j.agent.tool.Tool;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class QuestionTool {

    private final QuestionRepository questionRepository;
    private final LessonRepository lessonRepository;
    private final CertificationRepository certificationRepository;

    @Tool("Get all existing questions for a lesson — use this to avoid generating duplicate questions")
    @Transactional(readOnly = true)
    public String getExistingQuestions(@P("lessonId") long lessonId) {
        log.debug("Tool: getExistingQuestions({})", lessonId);
        List<Question> questions = questionRepository.findByLesson_LessonId(lessonId);
        if (questions.isEmpty()) {
            return "No existing questions for lesson ID " + lessonId + ". You may generate freely.";
        }
        StringBuilder sb = new StringBuilder("Existing questions for this lesson (do not duplicate):\n");
        for (int i = 0; i < questions.size(); i++) {
            Question q = questions.get(i);
            sb.append(i + 1).append(". [").append(q.getQuestionType()).append("] ")
              .append(q.getQuestionText()).append("\n");
        }
        return sb.toString();
    }

    @Tool("Get the lesson's content structure and title — use this to base questions on the actual lesson material")
    @Transactional(readOnly = true)
    public String getLessonContent(@P("lessonId") long lessonId) {
        log.debug("Tool: getLessonContent({})", lessonId);
        return lessonRepository.findById(lessonId).map(lesson -> {
            String structure = lesson.getLessonComponentStructure();
            if (structure == null || structure.isBlank() || "[]".equals(structure.trim())) {
                return "Lesson '" + lesson.getName() + "' has no content yet. Generate questions based on the topic and reference context.";
            }
            return "Lesson: " + lesson.getName() + "\nLesson content: " + structure;
        }).orElse("Lesson not found with ID: " + lessonId);
    }

    @Tool("Get certification details by certification ID — use this to understand the full scope and industry context for question generation")
    @Transactional(readOnly = true)
    public String getCertificationDetails(@P("certificationId") long certificationId) {
        log.debug("Tool: getCertificationDetails({})", certificationId);
        return certificationRepository.findById(certificationId).map(cert -> {
            StringBuilder sb = new StringBuilder();
            sb.append("Certification: ").append(cert.getTitle()).append("\n");
            if (cert.getDescription() != null && !cert.getDescription().isBlank()) {
                sb.append("Description: ").append(cert.getDescription()).append("\n");
            }
            if (cert.getIndustry() != null && !cert.getIndustry().isBlank()) {
                sb.append("Industry: ").append(cert.getIndustry()).append("\n");
            }
            return sb.toString();
        }).orElse("Certification not found with ID: " + certificationId);
    }
}
