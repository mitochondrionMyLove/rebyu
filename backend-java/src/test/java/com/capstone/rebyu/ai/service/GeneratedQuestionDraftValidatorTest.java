package com.capstone.rebyu.ai.service;

import com.capstone.rebyu.ai.common.InvalidAiGeneratedQuestionException;
import com.capstone.rebyu.ai.dto.GeneratedCheckingMethod;
import com.capstone.rebyu.ai.dto.GeneratedChoiceDto;
import com.capstone.rebyu.ai.dto.GeneratedDiagramType;
import com.capstone.rebyu.ai.dto.GeneratedQuestionDifficulty;
import com.capstone.rebyu.ai.dto.GeneratedQuestionDraftDto;
import com.capstone.rebyu.ai.dto.GeneratedQuestionType;
import com.capstone.rebyu.ai.dto.GeneratedTestCaseDto;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;

class GeneratedQuestionDraftValidatorTest {

    private final GeneratedQuestionDraftValidator validator = new GeneratedQuestionDraftValidator();

    private Map<Long, QuestionGenerationService.LessonRef> lessons() {
        return Map.of(
                1L, new QuestionGenerationService.LessonRef(1L, "Arithmetic"),
                2L, new QuestionGenerationService.LessonRef(2L, "Geometry")
        );
    }

    @Test
    void acceptsValidDraftBatch() {
        List<GeneratedQuestionDraftDto> drafts = List.of(
                new GeneratedQuestionDraftDto(
                        GeneratedQuestionType.MCQ,
                        1L,
                        "Arithmetic",
                        "What is 2 + 2?",
                        GeneratedQuestionDifficulty.easy,
                        List.of(
                                new GeneratedChoiceDto("3", "", false),
                                new GeneratedChoiceDto("4", "Correct", true),
                                new GeneratedChoiceDto("5", "", false),
                                new GeneratedChoiceDto("6", "", false)
                        ),
                        1,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null
                ),
                new GeneratedQuestionDraftDto(
                        GeneratedQuestionType.SHORT_ANSWER,
                        2L,
                        "Geometry",
                        "Define a triangle.",
                        GeneratedQuestionDifficulty.average,
                        null,
                        null,
                        "A three-sided polygon.",
                        GeneratedCheckingMethod.EXACT_MATCH,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null
                )
        );

        assertDoesNotThrow(() -> validator.validate(drafts, Map.of("MCQ", 1, "SHORT_ANSWER", 1), lessons()));
    }

    @Test
    void rejectsDuplicateQuestions() {
        List<GeneratedQuestionDraftDto> drafts = List.of(
                new GeneratedQuestionDraftDto(
                        GeneratedQuestionType.DESCRIPTIVE,
                        1L,
                        "Arithmetic",
                        "Explain addition.",
                        GeneratedQuestionDifficulty.easy,
                        null,
                        null,
                        null,
                        null,
                        "Addition combines numbers.",
                        null,
                        null,
                        null,
                        null,
                        null
                ),
                new GeneratedQuestionDraftDto(
                        GeneratedQuestionType.DESCRIPTIVE,
                        1L,
                        "Arithmetic",
                        "  explain   addition. ",
                        GeneratedQuestionDifficulty.easy,
                        null,
                        null,
                        null,
                        null,
                        "Addition combines numbers.",
                        null,
                        null,
                        null,
                        null,
                        null
                )
        );

        assertThrows(
                InvalidAiGeneratedQuestionException.class,
                () -> validator.validate(drafts, Map.of("DESCRIPTIVE", 2), lessons())
        );
    }

    @Test
    void rejectsInvalidDiagramDraft() {
        GeneratedQuestionDraftDto draft = new GeneratedQuestionDraftDto(
                GeneratedQuestionType.DIAGRAM,
                1L,
                "Arithmetic",
                "Draw a diagram of the process.",
                GeneratedQuestionDifficulty.hard,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                GeneratedDiagramType.ERD,
                "",
                ""
        );

        assertThrows(
                InvalidAiGeneratedQuestionException.class,
                () -> validator.validate(List.of(draft), Map.of("DIAGRAM", 1), lessons())
        );
    }
}
