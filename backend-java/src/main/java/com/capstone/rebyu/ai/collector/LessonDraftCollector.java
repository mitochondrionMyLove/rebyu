package com.capstone.rebyu.ai.collector;

import com.capstone.rebyu.ai.dto.GeneratedLessonSectionDraftDto;
import com.capstone.rebyu.ai.dto.GeneratedLessonToolDraftDto;

import java.util.List;
import java.util.UUID;

public interface LessonDraftCollector {

    UUID createSection(String sectionName);

    void addTool(UUID sectionDraftId, GeneratedLessonToolDraftDto tool);

    List<GeneratedLessonSectionDraftDto> getSections();

    boolean sectionExists(UUID sectionDraftId);

    void clear();
}
