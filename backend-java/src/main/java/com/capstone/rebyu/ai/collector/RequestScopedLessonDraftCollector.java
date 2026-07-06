package com.capstone.rebyu.ai.collector;

import com.capstone.rebyu.ai.dto.GeneratedLessonSectionDraftDto;
import com.capstone.rebyu.ai.dto.GeneratedLessonToolDraftDto;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Component;
import org.springframework.web.context.WebApplicationContext;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Component
@Scope(value = WebApplicationContext.SCOPE_REQUEST, proxyMode = ScopedProxyMode.TARGET_CLASS)
public class RequestScopedLessonDraftCollector implements LessonDraftCollector {

    private final Map<UUID, MutableSection> sections = new LinkedHashMap<>();

    @Override
    public UUID createSection(String sectionName) {
        UUID sectionId = UUID.randomUUID();
        sections.put(sectionId, new MutableSection(sectionId, sectionName, new ArrayList<>()));
        return sectionId;
    }

    @Override
    public void addTool(UUID sectionDraftId, GeneratedLessonToolDraftDto tool) {
        MutableSection section = sections.get(sectionDraftId);
        if (section == null) {
            throw new IllegalArgumentException("Unknown section draft id: " + sectionDraftId);
        }
        section.content().add(tool);
    }

    @Override
    public List<GeneratedLessonSectionDraftDto> getSections() {
        return sections.values().stream()
                .map(section -> new GeneratedLessonSectionDraftDto(
                        section.id(),
                        section.sectionName(),
                        List.copyOf(section.content())
                ))
                .toList();
    }

    @Override
    public boolean sectionExists(UUID sectionDraftId) {
        return sections.containsKey(sectionDraftId);
    }

    @Override
    public void clear() {
        sections.clear();
    }

    private record MutableSection(UUID id, String sectionName, List<GeneratedLessonToolDraftDto> content) {
    }
}
