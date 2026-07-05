package com.capstone.rebyu.ai.service;

import com.capstone.rebyu.ai.dto.AILessonStructureDTO;
import com.capstone.rebyu.ai.dto.LessonSectionDTO;
import com.capstone.rebyu.ai.dto.LessonToolDTO;
import com.capstone.rebyu.common.InvalidAiResponseException;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

class LessonContentValidatorTest {

    private final LessonContentValidator validator = new LessonContentValidator();

    private LessonToolDTO tool(String type, Map<String, Object> data) {
        return new LessonToolDTO("tool-" + type, type, data);
    }

    private LessonToolDTO heading(String text) {
        return tool("heading", Map.of("text", text));
    }

    private LessonToolDTO description(String text) {
        return tool("description", Map.of("text", text));
    }

    private LessonToolDTO bulletList() {
        return tool("unordered-list", Map.of("items", List.of(Map.of("id", "i1", "text", "Item"))));
    }

    private LessonToolDTO accordion() {
        return tool("accordion", Map.of("items", List.of(Map.of("id", "a1", "title", "T", "content", "C"))));
    }

    private AILessonStructureDTO validStructure() {
        return new AILessonStructureDTO(List.of(
                new LessonSectionDTO("s1", "Introduction",
                        List.of(heading("Intro"), description("Welcome to the lesson."))),
                new LessonSectionDTO("s2", "Key Concepts",
                        List.of(heading("Concepts"), description("Explanation."), bulletList())),
                new LessonSectionDTO("s3", "Recap",
                        List.of(description("Summary."), accordion()))
        ));
    }

    @Test
    void acceptsValidStructure() {
        assertDoesNotThrow(() -> validator.validate(validStructure()));
    }

    @Test
    void rejectsFewerThanThreeSections() {
        AILessonStructureDTO structure = new AILessonStructureDTO(List.of(
                new LessonSectionDTO("s1", "Only Section",
                        List.of(heading("H"), description("D"), bulletList(), accordion()))
        ));

        InvalidAiResponseException ex = assertThrows(InvalidAiResponseException.class,
                () -> validator.validate(structure));
        assertTrue(ex.getMessage().contains("3 sections"));
    }

    @Test
    void rejectsStructureWithoutAnyList() {
        AILessonStructureDTO structure = new AILessonStructureDTO(List.of(
                new LessonSectionDTO("s1", "A", List.of(heading("H"), description("D"))),
                new LessonSectionDTO("s2", "B", List.of(description("D"))),
                new LessonSectionDTO("s3", "C", List.of(description("D"), accordion()))
        ));

        InvalidAiResponseException ex = assertThrows(InvalidAiResponseException.class,
                () -> validator.validate(structure));
        assertTrue(ex.getMessage().contains("list"));
    }

    @Test
    void rejectsStructureWithoutReviewTool() {
        AILessonStructureDTO structure = new AILessonStructureDTO(List.of(
                new LessonSectionDTO("s1", "A", List.of(heading("H"), description("D"))),
                new LessonSectionDTO("s2", "B", List.of(bulletList())),
                new LessonSectionDTO("s3", "C", List.of(description("D")))
        ));

        InvalidAiResponseException ex = assertThrows(InvalidAiResponseException.class,
                () -> validator.validate(structure));
        assertTrue(ex.getMessage().contains("review tool"));
    }

    @Test
    void rejectsSectionWithoutName() {
        AILessonStructureDTO structure = new AILessonStructureDTO(List.of(
                new LessonSectionDTO("s1", " ", List.of(heading("H"), description("D"))),
                new LessonSectionDTO("s2", "B", List.of(bulletList())),
                new LessonSectionDTO("s3", "C", List.of(accordion()))
        ));

        assertThrows(InvalidAiResponseException.class, () -> validator.validate(structure));
    }

    @Test
    void rejectsBlankToolText() {
        AILessonStructureDTO structure = new AILessonStructureDTO(List.of(
                new LessonSectionDTO("s1", "A", List.of(heading(" "), description("D"))),
                new LessonSectionDTO("s2", "B", List.of(bulletList())),
                new LessonSectionDTO("s3", "C", List.of(accordion()))
        ));

        assertThrows(InvalidAiResponseException.class, () -> validator.validate(structure));
    }

    @Test
    void sanitizeKeepsMediaPlaceholdersWithBlankKeysAndRemovesUnknownTools() {
        List<LessonToolDTO> tools = new ArrayList<>();
        tools.add(heading("H"));
        tools.add(tool("image", Map.of("imageKey", "fake-key", "url", "http://fake")));
        tools.add(tool("video", Map.of("videoKey", "fake-key")));
        tools.add(tool("image-left-text", Map.of(
                "imageKey", "fake-key",
                "title", "PDCA cycle diagram",
                "description", "Shows the four phases."
        )));
        tools.add(tool("made-up-tool", Map.of()));

        AILessonStructureDTO structure = new AILessonStructureDTO(List.of(
                new LessonSectionDTO("s1", "A", tools)
        ));

        AILessonStructureDTO clean = validator.sanitize(structure);
        List<LessonToolDTO> cleanTools = clean.getSections().get(0).getContent();


        assertEquals(4, cleanTools.size());

        LessonToolDTO image = cleanTools.get(1);
        assertEquals("image", image.getType());
        assertEquals("", image.getData().get("imageKey"));
        assertTrue(!image.getData().containsKey("url"));

        LessonToolDTO video = cleanTools.get(2);
        assertEquals("", video.getData().get("videoKey"));


        LessonToolDTO imageText = cleanTools.get(3);
        assertEquals("", imageText.getData().get("imageKey"));
        assertEquals("PDCA cycle diagram", imageText.getData().get("title"));
    }

    @Test
    void validateAcceptsMediaPlaceholdersWithBlankKeys() {
        AILessonStructureDTO structure = new AILessonStructureDTO(List.of(
                new LessonSectionDTO("s1", "A",
                        List.of(heading("H"), description("D"),
                                tool("image", Map.of("imageKey", "")))),
                new LessonSectionDTO("s2", "B", List.of(bulletList())),
                new LessonSectionDTO("s3", "C", List.of(accordion()))
        ));

        assertDoesNotThrow(() -> validator.validate(structure));
    }

    @Test
    void ensureRequiredToolsAddsQuickReviewWhenReviewToolMissing() {
        AILessonStructureDTO structure = new AILessonStructureDTO(List.of(
                new LessonSectionDTO("s1", "A", List.of(heading("H"), description("First paragraph."))),
                new LessonSectionDTO("s2", "B", List.of(bulletList())),
                new LessonSectionDTO("s3", "C", List.of(description("D")))
        ));

        AILessonStructureDTO extended = validator.ensureRequiredTools(structure);

        assertEquals(4, extended.getSections().size());
        LessonSectionDTO review = extended.getSections().get(3);
        assertEquals("Quick Review", review.getSectionName());
        assertEquals("accordion", review.getContent().get(0).getType());


        assertDoesNotThrow(() -> validator.validate(extended));
    }

    @Test
    void ensureRequiredToolsAddsTopicListWhenNoListExists() {
        AILessonStructureDTO structure = new AILessonStructureDTO(List.of(
                new LessonSectionDTO("s1", "A", List.of(heading("H"), description("D"))),
                new LessonSectionDTO("s2", "B", List.of(description("D"))),
                new LessonSectionDTO("s3", "C", List.of(description("D")))
        ));

        AILessonStructureDTO extended = validator.ensureRequiredTools(structure);

        LessonSectionDTO review = extended.getSections().get(3);
        assertEquals("unordered-list", review.getContent().get(0).getType());
        assertEquals("accordion", review.getContent().get(1).getType());
        assertDoesNotThrow(() -> validator.validate(extended));
    }

    @Test
    void ensureRequiredToolsLeavesCompleteStructureUntouched() {
        AILessonStructureDTO structure = validStructure();

        AILessonStructureDTO result = validator.ensureRequiredTools(structure);

        assertEquals(structure.getSections().size(), result.getSections().size());
    }

    @Test
    void sanitizeFillsMissingIds() {
        AILessonStructureDTO structure = new AILessonStructureDTO(List.of(
                new LessonSectionDTO(null, "A", List.of(
                        new LessonToolDTO(null, "heading", Map.of("text", "H"))
                ))
        ));

        AILessonStructureDTO clean = validator.sanitize(structure);

        assertTrue(clean.getSections().get(0).getId() != null
                && !clean.getSections().get(0).getId().isBlank());
        assertTrue(clean.getSections().get(0).getContent().get(0).getId() != null);
    }
}
