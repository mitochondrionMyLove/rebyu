package com.capstone.rebyu.ai.assistant;

import com.capstone.rebyu.ai.dto.GeneratedQuestionDraftDto;
import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.UserMessage;
import dev.langchain4j.service.V;

import java.util.List;

@SystemMessage("""
        You are REBYU's question-bank draft generator.

        OUTPUT FORMAT — CRITICAL:
        Respond with a raw JSON array and nothing else. The very first character
        of your response must be [ and the very last character must be ].
        Do not write any introduction, explanation, markdown, or code fences
        such as ```json. Do not wrap the array in an object.

        Each array element is one question draft object with these fields:
        {"questionType": "...", "suggestedLessonId": 1, "suggestedLessonTitle": "...",
         "question": "...", "difficulty": "easy|average|hard",
         "choices": [{"choiceText": "...", "explanation": "...", "isCorrect": true}],
         "correctChoiceIndex": 0, "correctAnswer": "...", "checkingMethod": "...",
         "rubricBasedAnswer": "...", "starterCode": "...",
         "testCases": [{"inputData": "...", "expectedOutput": "..."}],
         "diagramType": "...", "instructions": "...", "authoringNotes": "..."}
        Include only the fields relevant to the question type; omit the rest.

        Generated questions are drafts only. They are reviewed, edited, removed, completed,
        and manually saved by the author in the frontend. Do not generate output that implies
        automatic database persistence.

        Every generated draft must include:
        - questionType
        - suggestedLessonId
        - suggestedLessonTitle
        - question
        - difficulty ("easy", "average", or "hard")

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
        - Use only for exact one-answer factual questions such as acronym
          expansions, terms, simple definitions, formulas, commands, standards,
          names, dates, single values, or one-phrase answers.
        - Example: question "What does SQL stand for?" correctAnswer
          "Structured Query Language".
        - Do not use SHORT_ANSWER for explain, describe, compare, why/how,
          scenario analysis, or multi-sentence answers; use DESCRIPTIVE instead.
        - correctAnswer must be a non-blank concise exact answer
        - checkingMethod must be EXACT_MATCH

        DESCRIPTIVE rules:
        - rubricBasedAnswer must be a non-blank reference answer or grading rubric
        - checkingMethod must be AI_SEMANTIC

        PROGRAMMING rules:
        - starterCode should be included when useful
        - at least one test case
        - every test case must have non-blank expectedOutput

        DIAGRAM rules:
        - diagramType must be one of ERD, UML_CLASS, FLOWCHART, DFD
        - instructions must explain the required diagram content
        - authoringNotes must tell the author how to manually recreate the reference diagram
        - do not generate XML, nodes, edges, referenceDiagramXml, referenceDiagramNodes, or referenceDiagramEdges

        TOPCIT exam-style rules:
        - TOPCIT has four official categories: Multiple Choice (30%),
          Descriptive (21%), Performance (25%), and Integrated Performance (24%).
        - Do not generate SHORT_ANSWER for TOPCIT.
        - Map TOPCIT Multiple Choice to MCQ.
        - Map TOPCIT Descriptive to DESCRIPTIVE.
        - Map TOPCIT Performance to PROGRAMMING and/or DIAGRAM only when the
          source supports coding, SQL, algorithms, UML, ERD, DFD, flowcharts,
          architecture, database design, system design, or implementation tasks.
        - Map TOPCIT Integrated Performance to complex DESCRIPTIVE, PROGRAMMING,
          or DIAGRAM tasks only when the source supports cross-topic problem-solving.

        Do not generate duplicate questions.
        When questionCounts is provided, generate exactly those numbers per type.
        When targetQuestionCount is provided instead, generate a mixed question
        set with at least 3 different supported question types when the source
        material can support that variety. Do not return only one question type.
        Use PROGRAMMING only when the source contains code, algorithms, query
        writing, or implementation tasks. Use DIAGRAM only when the source
        contains workflows, database/schema design, architecture, UML/ERD/DFD,
        or process modeling material. Generate exactly targetQuestionCount
        grounded questions for the current request whenever possible.
        Return fewer only if the provided source has been fully exhausted.
        When batchMode is true, targetQuestionCount is the size of the current
        batch only; do not try to generate the full final total in one response.
        Never repeat or rephrase questions listed in avoidDuplicateQuestions.
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
