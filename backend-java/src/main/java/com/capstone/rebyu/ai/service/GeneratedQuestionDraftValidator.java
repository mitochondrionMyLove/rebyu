package com.capstone.rebyu.ai.service;

import com.capstone.rebyu.ai.common.InvalidAiGeneratedQuestionException;
import com.capstone.rebyu.ai.dto.GeneratedChoiceDto;
import com.capstone.rebyu.ai.dto.GeneratedCheckingMethod;
import com.capstone.rebyu.ai.dto.GeneratedDiagramType;
import com.capstone.rebyu.ai.dto.GeneratedQuestionDifficulty;
import com.capstone.rebyu.ai.dto.GeneratedQuestionDraftDto;
import com.capstone.rebyu.ai.dto.GeneratedQuestionType;
import com.capstone.rebyu.ai.dto.GeneratedTestCaseDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.regex.Pattern;

@Slf4j
@Component
public class GeneratedQuestionDraftValidator {

    private static final Pattern WHITESPACE = Pattern.compile("\\s+");

    /**
     * Lenient validation used when the AI chooses question types itself:
     * invalid or duplicate drafts are skipped with a warning instead of
     * failing the whole batch. Throws only when nothing valid remains.
     */
    public List<GeneratedQuestionDraftDto> validateLenient(
            List<GeneratedQuestionDraftDto> drafts,
            Map<Long, QuestionGenerationService.LessonRef> availableLessons,
            List<String> warnings
    ) {
        if (drafts == null || drafts.isEmpty()) {
            throw new InvalidAiGeneratedQuestionException("The AI returned no question drafts.");
        }
        if (availableLessons == null || availableLessons.isEmpty()) {
            throw new InvalidAiGeneratedQuestionException("No lessons are available for draft validation.");
        }

        List<GeneratedQuestionDraftDto> valid = new java.util.ArrayList<>();
        Set<String> normalizedQuestions = new HashSet<>();

        for (int index = 0; index < drafts.size(); index++) {
            GeneratedQuestionDraftDto draft = drafts.get(index);
            try {
                if (draft == null) {
                    throw new InvalidAiGeneratedQuestionException("Draft was null.");
                }
                GeneratedQuestionType questionType = requireQuestionType(draft.questionType(), index);
                String questionText = requireText(draft.question(), "question", index);
                String normalizedQuestion = normalizeQuestionText(questionText);
                if (!normalizedQuestions.add(normalizedQuestion)) {
                    warnings.add("Skipped a duplicate generated question.");
                    continue;
                }
                requireDifficulty(draft.difficulty(), index);
                Long suggestedLessonId = requireLessonId(draft.suggestedLessonId(), index);
                QuestionGenerationService.LessonRef lessonRef = availableLessons.get(suggestedLessonId);
                if (lessonRef == null
                        || !Objects.equals(lessonRef.title(), draft.suggestedLessonTitle())) {
                    warnings.add("Skipped a question mapped to a lesson outside this certification.");
                    continue;
                }
                validatePerType(draft, questionType, index);
                valid.add(draft);
            } catch (InvalidAiGeneratedQuestionException e) {
                log.warn("Skipping invalid generated draft at index {}: {}", index, e.getMessage());
                warnings.add("Skipped one invalid generated question draft.");
            }
        }

        if (valid.isEmpty()) {
            throw new InvalidAiGeneratedQuestionException(
                    "The AI did not return any valid question drafts. Please try again.");
        }
        return valid;
    }

    public void validate(
            List<GeneratedQuestionDraftDto> drafts,
            Map<String, Integer> requestedCounts,
            Map<Long, QuestionGenerationService.LessonRef> availableLessons
    ) {
        if (drafts == null || drafts.isEmpty()) {
            throw new InvalidAiGeneratedQuestionException("The AI returned no question drafts.");
        }
        if (requestedCounts == null || requestedCounts.isEmpty()) {
            throw new InvalidAiGeneratedQuestionException("At least one question type must be requested.");
        }
        if (availableLessons == null || availableLessons.isEmpty()) {
            throw new InvalidAiGeneratedQuestionException("No lessons are available for draft validation.");
        }

        Map<String, Integer> normalizedRequestedCounts = requestedCounts.entrySet().stream()
                .filter(entry -> entry.getValue() != null && entry.getValue() > 0)
                .collect(java.util.stream.Collectors.toMap(
                        entry -> entry.getKey().trim().toUpperCase(Locale.ROOT),
                        Map.Entry::getValue,
                        Integer::sum,
                        java.util.LinkedHashMap::new
                ));

        Set<String> normalizedQuestions = new HashSet<>();
        Map<String, Integer> returnedCounts = new java.util.LinkedHashMap<>();

        for (int index = 0; index < drafts.size(); index++) {
            GeneratedQuestionDraftDto draft = drafts.get(index);
            if (draft == null) {
                throw new InvalidAiGeneratedQuestionException("The AI returned a null draft at index " + index + ".");
            }

            GeneratedQuestionType questionType = requireQuestionType(draft.questionType(), index);
            String questionText = requireText(draft.question(), "question", index);
            String normalizedQuestion = normalizeQuestionText(questionText);
            if (!normalizedQuestions.add(normalizedQuestion)) {
                throw new InvalidAiGeneratedQuestionException(
                        "The AI returned a duplicate question: \"" + questionText + "\"."
                );
            }

            GeneratedQuestionDifficulty difficulty = requireDifficulty(draft.difficulty(), index);
            Long suggestedLessonId = requireLessonId(draft.suggestedLessonId(), index);
            String suggestedLessonTitle = requireText(draft.suggestedLessonTitle(), "suggestedLessonTitle", index);
            QuestionGenerationService.LessonRef lessonRef = availableLessons.get(suggestedLessonId);
            if (lessonRef == null) {
                throw new InvalidAiGeneratedQuestionException(
                        "The AI suggested a lesson that does not belong to the selected certification "
                                + "(suggestedLessonId=" + suggestedLessonId + ")."
                );
            }
            if (!Objects.equals(lessonRef.title(), suggestedLessonTitle)) {
                throw new InvalidAiGeneratedQuestionException(
                        "The AI suggested lesson title \"" + suggestedLessonTitle + "\" does not match lessonId="
                                + suggestedLessonId + " (expected \"" + lessonRef.title() + "\")."
                );
            }

            validatePerType(draft, questionType, index);
            returnedCounts.merge(questionType.name(), 1, Integer::sum);

            if (difficulty == null) {
                throw new InvalidAiGeneratedQuestionException(
                        "The AI returned an invalid difficulty for draft index " + index + "."
                );
            }
        }

        if (!returnedCounts.equals(normalizedRequestedCounts)) {
            throw new InvalidAiGeneratedQuestionException(
                    "The AI did not return the requested number of questions per type. Requested "
                            + normalizedRequestedCounts + " but received " + returnedCounts + "."
            );
        }
    }

    private void validatePerType(
            GeneratedQuestionDraftDto draft,
            GeneratedQuestionType questionType,
            int index
    ) {
        switch (questionType) {
            case MCQ -> validateMcq(draft, index);
            case SHORT_ANSWER -> validateShortAnswer(draft, index);
            case DESCRIPTIVE -> validateDescriptive(draft, index);
            case PROGRAMMING -> validateProgramming(draft, index);
            case DIAGRAM -> validateDiagram(draft, index);
        }
    }

    private void validateMcq(GeneratedQuestionDraftDto draft, int index) {
        List<GeneratedChoiceDto> choices = draft.choices();
        if (choices == null || choices.size() != 4) {
            throw new InvalidAiGeneratedQuestionException(
                    "The AI returned an MCQ draft with invalid choices at index " + index + "."
            );
        }

        int correctCount = 0;
        Integer correctIndex = draft.correctChoiceIndex();
        if (correctIndex == null || correctIndex < 0 || correctIndex > 3) {
            throw new InvalidAiGeneratedQuestionException(
                    "The AI returned an MCQ draft with an invalid correctChoiceIndex at index " + index + "."
            );
        }

        for (int i = 0; i < choices.size(); i++) {
            GeneratedChoiceDto choice = choices.get(i);
            if (choice == null) {
                throw new InvalidAiGeneratedQuestionException(
                        "The AI returned a null MCQ choice at index " + index + "."
                );
            }
            String text = requireText(choice.choiceText(), "choiceText", index);
            if (text == null || text.isBlank()) {
                throw new InvalidAiGeneratedQuestionException(
                        "The AI returned an MCQ draft with a blank choice at index " + index + "."
                );
            }
            if (Boolean.TRUE.equals(choice.isCorrect())) {
                correctCount++;
            }
        }

        if (correctCount != 1) {
            throw new InvalidAiGeneratedQuestionException(
                    "The AI returned an MCQ draft without exactly one correct answer at index " + index + "."
            );
        }
        if (!Boolean.TRUE.equals(choices.get(correctIndex).isCorrect())) {
            throw new InvalidAiGeneratedQuestionException(
                    "The AI returned an MCQ draft whose correctChoiceIndex does not match the correct choice at index "
                            + index + "."
            );
        }
    }

    private void validateShortAnswer(GeneratedQuestionDraftDto draft, int index) {
        requireText(draft.correctAnswer(), "correctAnswer", index);
        if (draft.checkingMethod() != GeneratedCheckingMethod.EXACT_MATCH) {
            throw new InvalidAiGeneratedQuestionException(
                    "The AI returned a short-answer draft with an invalid checking method at index " + index + "."
            );
        }
    }

    private void validateDescriptive(GeneratedQuestionDraftDto draft, int index) {
        requireText(draft.rubricBasedAnswer(), "rubricBasedAnswer", index);
        if (draft.checkingMethod() != GeneratedCheckingMethod.AI_SEMANTIC) {
            throw new InvalidAiGeneratedQuestionException(
                    "The AI returned a descriptive draft with an invalid checking method at index " + index + "."
            );
        }
    }

    private void validateProgramming(GeneratedQuestionDraftDto draft, int index) {
        List<GeneratedTestCaseDto> testCases = draft.testCases();
        if (testCases == null || testCases.isEmpty()) {
            throw new InvalidAiGeneratedQuestionException(
                    "The AI returned a programming draft without test cases at index " + index + "."
            );
        }
        for (GeneratedTestCaseDto testCase : testCases) {
            if (testCase == null || isBlank(testCase.expectedOutput())) {
                throw new InvalidAiGeneratedQuestionException(
                        "The AI returned a programming test case without expected output at index " + index + "."
                );
            }
        }
    }

    private void validateDiagram(GeneratedQuestionDraftDto draft, int index) {
        if (draft.diagramType() == null) {
            throw new InvalidAiGeneratedQuestionException(
                    "The AI returned a diagram draft without a diagram type at index " + index + "."
            );
        }
        if (draft.diagramType() != GeneratedDiagramType.ERD
                && draft.diagramType() != GeneratedDiagramType.UML_CLASS
                && draft.diagramType() != GeneratedDiagramType.FLOWCHART
                && draft.diagramType() != GeneratedDiagramType.DFD) {
            throw new InvalidAiGeneratedQuestionException(
                    "The AI returned a diagram draft with an invalid diagram type at index " + index + "."
            );
        }
        requireText(draft.instructions(), "instructions", index);
        requireText(draft.authoringNotes(), "authoringNotes", index);
    }

    private GeneratedQuestionType requireQuestionType(GeneratedQuestionType questionType, int index) {
        if (questionType == null) {
            throw new InvalidAiGeneratedQuestionException(
                    "The AI returned a draft without questionType at index " + index + "."
            );
        }
        return questionType;
    }

    private GeneratedQuestionDifficulty requireDifficulty(GeneratedQuestionDifficulty difficulty, int index) {
        if (difficulty == null) {
            throw new InvalidAiGeneratedQuestionException(
                    "The AI returned a draft without difficulty at index " + index + "."
            );
        }
        return difficulty;
    }

    private Long requireLessonId(Long lessonId, int index) {
        if (lessonId == null) {
            throw new InvalidAiGeneratedQuestionException(
                    "The AI returned a draft without suggestedLessonId at index " + index + "."
            );
        }
        return lessonId;
    }

    private String requireText(String value, String field, int index) {
        if (isBlank(value)) {
            throw new InvalidAiGeneratedQuestionException(
                    "The AI returned a draft without " + field + " at index " + index + "."
            );
        }
        return value;
    }

    private boolean isBlank(String value) {
        return value == null || WHITESPACE.matcher(value).replaceAll("").isBlank();
    }

    private String normalizeQuestionText(String text) {
        return WHITESPACE.matcher(text.trim().toLowerCase(Locale.ROOT)).replaceAll(" ");
    }
}
