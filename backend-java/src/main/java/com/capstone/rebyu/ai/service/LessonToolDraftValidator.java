package com.capstone.rebyu.ai.service;

import com.capstone.rebyu.ai.collector.LessonDraftCollector;
import com.capstone.rebyu.ai.context.LessonGenerationExecutionContext;
import com.capstone.rebyu.ai.dto.AccordionToolInputDto;
import com.capstone.rebyu.ai.dto.ContentAccordionBlockToolInputDto;
import com.capstone.rebyu.ai.dto.ContentTabsBlockToolInputDto;
import com.capstone.rebyu.ai.dto.DescriptionToolInputDto;
import com.capstone.rebyu.ai.dto.FlipGridToolInputDto;
import com.capstone.rebyu.ai.dto.GeneratedLessonSectionDraftDto;
import com.capstone.rebyu.ai.dto.GeneratedLessonToolDraftDto;
import com.capstone.rebyu.ai.dto.GridItemInputDto;
import com.capstone.rebyu.ai.dto.HeaderDescriptionGridToolInputDto;
import com.capstone.rebyu.ai.dto.HeadingToolInputDto;
import com.capstone.rebyu.ai.dto.ImageFeatureGridToolInputDto;
import com.capstone.rebyu.ai.dto.ImageLeftTextToolInputDto;
import com.capstone.rebyu.ai.dto.ImageRightTextToolInputDto;
import com.capstone.rebyu.ai.dto.ImageToolInputDto;
import com.capstone.rebyu.ai.dto.IntroImageCardToolInputDto;
import com.capstone.rebyu.ai.dto.LessonListItemInputDto;
import com.capstone.rebyu.ai.dto.LessonSectionDraftInputDto;
import com.capstone.rebyu.ai.dto.LessonTabItemInputDto;
import com.capstone.rebyu.ai.dto.MediaTextBlockToolInputDto;
import com.capstone.rebyu.ai.dto.OrderedListToolInputDto;
import com.capstone.rebyu.ai.dto.ReviewCardGridToolInputDto;
import com.capstone.rebyu.ai.dto.ReviewCardInputDto;
import com.capstone.rebyu.ai.dto.SubheadingToolInputDto;
import com.capstone.rebyu.ai.dto.TabsToolInputDto;
import com.capstone.rebyu.ai.dto.UnorderedListToolInputDto;
import com.capstone.rebyu.ai.dto.VideoToolInputDto;
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
import com.capstone.rebyu.common.InvalidAiResponseException;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Set;
import java.util.UUID;

@Component
public class LessonToolDraftValidator {

    private final LessonDraftCollector lessonDraftCollector;

    public LessonToolDraftValidator(LessonDraftCollector lessonDraftCollector) {
        this.lessonDraftCollector = lessonDraftCollector;
    }

    public void validateSection(
            LessonSectionDraftInputDto input,
            LessonGenerationExecutionContext generationExecutionContext
    ) {
        requireNonBlank(input.sectionName(), "sectionName");
        generationExecutionContext.validateEvidence(input.evidence());
    }

    public void validateHeading(
            HeadingToolInputDto input,
            LessonGenerationExecutionContext generationExecutionContext
    ) {
        requireSection(input.sectionDraftId());
        requireNonBlank(input.text(), "text");
    }

    public void validateSubheading(
            SubheadingToolInputDto input,
            LessonGenerationExecutionContext generationExecutionContext
    ) {
        requireSection(input.sectionDraftId());
        requireNonBlank(input.text(), "text");
    }

    public void validateDescription(
            DescriptionToolInputDto input,
            LessonGenerationExecutionContext generationExecutionContext
    ) {
        requireSection(input.sectionDraftId());
        requireNonBlank(input.text(), "text");
        generationExecutionContext.validateEvidence(input.evidence());
    }

    public void validateUnorderedList(
            UnorderedListToolInputDto input,
            LessonGenerationExecutionContext generationExecutionContext
    ) {
        requireSection(input.sectionDraftId());
        validateListItems(input.items());
        generationExecutionContext.validateEvidence(input.evidence());
    }

    public void validateOrderedList(
            OrderedListToolInputDto input,
            LessonGenerationExecutionContext generationExecutionContext
    ) {
        requireSection(input.sectionDraftId());
        validateListItems(input.items());
        generationExecutionContext.validateEvidence(input.evidence());
    }

    public void validateImageLeftText(
            ImageLeftTextToolInputDto input,
            LessonGenerationExecutionContext generationExecutionContext
    ) {
        requireSection(input.sectionDraftId());
        requireNonBlank(input.title(), "title");
        requireNonBlank(input.description(), "description");
        requireNonBlank(input.authoringNotes(), "authoringNotes");
        generationExecutionContext.validateEvidence(input.evidence());
    }

    public void validateImageRightText(
            ImageRightTextToolInputDto input,
            LessonGenerationExecutionContext generationExecutionContext
    ) {
        requireSection(input.sectionDraftId());
        requireNonBlank(input.title(), "title");
        requireNonBlank(input.description(), "description");
        requireNonBlank(input.authoringNotes(), "authoringNotes");
        generationExecutionContext.validateEvidence(input.evidence());
    }

    public void validateTabs(
            TabsToolInputDto input,
            LessonGenerationExecutionContext generationExecutionContext
    ) {
        requireSection(input.sectionDraftId());
        validateTabItems(input.items());
        generationExecutionContext.validateEvidence(input.evidence());
    }

    public void validateAccordion(
            AccordionToolInputDto input,
            LessonGenerationExecutionContext generationExecutionContext
    ) {
        requireSection(input.sectionDraftId());
        validateAccordionItems(input.items());
        generationExecutionContext.validateEvidence(input.evidence());
    }

    public void validateFlipGrid(
            FlipGridToolInputDto input,
            LessonGenerationExecutionContext generationExecutionContext
    ) {
        requireSection(input.sectionDraftId());
        validateFlipGridCards(input.cards());
        generationExecutionContext.validateEvidence(input.evidence());
    }

    public void validateImage(
            ImageToolInputDto input,
            LessonGenerationExecutionContext generationExecutionContext
    ) {
        requireSection(input.sectionDraftId());
        requireNonBlank(input.authoringNotes(), "authoringNotes");
        generationExecutionContext.validateEvidence(input.evidence());
    }

    public void validateVideo(
            VideoToolInputDto input,
            LessonGenerationExecutionContext generationExecutionContext
    ) {
        requireSection(input.sectionDraftId());
        requireNonBlank(input.authoringNotes(), "authoringNotes");
        generationExecutionContext.validateEvidence(input.evidence());
    }

    // ──────────────────────────────────────────────
    // Combined tool input validators
    // ──────────────────────────────────────────────

    public void validateIntroImageCard(
            IntroImageCardToolInputDto input,
            LessonGenerationExecutionContext ctx
    ) {
        requireSection(input.sectionDraftId());
        requireNonBlank(input.smallHeader(), "smallHeader");
        requireNonBlank(input.description(), "description");
    }

    public void validateHeaderDescriptionGrid(
            HeaderDescriptionGridToolInputDto input,
            LessonGenerationExecutionContext ctx
    ) {
        requireSection(input.sectionDraftId());
        requireNonBlank(input.smallHeader(), "smallHeader");
        requireNonBlank(input.description(), "description");
        validateGridItems(input.gridItems());
    }

    public void validateImageFeatureGrid(
            ImageFeatureGridToolInputDto input,
            LessonGenerationExecutionContext ctx
    ) {
        requireSection(input.sectionDraftId());
        requireNonBlank(input.smallHeader(), "smallHeader");
        requireNonBlank(input.description(), "description");
        validateGridItems(input.gridItems());
    }

    public void validateReviewCardGrid(
            ReviewCardGridToolInputDto input,
            LessonGenerationExecutionContext ctx
    ) {
        requireSection(input.sectionDraftId());
        requireNonBlank(input.smallHeader(), "smallHeader");
        requireNonBlank(input.description(), "description");
        validateReviewCards(input.cards());
    }

    public void validateContentAccordionBlock(
            ContentAccordionBlockToolInputDto input,
            LessonGenerationExecutionContext ctx
    ) {
        requireSection(input.sectionDraftId());
        requireNonBlank(input.smallHeader(), "smallHeader");
        requireNonBlank(input.description(), "description");
        validateAccordionItems(input.items());
    }

    public void validateContentTabsBlock(
            ContentTabsBlockToolInputDto input,
            LessonGenerationExecutionContext ctx
    ) {
        requireSection(input.sectionDraftId());
        requireNonBlank(input.smallHeader(), "smallHeader");
        requireNonBlank(input.description(), "description");
        validateTabItems(input.items());
    }

    public void validateMediaTextBlock(
            MediaTextBlockToolInputDto input,
            LessonGenerationExecutionContext ctx
    ) {
        requireSection(input.sectionDraftId());
        requireNonBlank(input.smallHeader(), "smallHeader");
        requireNonBlank(input.description(), "description");
        String mediaType = input.mediaType() != null ? input.mediaType().trim() : "";
        if (!Set.of("image", "video").contains(mediaType)) {
            throw new InvalidAiResponseException("mediaType must be 'image' or 'video'.");
        }
    }

    public void validateCollectedDrafts(List<GeneratedLessonSectionDraftDto> sections) {
        if (sections == null || sections.isEmpty()) {
            throw new InvalidAiResponseException("The AI did not create any lesson sections.");
        }

        for (int sectionIndex = 0; sectionIndex < sections.size(); sectionIndex++) {
            GeneratedLessonSectionDraftDto section = sections.get(sectionIndex);
            String label = "Section " + (sectionIndex + 1);

            if (section.id() == null) {
                throw new InvalidAiResponseException(label + " is missing a draft id.");
            }
            if (isBlank(section.sectionName())) {
                throw new InvalidAiResponseException(label + " has no section name.");
            }
            if (section.content() == null || section.content().isEmpty()) {
                throw new InvalidAiResponseException(label + " has no lesson tools.");
            }

            for (int toolIndex = 0; toolIndex < section.content().size(); toolIndex++) {
                validateDraftTool(section.content().get(toolIndex), label, toolIndex + 1);
            }
        }
    }

    private void validateDraftTool(
            GeneratedLessonToolDraftDto tool,
            String sectionLabel,
            int toolNumber
    ) {
        String toolLabel = sectionLabel + ", tool " + toolNumber;

        if (tool == null || tool.id() == null || isBlank(tool.type())) {
            throw new InvalidAiResponseException(toolLabel + " is invalid.");
        }

        switch (tool.type()) {
            case "heading" -> validateHeadingData(asType(tool.data(), HeadingToolDataDto.class), toolLabel);
            case "subheading" -> validateSubheadingData(asType(tool.data(), SubheadingToolDataDto.class), toolLabel);
            case "description" -> validateDescriptionData(asType(tool.data(), DescriptionToolDataDto.class), toolLabel);
            case "unordered-list" ->
                    validateUnorderedListData(asType(tool.data(), UnorderedListToolDataDto.class), toolLabel);
            case "ordered-list" ->
                    validateOrderedListData(asType(tool.data(), OrderedListToolDataDto.class), toolLabel);
            case "tabs" -> validateTabsData(asType(tool.data(), TabsToolDataDto.class), toolLabel);
            case "accordion" -> validateAccordionData(asType(tool.data(), AccordionToolDataDto.class), toolLabel);
            case "flip-grid" -> validateFlipGridData(asType(tool.data(), FlipGridToolDataDto.class), toolLabel);
            case "image" -> {
                validateImageData(asType(tool.data(), ImageToolDataDto.class), toolLabel);
                requireAuthoringNotes(tool.authoringNotes(), toolLabel);
            }
            case "video" -> {
                validateVideoData(asType(tool.data(), VideoToolDataDto.class), toolLabel);
                requireAuthoringNotes(tool.authoringNotes(), toolLabel);
            }
            case "image-left-text" -> {
                validateImageLeftTextData(asType(tool.data(), ImageLeftTextToolDataDto.class), toolLabel);
                requireAuthoringNotes(tool.authoringNotes(), toolLabel);
            }
            case "image-right-text" -> {
                validateImageRightTextData(asType(tool.data(), ImageRightTextToolDataDto.class), toolLabel);
                requireAuthoringNotes(tool.authoringNotes(), toolLabel);
            }
            case "intro-image-card" -> validateCombinedHeaderDesc(
                    asType(tool.data(), IntroImageCardToolDataDto.class), toolLabel
            );
            case "header-description-grid" -> {
                var gridData = asType(tool.data(), HeaderDescriptionGridToolDataDto.class);
                validateCombinedSmallHeader(gridData != null ? gridData.smallHeader() : null,
                        gridData != null ? gridData.description() : null, toolLabel);
                validateGridItemData(gridData != null ? gridData.gridItems() : null, toolLabel);
            }
            case "image-feature-grid" -> {
                var ifgData = asType(tool.data(), ImageFeatureGridToolDataDto.class);
                validateCombinedSmallHeader(ifgData != null ? ifgData.smallHeader() : null,
                        ifgData != null ? ifgData.description() : null, toolLabel);
                validateGridItemData(ifgData != null ? ifgData.gridItems() : null, toolLabel);
            }
            case "review-card-grid" -> {
                var rcgData = asType(tool.data(), ReviewCardGridToolDataDto.class);
                validateCombinedSmallHeader(rcgData != null ? rcgData.smallHeader() : null,
                        rcgData != null ? rcgData.description() : null, toolLabel);
                validateReviewCardData(rcgData != null ? rcgData.cards() : null, toolLabel);
            }
            case "content-accordion-block" -> {
                var cabData = asType(tool.data(), ContentAccordionBlockToolDataDto.class);
                validateCombinedSmallHeader(cabData != null ? cabData.smallHeader() : null,
                        cabData != null ? cabData.description() : null, toolLabel);
                validateAccordionData(cabData != null ? new AccordionToolDataDto(cabData.items()) : null, toolLabel);
            }
            case "content-tabs-block" -> {
                var ctbData = asType(tool.data(), ContentTabsBlockToolDataDto.class);
                validateCombinedSmallHeader(ctbData != null ? ctbData.smallHeader() : null,
                        ctbData != null ? ctbData.description() : null, toolLabel);
                validateTabsData(ctbData != null ? new TabsToolDataDto(ctbData.items()) : null, toolLabel);
            }
            case "media-text-block" -> {
                var mtbData = asType(tool.data(), MediaTextBlockToolDataDto.class);
                validateCombinedSmallHeader(mtbData != null ? mtbData.smallHeader() : null,
                        mtbData != null ? mtbData.description() : null, toolLabel);
            }
            default -> throw new InvalidAiResponseException(
                    toolLabel + " uses unsupported tool type '" + tool.type() + "'."
            );
        }
    }

    private void validateHeadingData(HeadingToolDataDto data, String toolLabel) {
        if (data == null || isBlank(data.text())) {
            throw new InvalidAiResponseException(toolLabel + ": heading text is required.");
        }
    }

    private void validateSubheadingData(SubheadingToolDataDto data, String toolLabel) {
        if (data == null || isBlank(data.text())) {
            throw new InvalidAiResponseException(toolLabel + ": subheading text is required.");
        }
    }

    private void validateDescriptionData(DescriptionToolDataDto data, String toolLabel) {
        if (data == null || isBlank(data.text())) {
            throw new InvalidAiResponseException(toolLabel + ": description text is required.");
        }
    }

    private void validateUnorderedListData(UnorderedListToolDataDto data, String toolLabel) {
        validateListItemData(data == null ? null : data.items(), toolLabel);
    }

    private void validateOrderedListData(OrderedListToolDataDto data, String toolLabel) {
        validateListItemData(data == null ? null : data.items(), toolLabel);
    }

    private void validateListItemData(List<ListItemDataDto> items, String toolLabel) {
        if (items == null || items.isEmpty()) {
            throw new InvalidAiResponseException(toolLabel + ": add at least one list item.");
        }
        for (ListItemDataDto item : items) {
            if (item == null || item.id() == null || isBlank(item.text())) {
                throw new InvalidAiResponseException(toolLabel + ": every list item needs text.");
            }
        }
    }

    private void validateTabsData(TabsToolDataDto data, String toolLabel) {
        if (data == null || data.items() == null || data.items().isEmpty()) {
            throw new InvalidAiResponseException(toolLabel + ": add at least one tab.");
        }
        for (TabItemDataDto item : data.items()) {
            if (item == null || item.id() == null
                    || isBlank(item.label()) || isBlank(item.title()) || isBlank(item.description())) {
                throw new InvalidAiResponseException(
                        toolLabel + ": every tab needs a label, title, and description."
                );
            }
        }
    }

    private void validateAccordionData(AccordionToolDataDto data, String toolLabel) {
        if (data == null || data.items() == null || data.items().isEmpty()) {
            throw new InvalidAiResponseException(toolLabel + ": add at least one accordion item.");
        }
        for (AccordionItemDataDto item : data.items()) {
            if (item == null || item.id() == null || isBlank(item.title()) || isBlank(item.content())) {
                throw new InvalidAiResponseException(
                        toolLabel + ": every accordion item needs a title and content."
                );
            }
        }
    }

    private void validateFlipGridData(FlipGridToolDataDto data, String toolLabel) {
        if (data == null || data.cards() == null || data.cards().isEmpty()) {
            throw new InvalidAiResponseException(toolLabel + ": add at least one flip card.");
        }
        for (FlipGridCardDataDto card : data.cards()) {
            if (card == null || card.id() == null
                    || isBlank(card.frontTitle()) || isBlank(card.backTitle()) || isBlank(card.description())) {
                throw new InvalidAiResponseException(
                        toolLabel + ": every flip card needs frontTitle, backTitle, and description."
                );
            }
        }
    }

    private void validateImageData(ImageToolDataDto data, String toolLabel) {
        if (data == null || data.file() != null || !"".equals(data.imageKey())) {
            throw new InvalidAiResponseException(toolLabel + ": image drafts must not include media.");
        }
    }

    private void validateVideoData(VideoToolDataDto data, String toolLabel) {
        if (data == null || data.file() != null || !"".equals(data.videoKey())) {
            throw new InvalidAiResponseException(toolLabel + ": video drafts must not include media.");
        }
    }

    private void validateImageLeftTextData(ImageLeftTextToolDataDto data, String toolLabel) {
        if (data == null || data.file() != null || !"".equals(data.imageKey())
                || isBlank(data.title()) || isBlank(data.description())) {
            throw new InvalidAiResponseException(
                    toolLabel + ": image-left-text drafts require empty media, title, and description."
            );
        }
    }

    private void validateImageRightTextData(ImageRightTextToolDataDto data, String toolLabel) {
        if (data == null || data.file() != null || !"".equals(data.imageKey())
                || isBlank(data.title()) || isBlank(data.description())) {
            throw new InvalidAiResponseException(
                    toolLabel + ": image-right-text drafts require empty media, title, and description."
            );
        }
    }

    private void validateListItems(List<LessonListItemInputDto> items) {
        if (items == null || items.isEmpty()) {
            throw new InvalidAiResponseException("List tools require at least one item.");
        }
        for (LessonListItemInputDto item : items) {
            if (item == null || isBlank(item.text())) {
                throw new InvalidAiResponseException("Every list item must include text.");
            }
        }
    }

    private void validateTabItems(List<LessonTabItemInputDto> items) {
        if (items == null || items.isEmpty()) {
            throw new InvalidAiResponseException("Tabs require at least one item.");
        }
        for (LessonTabItemInputDto item : items) {
            if (item == null || isBlank(item.label()) || isBlank(item.title()) || isBlank(item.description())) {
                throw new InvalidAiResponseException("Every tab item needs label, title, and description.");
            }
        }
    }

    private void validateAccordionItems(List<com.capstone.rebyu.ai.dto.LessonAccordionItemInputDto> items) {
        if (items == null || items.isEmpty()) {
            throw new InvalidAiResponseException("Accordion tools require at least one item.");
        }
        for (var item : items) {
            if (item == null || isBlank(item.title()) || isBlank(item.content())) {
                throw new InvalidAiResponseException("Every accordion item needs title and content.");
            }
        }
    }

    private void validateFlipGridCards(List<com.capstone.rebyu.ai.dto.FlipGridCardInputDto> cards) {
        if (cards == null || cards.isEmpty()) {
            throw new InvalidAiResponseException("Flip-grid tools require at least one card.");
        }
        for (var card : cards) {
            if (card == null || isBlank(card.frontTitle()) || isBlank(card.backTitle()) || isBlank(card.description())) {
                throw new InvalidAiResponseException(
                        "Every flip-grid card needs frontTitle, backTitle, and description."
                );
            }
        }
    }

    // ──────────────────────────────────────────────
    // Combined tool data validators
    // ──────────────────────────────────────────────

    private void validateCombinedHeaderDesc(IntroImageCardToolDataDto data, String toolLabel) {
        if (data == null) {
            throw new InvalidAiResponseException(toolLabel + ": intro-image-card data is missing.");
        }
        validateCombinedSmallHeader(data.smallHeader(), data.description(), toolLabel);
    }

    private void validateCombinedSmallHeader(String smallHeader, String description, String toolLabel) {
        if (isBlank(smallHeader)) {
            throw new InvalidAiResponseException(toolLabel + ": smallHeader is required.");
        }
        if (isBlank(description)) {
            throw new InvalidAiResponseException(toolLabel + ": description is required.");
        }
    }

    private void validateGridItemData(List<GridItemDataDto> items, String toolLabel) {
        if (items == null || items.isEmpty()) {
            throw new InvalidAiResponseException(toolLabel + ": at least one grid item is required.");
        }
        for (GridItemDataDto item : items) {
            if (item == null || isBlank(item.title()) || isBlank(item.description())) {
                throw new InvalidAiResponseException(toolLabel + ": every grid item needs a title and description.");
            }
        }
    }

    private void validateReviewCardData(List<ReviewCardDataDto> cards, String toolLabel) {
        if (cards == null || cards.isEmpty()) {
            throw new InvalidAiResponseException(toolLabel + ": at least one review card is required.");
        }
        for (ReviewCardDataDto card : cards) {
            if (card == null || isBlank(card.frontTitle()) || isBlank(card.backTitle()) || isBlank(card.description())) {
                throw new InvalidAiResponseException(
                        toolLabel + ": every review card needs frontTitle, backTitle, and description."
                );
            }
        }
    }

    private void validateGridItems(List<GridItemInputDto> items) {
        if (items == null || items.size() < 2) {
            throw new InvalidAiResponseException("Grid tools require at least two items.");
        }
        for (GridItemInputDto item : items) {
            if (item == null || isBlank(item.title()) || isBlank(item.description())) {
                throw new InvalidAiResponseException("Every grid item must include title and description.");
            }
        }
    }

    private void validateReviewCards(List<ReviewCardInputDto> cards) {
        if (cards == null || cards.isEmpty()) {
            throw new InvalidAiResponseException("Review-card-grid requires at least one card.");
        }
        for (ReviewCardInputDto card : cards) {
            if (card == null || isBlank(card.frontTitle()) || isBlank(card.backTitle()) || isBlank(card.description())) {
                throw new InvalidAiResponseException(
                        "Every review card needs frontTitle, backTitle, and description."
                );
            }
        }
    }

    // ──────────────────────────────────────────────
    // Shared helpers
    // ──────────────────────────────────────────────

    private void requireSection(UUID sectionDraftId) {
        if (sectionDraftId == null || !lessonDraftCollector.sectionExists(sectionDraftId)) {
            throw new InvalidAiResponseException("Unknown section draft id: " + sectionDraftId);
        }
    }

    private void requireNonBlank(String value, String fieldName) {
        if (isBlank(value)) {
            throw new InvalidAiResponseException(fieldName + " is required.");
        }
    }

    private void requireAuthoringNotes(String authoringNotes, String toolLabel) {
        if (isBlank(authoringNotes)) {
            throw new InvalidAiResponseException(toolLabel + ": authoring notes are required.");
        }
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }

    private <T> T asType(Object data, Class<T> type) {
        if (data == null) {
            return null;
        }
        if (type.isInstance(data)) {
            return type.cast(data);
        }
        throw new InvalidAiResponseException("Tool data has an unexpected shape for " + type.getSimpleName() + ".");
    }
}
