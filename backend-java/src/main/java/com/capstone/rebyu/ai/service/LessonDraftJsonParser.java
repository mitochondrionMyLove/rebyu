package com.capstone.rebyu.ai.service;

import com.capstone.rebyu.ai.dto.GeneratedLessonSectionDraftDto;
import com.capstone.rebyu.ai.dto.GeneratedLessonToolDraftDto;
import com.capstone.rebyu.ai.dto.lesson.data.AccordionItemDataDto;
import com.capstone.rebyu.ai.dto.lesson.data.AccordionToolDataDto;
import com.capstone.rebyu.ai.dto.lesson.data.ContentAccordionBlockToolDataDto;
import com.capstone.rebyu.ai.dto.lesson.data.ContentTabsBlockToolDataDto;
import com.capstone.rebyu.ai.dto.lesson.data.DescriptionToolDataDto;
import com.capstone.rebyu.ai.dto.lesson.data.FlipGridCardDataDto;
import com.capstone.rebyu.ai.dto.lesson.data.FlipGridToolDataDto;
import com.capstone.rebyu.ai.dto.lesson.data.GridItemDataDto;
import com.capstone.rebyu.ai.dto.lesson.data.HeaderDescriptionGridToolDataDto;
import com.capstone.rebyu.ai.dto.lesson.data.HeadingToolDataDto;
import com.capstone.rebyu.ai.dto.lesson.data.ImageFeatureGridToolDataDto;
import com.capstone.rebyu.ai.dto.lesson.data.ImageLeftTextToolDataDto;
import com.capstone.rebyu.ai.dto.lesson.data.ImageRightTextToolDataDto;
import com.capstone.rebyu.ai.dto.lesson.data.ImageToolDataDto;
import com.capstone.rebyu.ai.dto.lesson.data.IntroImageCardToolDataDto;
import com.capstone.rebyu.ai.dto.lesson.data.ListItemDataDto;
import com.capstone.rebyu.ai.dto.lesson.data.MediaTextBlockToolDataDto;
import com.capstone.rebyu.ai.dto.lesson.data.OrderedListToolDataDto;
import com.capstone.rebyu.ai.dto.lesson.data.ReviewCardDataDto;
import com.capstone.rebyu.ai.dto.lesson.data.ReviewCardGridToolDataDto;
import com.capstone.rebyu.ai.dto.lesson.data.SubheadingToolDataDto;
import com.capstone.rebyu.ai.dto.lesson.data.TabItemDataDto;
import com.capstone.rebyu.ai.dto.lesson.data.TabsToolDataDto;
import com.capstone.rebyu.ai.dto.lesson.data.UnorderedListToolDataDto;
import com.capstone.rebyu.ai.dto.lesson.data.VideoToolDataDto;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.UUID;

/**
 * Parses the lesson assistant's JSON response into editable draft sections,
 * mapping each tool into the exact frontend {type, data} shape. Media-carrying
 * tools pass through whatever imageKey/videoKey the model returned as-is;
 * only a server-computed trusted set of keys survives sanitization downstream
 * (see LessonGenerationService), so an untrusted or invented key here is
 * harmless. Unknown tool types are skipped with a warning rather than failing
 * the batch.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class LessonDraftJsonParser {

    private static final Set<String> SUPPORTED_TYPES = Set.of(
            "heading", "subheading", "description", "unordered-list", "ordered-list",
            "tabs", "accordion", "flip-grid", "image", "video",
            "image-left-text", "image-right-text",
            // Combined tools
            "intro-image-card", "header-description-grid", "image-feature-grid",
            "review-card-grid", "content-accordion-block", "content-tabs-block",
            "media-text-block");

    private final ObjectMapper objectMapper;

    public List<GeneratedLessonSectionDraftDto> parseSections(String raw, List<String> warnings) {
        JsonNode array = extractArray(raw);
        if (array == null) {
            return List.of();
        }

        List<GeneratedLessonSectionDraftDto> sections = new ArrayList<>();
        for (JsonNode sectionNode : array) {
            if (!sectionNode.isObject()) continue;
            String sectionName = firstText(sectionNode,
                    "sectionName", "sectionTitle", "section", "name", "title", "heading");
            if (sectionName == null || sectionName.isBlank()) continue;

            List<GeneratedLessonToolDraftDto> content = new ArrayList<>();

            // Preferred: an explicit array of typed content tools.
            JsonNode contentNode = sectionNode.has("content") && sectionNode.get("content").isArray()
                    ? sectionNode.get("content")
                    : sectionNode.get("tools");
            if (contentNode != null && contentNode.isArray()) {
                for (JsonNode toolNode : contentNode) {
                    GeneratedLessonToolDraftDto tool = mapTool(toolNode, warnings);
                    if (tool != null) content.add(tool);
                }
            }

            // Fallback: the model produced a generic lesson section (sectionContent,
            // learningObjectives, steps, definitions ...). Synthesize typed tools
            // so drafts are still produced and remain admin-editable.
            if (content.isEmpty()) {
                content.addAll(synthesizeTools(sectionNode));
            }

            if (!content.isEmpty()) {
                sections.add(new GeneratedLessonSectionDraftDto(
                        UUID.randomUUID(), sectionName.trim(), content));
            }
        }
        return sections;
    }

    /**
     * Converts a generic lesson section (as models often produce) into the
     * supported typed tools: prose becomes a description, objective/point
     * arrays become bullet lists, step arrays become ordered lists, and
     * term/definition arrays become flip-grid review cards.
     */
    private List<GeneratedLessonToolDraftDto> synthesizeTools(JsonNode section) {
        List<GeneratedLessonToolDraftDto> tools = new ArrayList<>();

        String prose = text(section,
                "sectionContent", "content", "description", "text", "overview", "summary", "body");
        if (prose != null && !prose.isBlank()) {
            tools.add(tool(UUID.randomUUID(), "description",
                    new DescriptionToolDataDto(prose.trim()), ""));
        }

        addStringListAsList(tools, section, "unordered-list",
                "learningObjectives", "objectives", "keyPoints", "points",
                "keyConcepts", "highlights", "takeaways", "examples");
        addStringListAsList(tools, section, "ordered-list",
                "steps", "procedure", "process", "instructions");

        JsonNode definitions = firstArray(section, "definitions", "terms", "glossary", "keyTerms");
        if (definitions != null) {
            List<FlipGridCardDataDto> cards = new ArrayList<>();
            for (JsonNode def : definitions) {
                String front = text(def, "term", "word", "concept", "title", "frontTitle");
                String back = text(def, "definition", "meaning", "description", "backTitle");
                if (isBlank(front) || isBlank(back)) continue;
                cards.add(new FlipGridCardDataDto(UUID.randomUUID(),
                        front.trim(), back.trim(), back.trim()));
            }
            if (!cards.isEmpty()) {
                tools.add(tool(UUID.randomUUID(), "flip-grid",
                        new FlipGridToolDataDto(cards), ""));
            }
        }
        return tools;
    }

    private void addStringListAsList(
            List<GeneratedLessonToolDraftDto> tools, JsonNode section,
            String toolType, String... keys) {
        JsonNode arr = firstArray(section, keys);
        if (arr == null) return;
        List<ListItemDataDto> items = new ArrayList<>();
        for (JsonNode item : arr) {
            String value = item.isTextual() ? item.asText() : text(item, "text", "item", "value", "point");
            if (value != null && !value.isBlank()) {
                items.add(new ListItemDataDto(UUID.randomUUID(), value.trim()));
            }
        }
        if (items.isEmpty()) return;
        Object data = toolType.equals("ordered-list")
                ? new OrderedListToolDataDto(items)
                : new UnorderedListToolDataDto(items);
        tools.add(tool(UUID.randomUUID(), toolType, data, ""));
    }

    private GeneratedLessonToolDraftDto mapTool(JsonNode toolNode, List<String> warnings) {
        if (toolNode == null || !toolNode.isObject()) return null;
        String type = firstText(toolNode, "type", "toolType", "componentType");
        if (type == null) {
            warnings.add("Skipped a generated tool with no recognizable type field.");
            return null;
        }
        type = type.trim().toLowerCase().replace('_', '-').replace(' ', '-');
        if (type.equals("bullet-list") || type.equals("bulletlist")) type = "unordered-list";
        if (type.equals("numbered-list") || type.equals("numberedlist")) type = "ordered-list";
        if (type.equals("flip-cards") || type.equals("flipcard") || type.equals("flip-card")) {
            type = "flip-grid";
        }
        if (!SUPPORTED_TYPES.contains(type)) {
            warnings.add("Skipped an unsupported generated lesson tool: " + type);
            return null;
        }

        JsonNode data = toolNode.has("data") && toolNode.get("data").isObject()
                ? toolNode.get("data")
                : toolNode;
        String notes = firstText(toolNode, "authoringNotes", "notes");
        UUID id = UUID.randomUUID();

        try {
            return switch (type) {
                case "heading" -> tool(id, "heading",
                        new HeadingToolDataDto(requireText(data, "heading", "text", "title")), notes);
                case "subheading" -> tool(id, "subheading",
                        new SubheadingToolDataDto(requireText(data, "subheading", "text", "title")), notes);
                case "description" -> tool(id, "description",
                        new DescriptionToolDataDto(requireText(data, "description", "text", "content")), notes);
                case "unordered-list" -> tool(id, "unordered-list",
                        new UnorderedListToolDataDto(listItems(data)), notes);
                case "ordered-list" -> tool(id, "ordered-list",
                        new OrderedListToolDataDto(listItems(data)), notes);
                case "tabs" -> tool(id, "tabs", new TabsToolDataDto(tabItems(data)), notes);
                case "accordion" -> tool(id, "accordion",
                        new AccordionToolDataDto(accordionItems(data)), notes);
                case "flip-grid" -> tool(id, "flip-grid",
                        new FlipGridToolDataDto(flipCards(data)), notes);
                case "image-left-text" -> {
                    String imageKey = mediaKey(data, "imageKey", "image_key", "imageId");
                    yield tool(id, "image-left-text",
                            ImageLeftTextToolDataDto.draft(
                                    requireText(data, "image-left-text", "title"),
                                    requireText(data, "image-left-text", "description", "text"),
                                    imageKey),
                            notesOrDefault(notes, imageKey));
                }
                case "image-right-text" -> {
                    String imageKey = mediaKey(data, "imageKey", "image_key", "imageId");
                    yield tool(id, "image-right-text",
                            ImageRightTextToolDataDto.draft(
                                    requireText(data, "image-right-text", "title"),
                                    requireText(data, "image-right-text", "description", "text"),
                                    imageKey),
                            notesOrDefault(notes, imageKey));
                }
                case "image" -> {
                    String imageKey = mediaKey(data, "imageKey", "image_key", "imageId");
                    yield tool(id, "image", ImageToolDataDto.draft(imageKey), notesOrDefault(notes, imageKey));
                }
                case "video" -> {
                    String videoKey = mediaKey(data, "videoKey", "video_key", "videoId");
                    yield tool(id, "video", VideoToolDataDto.draft(videoKey), notesOrDefault(notes, videoKey));
                }
                case "intro-image-card" -> {
                    String imageKey = mediaKey(data, "imageKey", "image_key", "imageId");
                    yield tool(id, "intro-image-card",
                            IntroImageCardToolDataDto.draft(
                                    requireText(data, "intro-image-card", "smallHeader", "header", "title"),
                                    requireText(data, "intro-image-card", "description", "text"),
                                    imageKey),
                            notesOrDefault(notes, imageKey));
                }
                case "header-description-grid" -> tool(id, "header-description-grid",
                        new HeaderDescriptionGridToolDataDto(
                                requireText(data, "header-description-grid", "smallHeader", "header", "title"),
                                requireText(data, "header-description-grid", "description", "text"),
                                gridItems(data)),
                        notes);
                case "image-feature-grid" -> {
                    String imageKey = mediaKey(data, "imageKey", "image_key", "imageId");
                    yield tool(id, "image-feature-grid",
                            ImageFeatureGridToolDataDto.draft(
                                    requireText(data, "image-feature-grid", "smallHeader", "header", "title"),
                                    requireText(data, "image-feature-grid", "description", "text"),
                                    gridItems(data), imageKey),
                            notesOrDefault(notes, imageKey));
                }
                case "review-card-grid" -> tool(id, "review-card-grid",
                        new ReviewCardGridToolDataDto(
                                requireText(data, "review-card-grid", "smallHeader", "header", "title"),
                                requireText(data, "review-card-grid", "description", "text"),
                                reviewCards(data)),
                        notes);
                case "content-accordion-block" -> tool(id, "content-accordion-block",
                        new ContentAccordionBlockToolDataDto(
                                requireText(data, "content-accordion-block", "smallHeader", "header", "title"),
                                requireText(data, "content-accordion-block", "description", "text"),
                                accordionItems(data)),
                        notes);
                case "content-tabs-block" -> tool(id, "content-tabs-block",
                        new ContentTabsBlockToolDataDto(
                                requireText(data, "content-tabs-block", "smallHeader", "header", "title"),
                                requireText(data, "content-tabs-block", "description", "text"),
                                tabItems(data)),
                        notes);
                case "media-text-block" -> tool(id, "media-text-block",
                        mediaTextBlock(data),
                        notesOrDefault(notes));
                default -> null;
            };
        } catch (IllegalArgumentException invalid) {
            warnings.add("Skipped an incomplete generated " + type + " block.");
            return null;
        }
    }

    private GeneratedLessonToolDraftDto tool(UUID id, String type, Object data, String notes) {
        return new GeneratedLessonToolDraftDto(id, type, data, notes == null ? "" : notes.trim());
    }

    private List<ListItemDataDto> listItems(JsonNode data) {
        JsonNode items = firstArray(data, "items", "list", "points");
        List<ListItemDataDto> result = new ArrayList<>();
        if (items != null) {
            for (JsonNode item : items) {
                String text = item.isTextual() ? item.asText() : text(item, "text", "item", "value");
                if (text != null && !text.isBlank()) {
                    result.add(new ListItemDataDto(UUID.randomUUID(), text.trim()));
                }
            }
        }
        if (result.isEmpty()) throw new IllegalArgumentException("empty list");
        return result;
    }

    private List<TabItemDataDto> tabItems(JsonNode data) {
        JsonNode items = firstArray(data, "items", "tabs");
        List<TabItemDataDto> result = new ArrayList<>();
        if (items != null) {
            for (JsonNode item : items) {
                String label = text(item, "label", "title");
                String title = text(item, "title", "label");
                String description = text(item, "description", "content", "text");
                if (isBlank(label) || isBlank(description)) continue;
                result.add(new TabItemDataDto(UUID.randomUUID(),
                        label.trim(), title == null ? label.trim() : title.trim(), description.trim()));
            }
        }
        if (result.isEmpty()) throw new IllegalArgumentException("empty tabs");
        return result;
    }

    private List<AccordionItemDataDto> accordionItems(JsonNode data) {
        JsonNode items = firstArray(data, "items", "sections");
        List<AccordionItemDataDto> result = new ArrayList<>();
        if (items != null) {
            for (JsonNode item : items) {
                String title = text(item, "title", "label", "header");
                String content = text(item, "content", "description", "text", "body");
                if (isBlank(title) || isBlank(content)) continue;
                result.add(new AccordionItemDataDto(UUID.randomUUID(), title.trim(), content.trim()));
            }
        }
        if (result.isEmpty()) throw new IllegalArgumentException("empty accordion");
        return result;
    }

    private List<FlipGridCardDataDto> flipCards(JsonNode data) {
        JsonNode cards = firstArray(data, "cards", "items");
        List<FlipGridCardDataDto> result = new ArrayList<>();
        if (cards != null) {
            for (JsonNode card : cards) {
                String front = text(card, "frontTitle", "front", "term", "title");
                String back = text(card, "backTitle", "back", "definition");
                String description = text(card, "description", "detail", "explanation");
                if (isBlank(front) || isBlank(back)) continue;
                // The validator requires a non-blank description; fall back to
                // the back title when the model omits the extra explanation.
                if (isBlank(description)) description = back;
                result.add(new FlipGridCardDataDto(UUID.randomUUID(),
                        front.trim(), back.trim(), description.trim()));
            }
        }
        if (result.isEmpty()) throw new IllegalArgumentException("empty flip-grid");
        return result;
    }

    private List<GridItemDataDto> gridItems(JsonNode data) {
        JsonNode items = firstArray(data, "gridItems", "items", "features", "cards");
        List<GridItemDataDto> result = new ArrayList<>();
        if (items != null) {
            for (JsonNode item : items) {
                String title = text(item, "title", "header", "label", "name");
                String description = text(item, "description", "text", "content");
                if (isBlank(title) || isBlank(description)) continue;
                result.add(new GridItemDataDto(UUID.randomUUID(), title.trim(), description.trim()));
            }
        }
        if (result.isEmpty()) throw new IllegalArgumentException("empty grid");
        return result;
    }

    private List<ReviewCardDataDto> reviewCards(JsonNode data) {
        JsonNode cards = firstArray(data, "cards", "items", "reviewCards");
        List<ReviewCardDataDto> result = new ArrayList<>();
        if (cards != null) {
            for (JsonNode card : cards) {
                String front = text(card, "frontTitle", "front", "term", "title");
                String back = text(card, "backTitle", "back", "definition");
                String description = text(card, "description", "detail", "explanation");
                if (isBlank(front) || isBlank(back)) continue;
                if (isBlank(description)) description = back;
                result.add(new ReviewCardDataDto(UUID.randomUUID(),
                        front.trim(), back.trim(), description.trim()));
            }
        }
        if (result.isEmpty()) throw new IllegalArgumentException("empty review-card-grid");
        return result;
    }

    private MediaTextBlockToolDataDto mediaTextBlock(JsonNode data) {
        String smallHeader = requireText(data, "media-text-block", "smallHeader", "header", "title");
        String description = requireText(data, "media-text-block", "description", "text");
        String mediaType = text(data, "mediaType", "media");
        mediaType = "video".equalsIgnoreCase(mediaType == null ? "" : mediaType.trim()) ? "video" : "image";
        String layout = text(data, "layout");
        layout = "image-right".equalsIgnoreCase(layout == null ? "" : layout.trim()) ? "image-right" : "image-left";
        String supportingTitle = text(data, "supportingTitle", "mediaTitle", "caption");
        String supportingDescription = text(data, "supportingDescription", "mediaDescription");
        String imageKey = mediaKey(data, "imageKey", "image_key", "imageId");
        String videoKey = mediaKey(data, "videoKey", "video_key", "videoId");
        return MediaTextBlockToolDataDto.draft(
                smallHeader, description,
                supportingTitle == null ? "" : supportingTitle.trim(),
                supportingDescription == null ? "" : supportingDescription.trim(),
                mediaType, layout, imageKey, videoKey);
    }

    // ---- JSON helpers ------------------------------------------------------

    private JsonNode extractArray(String raw) {
        if (raw == null || raw.isBlank()) return null;
        String cleaned = raw.trim();
        if (cleaned.startsWith("```")) {
            cleaned = cleaned.replaceFirst("```[a-zA-Z]*\\n?", "").replaceAll("```$", "").trim();
        }
        JsonNode direct = tryReadArray(cleaned);
        if (direct != null) return direct;

        int start = cleaned.indexOf('[');
        int end = cleaned.lastIndexOf(']');
        if (start >= 0 && end > start) {
            JsonNode embedded = tryReadArray(cleaned.substring(start, end + 1));
            if (embedded != null) return embedded;
        }
        // Wrapper object { "sections": [...] }
        int objStart = cleaned.indexOf('{');
        int objEnd = cleaned.lastIndexOf('}');
        if (objStart >= 0 && objEnd > objStart) {
            try {
                JsonNode node = objectMapper.readTree(cleaned.substring(objStart, objEnd + 1));
                if (node.has("sections") && node.get("sections").isArray()) {
                    return node.get("sections");
                }
            } catch (Exception ignored) {
                // fall through
            }
        }
        log.warn("Could not extract a lesson section array from AI response");
        return null;
    }

    private JsonNode tryReadArray(String candidate) {
        try {
            JsonNode node = objectMapper.readTree(candidate);
            return node != null && node.isArray() ? node : null;
        } catch (Exception e) {
            return null;
        }
    }

    private String requireText(JsonNode node, String type, String... keys) {
        String value = text(node, keys);
        if (isBlank(value)) {
            throw new IllegalArgumentException("missing text for " + type);
        }
        return value.trim();
    }

    private String text(JsonNode node, String... keys) {
        if (node == null) return null;
        for (String key : keys) {
            JsonNode value = node.get(key);
            if (value != null && value.isTextual() && !value.asText().isBlank()) {
                return value.asText();
            }
        }
        return null;
    }

    private String firstText(JsonNode node, String... keys) {
        return text(node, keys);
    }

    /**
     * Looks for an array under one of the given key names first. Models
     * reliably produce AN array for list/tab/accordion/grid/card tools but
     * don't always use the exact key we expect (e.g. "options" instead of
     * "items") — rather than silently discarding the whole tool on a naming
     * miss, fall back to the first array-valued field found anywhere on the
     * node. A section-level object realistically has only one such field, so
     * this fallback is unambiguous in practice.
     */
    private JsonNode firstArray(JsonNode node, String... keys) {
        if (node == null) return null;
        for (String key : keys) {
            JsonNode value = node.get(key);
            if (value != null && value.isArray() && !value.isEmpty()) return value;
        }
        var fields = node.fields();
        while (fields.hasNext()) {
            var entry = fields.next();
            if (entry.getValue() != null && entry.getValue().isArray() && !entry.getValue().isEmpty()) {
                return entry.getValue();
            }
        }
        return null;
    }

    private String notesOrDefault(String notes) {
        return notesOrDefault(notes, null);
    }

    /**
     * Media-carrying tools only need the "upload media" nudge when no key was
     * actually resolved for them; a tool that already has a linked imageKey
     * or videoKey shouldn't tell the admin to go upload something manually.
     */
    private String notesOrDefault(String notes, String resolvedMediaKey) {
        if (!isBlank(notes)) return notes.trim();
        return isBlank(resolvedMediaKey)
                ? "Upload the appropriate media and review before saving."
                : "Media sourced from certification content; review before publishing.";
    }

    private String mediaKey(JsonNode data, String... keys) {
        String value = text(data, keys);
        return isBlank(value) ? null : value.trim();
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }
}
