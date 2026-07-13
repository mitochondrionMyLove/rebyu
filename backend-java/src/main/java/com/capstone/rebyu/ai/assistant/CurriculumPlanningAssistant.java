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
            - Derive the structure from the certification and the reference
              document. Model the certification's real knowledge domains as major
              categories (usually 3 to 6), each divided into focused middle
              categories (usually 2 to 5 per major).
            - EVERY middle category MUST contain MULTIPLE lessons — at least 3,
              and more when the material supports it. Never output a middle
              category with only one lesson.
            - Each lesson is one distinct, specific sub-topic. Do not merge
              several sub-topics into a single lesson, and do not pad with
              duplicate or near-duplicate lessons.
            - Cover ALL major topics from the reference document across the
              lessons; every important concept should map to a lesson.
            - Lesson titles must be specific and self-explanatory.

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
