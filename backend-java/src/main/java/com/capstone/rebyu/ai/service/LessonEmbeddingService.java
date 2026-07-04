package com.capstone.rebyu.ai.service;

import com.capstone.rebyu.ai.dto.AILessonStructureDTO;
import com.capstone.rebyu.ai.dto.LessonSectionDTO;
import com.capstone.rebyu.ai.dto.LessonToolDTO;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import dev.langchain4j.data.document.Document;
import dev.langchain4j.data.document.DocumentSplitter;
import dev.langchain4j.data.document.splitter.DocumentSplitters;
import dev.langchain4j.data.embedding.Embedding;
import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.store.embedding.EmbeddingStore;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Slf4j
@Service
public class LessonEmbeddingService {

    private final EmbeddingModel embeddingModel;
    private final EmbeddingStore<TextSegment> lessonEmbeddingStore;
    private final JdbcTemplate jdbcTemplate;
    private final ObjectMapper objectMapper;

    public LessonEmbeddingService(
            EmbeddingModel embeddingModel,
            @Qualifier("lessonEmbeddingStore") EmbeddingStore<TextSegment> lessonEmbeddingStore,
            JdbcTemplate jdbcTemplate,
            ObjectMapper objectMapper
    ) {
        this.embeddingModel = embeddingModel;
        this.lessonEmbeddingStore = lessonEmbeddingStore;
        this.jdbcTemplate = jdbcTemplate;
        this.objectMapper = objectMapper;
    }

    




    public void embedLessonContent(Long lessonId, Long certificationId, String lessonTitle, String structureJson) {
        try {
            
            jdbcTemplate.update(
                    "DELETE FROM lesson_embeddings WHERE metadata->>'lessonId' = ?",
                    String.valueOf(lessonId)
            );

            String text = extractText(structureJson, lessonTitle);
            if (text.isBlank()) {
                log.warn("No text to embed for lesson {} ({})", lessonId, lessonTitle);
                return;
            }

            Document document = Document.from(text);
            document.metadata().put("lessonId", String.valueOf(lessonId));
            document.metadata().put("lessonTitle", lessonTitle);
            document.metadata().put("type", "lesson_content");
            if (certificationId != null) {
                document.metadata().put("certificationId", String.valueOf(certificationId));
            }

            DocumentSplitter splitter = DocumentSplitters.recursive(500, 50);
            List<TextSegment> segments = splitter.split(document);

            List<Embedding> embeddings = embeddingModel.embedAll(segments).content();
            for (int i = 0; i < embeddings.size(); i += 20) {
                int end = Math.min(i + 20, embeddings.size());
                lessonEmbeddingStore.addAll(embeddings.subList(i, end), segments.subList(i, end));
            }

            log.info("Embedded lesson '{}' (id={}) into {} chunks", lessonTitle, lessonId, segments.size());
        } catch (Exception e) {
            log.error("Failed to embed lesson {} content", lessonId, e);
        }
    }

    private String extractText(String structureJson, String lessonTitle) {
        try {
            List<LessonSectionDTO> sections = objectMapper.readValue(structureJson, new TypeReference<>() {});
            return buildPlainText(new AILessonStructureDTO(sections), lessonTitle);
        } catch (Exception e) {
            log.warn("Could not parse lesson structure JSON for text extraction", e);
            return "";
        }
    }

    private String buildPlainText(AILessonStructureDTO structure, String lessonTitle) {
        StringBuilder sb = new StringBuilder();
        sb.append("Lesson: ").append(lessonTitle).append("\n\n");

        if (structure == null || structure.getSections() == null) return sb.toString();

        for (LessonSectionDTO section : structure.getSections()) {
            if (section.getSectionName() != null) {
                sb.append("## ").append(section.getSectionName()).append("\n");
            }
            if (section.getContent() != null) {
                for (LessonToolDTO tool : section.getContent()) {
                    appendToolText(sb, tool);
                }
            }
            sb.append("\n");
        }
        return sb.toString();
    }

    @SuppressWarnings("unchecked")
    private void appendToolText(StringBuilder sb, LessonToolDTO tool) {
        if (tool.getData() == null || tool.getType() == null) return;
        Map<String, Object> data = tool.getData();

        switch (tool.getType()) {
            case "heading", "subheading", "description" -> {
                Object text = data.get("text");
                if (text != null) sb.append(text).append("\n");
            }
            case "unordered-list", "ordered-list" -> {
                Object items = data.get("items");
                if (items instanceof List<?> list) {
                    for (Object item : list) {
                        if (item instanceof Map<?, ?> m) {
                            Object text = m.get("text");
                            if (text != null) sb.append("- ").append(text).append("\n");
                        }
                    }
                }
            }
            case "tabs" -> {
                Object items = data.get("items");
                if (items instanceof List<?> list) {
                    for (Object item : list) {
                        if (item instanceof Map<?, ?> m) {
                            Object label = m.get("label");
                            Object desc = m.get("description");
                            if (label != null) sb.append(label).append(": ");
                            if (desc != null) sb.append(desc).append("\n");
                        }
                    }
                }
            }
            case "accordion" -> {
                Object items = data.get("items");
                if (items instanceof List<?> list) {
                    for (Object item : list) {
                        if (item instanceof Map<?, ?> m) {
                            Object title = m.get("title");
                            Object content = m.get("content");
                            if (title != null) sb.append(title).append(": ");
                            if (content != null) sb.append(content).append("\n");
                        }
                    }
                }
            }
            case "flip-grid" -> {
                Object cards = data.get("cards");
                if (cards instanceof List<?> list) {
                    for (Object card : list) {
                        if (card instanceof Map<?, ?> m) {
                            Object front = m.get("frontTitle");
                            Object back = m.get("backTitle");
                            Object desc = m.get("description");
                            if (front != null) sb.append(front);
                            if (back != null) sb.append(" — ").append(back);
                            if (desc != null) sb.append(": ").append(desc);
                            sb.append("\n");
                        }
                    }
                }
            }
        }
    }
}
