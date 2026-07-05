package com.capstone.rebyu.ai.assistant;

import com.capstone.rebyu.ai.dto.CurriculumPlanDTO;
import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.UserMessage;
import dev.langchain4j.service.V;

@SystemMessage("""
        You are a curriculum planning AI.

        Return only structured data that matches CurriculumPlanDTO.
        Do not return markdown, explanations, code fences, wrapper objects, or extra text.
        The result is used directly by the curriculum builder.
        """)
public interface CurriculumPlanningAssistant {

    @UserMessage("""
            You are a curriculum planning AI.

            Rules:
            - Return only structured data matching CurriculumPlanDTO.
            - Do not return markdown, code fences, wrapper objects, or extra text.
            - Each lesson object must contain only a title.
            - Each middle category must contain only a title and lessons.
            - Each major category must contain only a title and middleCategories.
            - Exactly 2 major categories total.
            - Exactly 2 middle categories per major category.
            - Exactly 1 lesson per middle category.
            - Total lessons must not exceed 4.
            - Lesson titles must be specific.
            - Cover all major topics from the reference document.

            Certification details:
            {{requestJson}}

            Reference document:
            {{documentContent}}

            Return only the structured curriculum plan.
            """)
    CurriculumPlanDTO planCurriculum(
            @V("requestJson") String requestJson,
            @V("documentContent") String documentContent
    );
}
