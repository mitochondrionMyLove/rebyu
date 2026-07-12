package com.capstone.rebyu.ai.dto;

import java.util.List;

public record GeneratedQuestionDraftDto(
        GeneratedQuestionType questionType,
        Long suggestedLessonId,
        String suggestedLessonTitle,
        String question,
        GeneratedQuestionDifficulty difficulty,
        List<GeneratedChoiceDto> choices,
        Integer correctChoiceIndex,
        String correctAnswer,
        GeneratedCheckingMethod checkingMethod,
        String rubricBasedAnswer,
        String starterCode,
        List<GeneratedTestCaseDto> testCases,
        GeneratedDiagramType diagramType,
        String instructions,
        String authoringNotes,
        String imageKey
) {
    public GeneratedQuestionDraftDto(
            GeneratedQuestionType questionType,
            Long suggestedLessonId,
            String suggestedLessonTitle,
            String question,
            GeneratedQuestionDifficulty difficulty,
            List<GeneratedChoiceDto> choices,
            Integer correctChoiceIndex,
            String correctAnswer,
            GeneratedCheckingMethod checkingMethod,
            String rubricBasedAnswer,
            String starterCode,
            List<GeneratedTestCaseDto> testCases,
            GeneratedDiagramType diagramType,
            String instructions,
            String authoringNotes
    ) {
        this(questionType, suggestedLessonId, suggestedLessonTitle, question,
                difficulty, choices, correctChoiceIndex, correctAnswer,
                checkingMethod, rubricBasedAnswer, starterCode, testCases,
                diagramType, instructions, authoringNotes, null);
    }
}
