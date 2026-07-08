package com.capstone.rebyu.ai.service;

import com.capstone.rebyu.ai.dto.GeneratedQuestionDraftDto;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;

import java.lang.reflect.Method;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;

class QuestionGenerationServiceParsingTest {

    private final GeneratedQuestionDraftValidator validator = new GeneratedQuestionDraftValidator();

    @Test
    void parsesRecoverableMcqAndShortAnswerShapes() throws Exception {
        QuestionGenerationService service = newService();

        String json = """
                [
                  {
                    "type": "multiple_choice",
                    "lessonId": 1,
                    "lessonTitle": "Arithmetic",
                    "prompt": "What is 2 + 2?",
                    "level": "beginner",
                    "options": ["3", "4", "5", "6"],
                    "correctOptionIndex": "B"
                  },
                  {
                    "lessonId": 1,
                    "lessonTitle": "Arithmetic",
                    "prompt": "What is the sum of 2 and 2?",
                    "difficultyLevel": "easy",
                    "sampleAnswer": "4"
                  }
                ]
                """;

        List<GeneratedQuestionDraftDto> drafts = parse(service, json);

        assertEquals(2, drafts.size());
        assertEquals(1, drafts.getFirst().correctChoiceIndex());
        assertEquals("4", drafts.getFirst().correctAnswer());
        assertEquals("SHORT_ANSWER", drafts.get(1).questionType().name());
        assertEquals("4", drafts.get(1).correctAnswer());
        assertDoesNotThrow(() -> validator.validate(
                drafts,
                Map.of("MCQ", 1, "SHORT_ANSWER", 1),
                Map.of(1L, new QuestionGenerationService.LessonRef(1L, "Arithmetic"))
        ));
    }

    @Test
    void parsesShortAnswerQuestionTypeFromFencedProseResponse() throws Exception {
        QuestionGenerationService service = newService();

        String response = """
                Based on the provided context, here is a structured draft:

                ```json
                [
                  {
                    "question": "What is the purpose of Entity-Relationship Modeling in database design?",
                    "type": "Short-answer question",
                    "lessonId": 4,
                    "lessonTitle": "Database Design"
                  }
                ]
                ```
                """;

        List<GeneratedQuestionDraftDto> drafts = parse(service, response);

        assertEquals(1, drafts.size());
        assertEquals("SHORT_ANSWER", drafts.getFirst().questionType().name());
        assertEquals("TODO: add correct answer before saving", drafts.getFirst().correctAnswer());
        assertDoesNotThrow(() -> validator.validate(
                drafts,
                Map.of("SHORT_ANSWER", 1),
                Map.of(4L, new QuestionGenerationService.LessonRef(4L, "Database Design"))
        ));
    }

    private QuestionGenerationService newService() {
        return new QuestionGenerationService(
                null,
                null,
                null,
                null,
                null,
                validator,
                null,
                null,
                null,
                null,
                new ObjectMapper()
        );
    }

    @SuppressWarnings("unchecked")
    private List<GeneratedQuestionDraftDto> parse(
            QuestionGenerationService service,
            String json
    ) throws Exception {
        Method method = QuestionGenerationService.class
                .getDeclaredMethod("parseGeneratedQuestionDrafts", String.class);
        method.setAccessible(true);
        return (List<GeneratedQuestionDraftDto>) method.invoke(service, json);
    }
}
