package com.capstone.rebyu.ai.service;

import com.capstone.rebyu.ai.dto.AILessonStructureDTO;
import com.capstone.rebyu.ai.dto.LessonSectionDTO;
import com.capstone.rebyu.ai.dto.LessonToolDTO;
import com.capstone.rebyu.common.InvalidAiResponseException;
import org.springframework.stereotype.Component;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;





@Component
public class LessonContentValidator {

    private static final Set<String> TEXT_TOOL_TYPES = Set.of("heading", "subheading", "description");
    private static final Set<String> LIST_TOOL_TYPES = Set.of("unordered-list", "ordered-list");
    private static final Set<String> REVIEW_TOOL_TYPES = Set.of("tabs", "accordion", "flip-grid");
    private static final Set<String> MEDIA_TOOL_TYPES = Set.of(
            "image", "video", "image-left-text", "image-right-text"
    );

    private static final Set<String> ALLOWED_TOOL_TYPES = Set.of(
            "heading", "subheading", "description",
            "unordered-list", "ordered-list",
            "tabs", "accordion", "flip-grid",
            "image", "video", "image-left-text", "image-right-text"
    );

    private static final int MIN_SECTIONS = 3;





    private static final Map<String, String> TOOL_TYPE_ALIASES = Map.ofEntries(
            Map.entry("paragraph", "description"),
            Map.entry("text", "description"),
            Map.entry("body", "description"),
            Map.entry("title", "heading"),
            Map.entry("header", "heading"),
            Map.entry("subtitle", "subheading"),
            Map.entry("subheader", "subheading"),
            Map.entry("list", "unordered-list"),
            Map.entry("bullet-list", "unordered-list"),
            Map.entry("bulleted-list", "unordered-list"),
            Map.entry("numbered-list", "ordered-list"),
            Map.entry("flipgrid", "flip-grid"),
            Map.entry("flip-cards", "flip-grid"),
            Map.entry("flip-card", "flip-grid")
    );







    public AILessonStructureDTO sanitize(AILessonStructureDTO structure) {
        if (structure == null || structure.getSections() == null) {
            return new AILessonStructureDTO(List.of());
        }

        List<LessonSectionDTO> cleaned = structure.getSections().stream()
                .map(section -> {
                    List<LessonToolDTO> tools = section.getContent() == null
                            ? List.<LessonToolDTO>of()
                            : section.getContent().stream()
                                    .map(this::withNormalizedType)
                                    .filter(t -> t.getType() != null && ALLOWED_TOOL_TYPES.contains(t.getType()))
                                    .map(this::withId)
                                    .map(this::withBlankMediaKeys)
                                    .toList();
                    return new LessonSectionDTO(
                            section.getId() == null || section.getId().isBlank()
                                    ? UUID.randomUUID().toString()
                                    : section.getId(),
                            section.getSectionName(),
                            tools
                    );
                })


                .filter(section -> !section.getContent().isEmpty())
                .toList();

        return new AILessonStructureDTO(cleaned);
    }










    public AILessonStructureDTO ensureRequiredTools(AILessonStructureDTO structure) {
        List<LessonSectionDTO> sections = structure == null ? null : structure.getSections();
        if (sections == null || sections.isEmpty()) {
            return structure;
        }

        boolean hasList = false;
        boolean hasReviewTool = false;
        for (LessonSectionDTO section : sections) {
            for (LessonToolDTO tool : section.getContent()) {
                if (LIST_TOOL_TYPES.contains(tool.getType())) {
                    hasList = true;
                }
                if (REVIEW_TOOL_TYPES.contains(tool.getType())) {
                    hasReviewTool = true;
                }
            }
        }

        if (hasList && hasReviewTool) {
            return structure;
        }

        List<LessonToolDTO> reviewTools = new java.util.ArrayList<>();

        if (!hasList) {
            List<Map<String, Object>> items = sections.stream()
                    .map(section -> Map.<String, Object>of(
                            "id", UUID.randomUUID().toString(),
                            "text", String.valueOf(section.getSectionName())
                    ))
                    .toList();
            reviewTools.add(new LessonToolDTO(
                    UUID.randomUUID().toString(),
                    "unordered-list",
                    new LinkedHashMap<>(Map.of("items", items))
            ));
        }

        if (!hasReviewTool) {
            List<Map<String, Object>> items = sections.stream()
                    .map(section -> Map.<String, Object>of(
                            "id", UUID.randomUUID().toString(),
                            "title", String.valueOf(section.getSectionName()),
                            "content", summarizeSection(section)
                    ))
                    .toList();
            reviewTools.add(new LessonToolDTO(
                    UUID.randomUUID().toString(),
                    "accordion",
                    new LinkedHashMap<>(Map.of("items", items))
            ));
        }

        List<LessonSectionDTO> extended = new java.util.ArrayList<>(sections);
        extended.add(new LessonSectionDTO(
                UUID.randomUUID().toString(),
                "Quick Review",
                reviewTools
        ));
        return new AILessonStructureDTO(extended);
    }

    private String summarizeSection(LessonSectionDTO section) {
        for (LessonToolDTO tool : section.getContent()) {
            if (TEXT_TOOL_TYPES.contains(tool.getType()) && tool.getData() != null) {
                Object text = tool.getData().get("text");
                if (text instanceof String value && !value.isBlank()
                        && !"heading".equals(tool.getType()) && !"subheading".equals(tool.getType())) {
                    return value.length() > 300 ? value.substring(0, 300) + "..." : value;
                }
            }
        }
        return "Review the key points of \"" + section.getSectionName() + "\" above.";
    }





    public String describeStructure(AILessonStructureDTO structure) {
        if (structure == null || structure.getSections() == null) {
            return "<no sections>";
        }
        StringBuilder sb = new StringBuilder();
        for (LessonSectionDTO section : structure.getSections()) {
            sb.append("[").append(section.getSectionName()).append(": ");
            if (section.getContent() == null) {
                sb.append("<null content>");
            } else {
                sb.append(section.getContent().stream()
                        .map(t -> String.valueOf(t.getType()))
                        .collect(java.util.stream.Collectors.joining(", ")));
            }
            sb.append("] ");
        }
        return sb.toString().trim();
    }






    private LessonToolDTO withBlankMediaKeys(LessonToolDTO tool) {
        if (!MEDIA_TOOL_TYPES.contains(tool.getType())) {
            return tool;
        }

        Map<String, Object> data = tool.getData() == null
                ? new LinkedHashMap<>()
                : new LinkedHashMap<>(tool.getData());

        data.remove("file");
        data.remove("url");
        data.remove("imageUrl");
        data.remove("videoUrl");
        data.remove("src");

        if ("video".equals(tool.getType())) {
            data.put("videoKey", "");
        } else {
            data.put("imageKey", "");
        }

        return new LessonToolDTO(tool.getId(), tool.getType(), data);
    }

    private LessonToolDTO withNormalizedType(LessonToolDTO tool) {
        if (tool.getType() == null) {
            return tool;
        }

        String normalized = tool.getType().trim()
                .toLowerCase(java.util.Locale.ROOT)
                .replace('_', '-')
                .replace(' ', '-');
        normalized = TOOL_TYPE_ALIASES.getOrDefault(normalized, normalized);

        return new LessonToolDTO(tool.getId(), normalized, tool.getData());
    }





    public void validate(AILessonStructureDTO structure) {
        List<LessonSectionDTO> sections = structure == null ? null : structure.getSections();

        if (sections == null || sections.size() < MIN_SECTIONS) {
            throw new InvalidAiResponseException(
                    "The AI returned an invalid lesson: at least " + MIN_SECTIONS + " sections are required."
            );
        }

        boolean hasHeading = false;
        boolean hasDescription = false;
        boolean hasList = false;
        boolean hasReviewTool = false;

        for (int i = 0; i < sections.size(); i++) {
            LessonSectionDTO section = sections.get(i);
            String label = "Section " + (i + 1);

            if (isBlank(section.getSectionName())) {
                throw new InvalidAiResponseException(
                        "The AI returned an invalid lesson: " + label + " has no section name."
                );
            }

            if (section.getContent() == null || section.getContent().isEmpty()) {
                throw new InvalidAiResponseException(
                        "The AI returned an invalid lesson: " + label + " has no content."
                );
            }

            for (LessonToolDTO tool : section.getContent()) {
                validateToolData(tool, label);

                if (TEXT_TOOL_TYPES.contains(tool.getType())) {
                    if ("heading".equals(tool.getType()) || "subheading".equals(tool.getType())) {
                        hasHeading = true;
                    } else {
                        hasDescription = true;
                    }
                }
                if (LIST_TOOL_TYPES.contains(tool.getType())) {
                    hasList = true;
                }
                if (REVIEW_TOOL_TYPES.contains(tool.getType())) {
                    hasReviewTool = true;
                }
            }
        }

        if (!hasHeading || !hasDescription) {
            throw new InvalidAiResponseException(
                    "The AI returned an invalid lesson: headings and descriptive paragraphs are required."
            );
        }
        if (!hasList) {
            throw new InvalidAiResponseException(
                    "The AI returned an invalid lesson: at least one list is required."
            );
        }
        if (!hasReviewTool) {
            throw new InvalidAiResponseException(
                    "The AI returned an invalid lesson: at least one tabs, accordion, or flip-grid review tool is required."
            );
        }
    }

    private void validateToolData(LessonToolDTO tool, String sectionLabel) {
        Map<String, Object> data = tool.getData();
        String type = tool.getType();

        if (data == null) {
            throw new InvalidAiResponseException(
                    "The AI returned an invalid lesson: a " + type + " tool in " + sectionLabel + " has no data."
            );
        }

        switch (type) {
            case "heading", "subheading", "description" -> requireText(data, "text", type, sectionLabel);
            case "unordered-list", "ordered-list" ->
                    requireItems(data, "items", "text", type, sectionLabel);
            case "tabs" -> requireItems(data, "items", "title", type, sectionLabel);
            case "accordion" -> requireItems(data, "items", "title", type, sectionLabel);
            case "flip-grid" -> requireItems(data, "cards", "frontTitle", type, sectionLabel);


            case "image", "video", "image-left-text", "image-right-text" -> { }
            default -> throw new InvalidAiResponseException(
                    "The AI returned an invalid lesson: unsupported tool type '" + type + "' in " + sectionLabel + "."
            );
        }
    }

    private void requireText(Map<String, Object> data, String key, String type, String sectionLabel) {
        Object value = data.get(key);
        if (!(value instanceof String text) || text.isBlank()) {
            throw new InvalidAiResponseException(
                    "The AI returned an invalid lesson: a " + type + " tool in " + sectionLabel + " has empty text."
            );
        }
    }

    @SuppressWarnings("unchecked")
    private void requireItems(Map<String, Object> data, String listKey, String requiredField,
                              String type, String sectionLabel) {
        Object raw = data.get(listKey);
        if (!(raw instanceof List<?> items) || items.isEmpty()) {
            throw new InvalidAiResponseException(
                    "The AI returned an invalid lesson: a " + type + " tool in " + sectionLabel + " has no items."
            );
        }
        for (Object item : items) {
            if (!(item instanceof Map<?, ?> entry)
                    || !(entry.get(requiredField) instanceof String text)
                    || text.isBlank()) {
                throw new InvalidAiResponseException(
                        "The AI returned an invalid lesson: a " + type + " tool in " + sectionLabel
                                + " has an item missing '" + requiredField + "'."
                );
            }
        }
    }

    private LessonToolDTO withId(LessonToolDTO tool) {
        String id = tool.getId() == null || tool.getId().isBlank()
                ? UUID.randomUUID().toString()
                : tool.getId();
        Map<String, Object> data = tool.getData() == null
                ? new LinkedHashMap<>()
                : new LinkedHashMap<>(tool.getData());
        data.values().removeIf(v -> v == null);
        return new LessonToolDTO(id, tool.getType(), data);
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }
}
