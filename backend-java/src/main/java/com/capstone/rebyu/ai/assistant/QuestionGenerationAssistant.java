package com.capstone.rebyu.ai.assistant;

import com.capstone.rebyu.ai.dto.GeneratedQuestionDraftDto;
import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.UserMessage;
import dev.langchain4j.service.V;

import java.util.List;

@SystemMessage("""
        You are REBYU's question-bank draft generator.

        Return only structured data that matches GeneratedQuestionDraftDto.
        Do not return markdown, explanations, code fences, wrapper objects, or any extra text.

        Generated questions are drafts only. They are reviewed, edited, removed, completed,
        and manually saved by the author in the frontend. Do not generate output that implies
        automatic database persistence.

        Every generated draft must include:
        - questionType
        - suggestedLessonId
        - suggestedLessonTitle
        - question
        - difficulty

        suggestedLessonId and suggestedLessonTitle must come only from the availableLessons
        list in the request. Never invent lesson ids or lesson titles.

        Never generate JPA or database fields such as:
        questionId, parentQuestionId, certificationId, lessonId, imageKey, videoKey,
        createdAt, updatedAt.

        Never generate URLs, file objects, blobs, multipart files, images, videos, or
        external resources.

        Supported question types:
        MCQ, SHORT_ANSWER, DESCRIPTIVE, PROGRAMMING, DIAGRAM

        Supported difficulty values:
        easy, average, hard

        MCQ rules:
        - exactly 4 choices
        - exactly 1 choice must have isCorrect=true
        - correctChoiceIndex must match the zero-based correct choice

        SHORT_ANSWER rules:
        - checkingMethod must be EXACT_MATCH

        DESCRIPTIVE rules:
        - checkingMethod must be AI_SEMANTIC

        PROGRAMMING rules:
        - at least one test case
        - every test case must have non-blank expectedOutput

        DIAGRAM rules:
        - diagramType must be one of ERD, UML_CLASS, FLOWCHART, DFD
        - instructions must explain the required diagram content
        - authoringNotes must tell the author how to manually recreate the reference diagram
        - do not generate XML, nodes, edges, referenceDiagramXml, referenceDiagramNodes, or referenceDiagramEdges

        Do not generate duplicate questions.
        Generate exactly the number of questions requested per question type.
        """)
public interface QuestionGenerationAssistant {

    @UserMessage("""
            Generate question-bank draft questions.

            Question generation request:
            {{requestJson}}

            Reference context:
            {{referenceContext}}

            Return only structured question draft data as a valid JSON array.
            """)
    String generateQuestions(
            @V("requestJson") String requestJson,
            @V("referenceContext") String referenceContext
    );

    @UserMessage("""
            Regenerate or improve one existing question draft.

            Existing question draft:
            {{existingQuestionJson}}

            Improvement instruction:
            {{instruction}}

            Reference context:
            {{referenceContext}}

            Return only one structured question draft.
            Keep the existing question type unless the instruction explicitly asks for another allowed type.
            """)
    GeneratedQuestionDraftDto regenerateQuestion(
            @V("existingQuestionJson") String existingQuestionJson,
            @V("instruction") String instruction,
            @V("referenceContext") String referenceContext
    );
}
