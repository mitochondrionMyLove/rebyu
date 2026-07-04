package com.capstone.rebyu.ai.tools;

import com.capstone.rebyu.certification.entity.Lesson;
import com.capstone.rebyu.certification.entity.MajorCategory;
import com.capstone.rebyu.certification.entity.MiddleCategory;
import com.capstone.rebyu.certification.repository.LessonRepository;
import dev.langchain4j.agent.tool.P;
import dev.langchain4j.agent.tool.Tool;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Component
@RequiredArgsConstructor
public class LessonTool {

    private final LessonRepository lessonRepository;

    @Tool("Get the lesson's title, its middle category, major category, and certification title — use this to understand the full topic context before generating lesson content")
    @Transactional(readOnly = true)
    public String getLessonDetails(@P("lessonId") long lessonId) {
        log.debug("Tool: getLessonDetails({})", lessonId);
        return lessonRepository.findById(lessonId).map(lesson -> {
            StringBuilder sb = new StringBuilder();
            sb.append("Lesson title: ").append(lesson.getName()).append("\n");
            MiddleCategory mid = lesson.getMiddleCategory();
            if (mid != null) {
                sb.append("Topic (middle category): ").append(mid.getTitle()).append("\n");
                MajorCategory major = mid.getMajorCategory();
                if (major != null) {
                    sb.append("Subject area (major category): ").append(major.getTitle()).append("\n");
                    if (major.getCertification() != null) {
                        sb.append("Certification: ").append(major.getCertification().getTitle()).append("\n");
                        String desc = major.getCertification().getDescription();
                        if (desc != null && !desc.isBlank()) {
                            sb.append("Certification description: ").append(desc).append("\n");
                        }
                    }
                }
            }
            return sb.toString();
        }).orElse("Lesson not found with ID: " + lessonId);
    }

    @Tool("Get the current lesson content structure — use this to check what sections already exist so the newly generated lesson does not duplicate them")
    @Transactional(readOnly = true)
    public String getCurrentLessonContent(@P("lessonId") long lessonId) {
        log.debug("Tool: getCurrentLessonContent({})", lessonId);
        return lessonRepository.findById(lessonId).map(lesson -> {
            String structure = lesson.getLessonComponentStructure();
            if (structure == null || structure.isBlank() || "[]".equals(structure.trim())) {
                return "Lesson '" + lesson.getName() + "' has no existing content — generate fresh content.";
            }
            return "Existing content for lesson '" + lesson.getName() + "': " + structure;
        }).orElse("Lesson not found with ID: " + lessonId);
    }

    @Tool("Get a list of all lessons in the same middle category — use this to understand sibling topics and avoid overlap")
    @Transactional(readOnly = true)
    public String getSiblingLessons(@P("lessonId") long lessonId) {
        log.debug("Tool: getSiblingLessons({})", lessonId);
        return lessonRepository.findById(lessonId).map(lesson -> {
            MiddleCategory mid = lesson.getMiddleCategory();
            if (mid == null || mid.getLessons() == null) return "No sibling lessons found.";
            StringBuilder sb = new StringBuilder("Other lessons in the same topic area:\n");
            for (Lesson sibling : mid.getLessons()) {
                if (!sibling.getLessonId().equals(lessonId)) {
                    sb.append("- ").append(sibling.getName()).append("\n");
                }
            }
            return sb.toString();
        }).orElse("Lesson not found with ID: " + lessonId);
    }
}
