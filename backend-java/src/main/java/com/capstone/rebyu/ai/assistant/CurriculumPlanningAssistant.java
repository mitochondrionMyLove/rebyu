package com.capstone.rebyu.ai.assistant;

import dev.langchain4j.service.UserMessage;
import dev.langchain4j.service.V;

public interface CurriculumPlanningAssistant {

    @UserMessage("""
            You are a curriculum planning AI. Your ONLY output must be a valid JSON object.
            Do NOT include any text, explanation, greeting, or markdown before or after the JSON.
            Start your response with { and end with }.

            OUTPUT STRUCTURE — follow this exactly:
            {
              "majorCategories": [
                {
                  "title": "Major category title",
                  "middleCategories": [
                    {
                      "title": "Middle category title",
                      "lessons": [
                        {"title": "Lesson title"},
                        {"title": "Lesson title"}
                      ]
                    }
                  ]
                }
              ]
            }

            RULES:
            - Each lesson object must have ONLY the "title" key. No description, no goals, no id, no other fields.
            - Each middle category must have ONLY "title" and "lessons". No other fields.
            - Each major category must have ONLY "title" and "middleCategories". No other fields.
            - Exactly 2 major categories total
            - Exactly 2 middle categories per major category
            - Exactly 1 lesson per middle category
            - Total lessons must not exceed 4
            - Lesson titles must be specific (e.g. "SQL Joins and Subqueries" not "Databases")
            - Cover all major topics from the reference document

            Certification details:
            {{requestJson}}

            Reference document:
            {{documentContent}}

            Now output the JSON object. Remember: start with { and end with }, nothing else.
            """)
    String planCurriculum(
            @V("requestJson") String requestJson,
            @V("documentContent") String documentContent
    );
}
