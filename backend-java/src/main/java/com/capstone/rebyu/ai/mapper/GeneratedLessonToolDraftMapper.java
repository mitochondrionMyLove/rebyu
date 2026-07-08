package com.capstone.rebyu.ai.mapper;

import com.capstone.rebyu.ai.dto.AccordionToolInputDto;
import com.capstone.rebyu.ai.dto.ContentAccordionBlockToolInputDto;
import com.capstone.rebyu.ai.dto.ContentTabsBlockToolInputDto;
import com.capstone.rebyu.ai.dto.DescriptionToolInputDto;
import com.capstone.rebyu.ai.dto.FlipGridToolInputDto;
import com.capstone.rebyu.ai.dto.GeneratedLessonToolDraftDto;
import com.capstone.rebyu.ai.dto.GridItemInputDto;
import com.capstone.rebyu.ai.dto.HeaderDescriptionGridToolInputDto;
import com.capstone.rebyu.ai.dto.HeadingToolInputDto;
import com.capstone.rebyu.ai.dto.ImageFeatureGridToolInputDto;
import com.capstone.rebyu.ai.dto.ImageLeftTextToolInputDto;
import com.capstone.rebyu.ai.dto.ImageRightTextToolInputDto;
import com.capstone.rebyu.ai.dto.ImageToolInputDto;
import com.capstone.rebyu.ai.dto.IntroImageCardToolInputDto;
import com.capstone.rebyu.ai.dto.LessonAccordionItemInputDto;
import com.capstone.rebyu.ai.dto.LessonListItemInputDto;
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
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.UUID;

@Component
public class GeneratedLessonToolDraftMapper {

    // ──────────────────────────────────────────────
    // Individual tools
    // ──────────────────────────────────────────────

    public GeneratedLessonToolDraftDto heading(UUID id, String text, String authoringNotes) {
        return new GeneratedLessonToolDraftDto(
                id,
                "heading",
                new HeadingToolDataDto(text),
                normalizeNotes(authoringNotes)
        );
    }

    public GeneratedLessonToolDraftDto subheading(UUID id, String text, String authoringNotes) {
        return new GeneratedLessonToolDraftDto(
                id,
                "subheading",
                new SubheadingToolDataDto(text),
                normalizeNotes(authoringNotes)
        );
    }

    public GeneratedLessonToolDraftDto description(DescriptionToolInputDto input, UUID id) {
        return new GeneratedLessonToolDraftDto(
                id,
                "description",
                new DescriptionToolDataDto(input.text().trim()),
                normalizeNotes(input.authoringNotes())
        );
    }

    public GeneratedLessonToolDraftDto unorderedList(UnorderedListToolInputDto input, UUID id) {
        List<ListItemDataDto> items = input.items().stream()
                .map(this::toListItem)
                .toList();
        return new GeneratedLessonToolDraftDto(
                id,
                "unordered-list",
                new UnorderedListToolDataDto(items),
                normalizeNotes(input.authoringNotes())
        );
    }

    public GeneratedLessonToolDraftDto orderedList(OrderedListToolInputDto input, UUID id) {
        List<ListItemDataDto> items = input.items().stream()
                .map(this::toListItem)
                .toList();
        return new GeneratedLessonToolDraftDto(
                id,
                "ordered-list",
                new OrderedListToolDataDto(items),
                normalizeNotes(input.authoringNotes())
        );
    }

    public GeneratedLessonToolDraftDto imageLeftText(ImageLeftTextToolInputDto input, UUID id) {
        return new GeneratedLessonToolDraftDto(
                id,
                "image-left-text",
                ImageLeftTextToolDataDto.draft(input.title().trim(), input.description().trim()),
                input.authoringNotes().trim()
        );
    }

    public GeneratedLessonToolDraftDto imageRightText(ImageRightTextToolInputDto input, UUID id) {
        return new GeneratedLessonToolDraftDto(
                id,
                "image-right-text",
                ImageRightTextToolDataDto.draft(input.title().trim(), input.description().trim()),
                input.authoringNotes().trim()
        );
    }

    public GeneratedLessonToolDraftDto tabs(TabsToolInputDto input, UUID id) {
        List<TabItemDataDto> items = input.items().stream()
                .map(this::toTabItem)
                .toList();
        return new GeneratedLessonToolDraftDto(
                id,
                "tabs",
                new TabsToolDataDto(items),
                normalizeNotes(input.authoringNotes())
        );
    }

    public GeneratedLessonToolDraftDto accordion(AccordionToolInputDto input, UUID id) {
        List<AccordionItemDataDto> items = input.items().stream()
                .map(this::toAccordionItem)
                .toList();
        return new GeneratedLessonToolDraftDto(
                id,
                "accordion",
                new AccordionToolDataDto(items),
                normalizeNotes(input.authoringNotes())
        );
    }

    public GeneratedLessonToolDraftDto flipGrid(FlipGridToolInputDto input, UUID id) {
        List<FlipGridCardDataDto> cards = input.cards().stream()
                .map(card -> new FlipGridCardDataDto(
                        UUID.randomUUID(),
                        card.frontTitle().trim(),
                        card.backTitle().trim(),
                        card.description().trim()
                ))
                .toList();
        return new GeneratedLessonToolDraftDto(
                id,
                "flip-grid",
                new FlipGridToolDataDto(cards),
                normalizeNotes(input.authoringNotes())
        );
    }

    public GeneratedLessonToolDraftDto image(ImageToolInputDto input, UUID id) {
        return new GeneratedLessonToolDraftDto(
                id,
                "image",
                ImageToolDataDto.draft(),
                input.authoringNotes().trim()
        );
    }

    public GeneratedLessonToolDraftDto video(VideoToolInputDto input, UUID id) {
        return new GeneratedLessonToolDraftDto(
                id,
                "video",
                VideoToolDataDto.draft(),
                input.authoringNotes().trim()
        );
    }

    // ──────────────────────────────────────────────
    // Combined tools
    // ──────────────────────────────────────────────

    public GeneratedLessonToolDraftDto introImageCard(IntroImageCardToolInputDto input, UUID id) {
        return new GeneratedLessonToolDraftDto(
                id,
                "intro-image-card",
                IntroImageCardToolDataDto.draft(
                        input.smallHeader().trim(),
                        input.description().trim()
                ),
                normalizeNotes(input.authoringNotes())
        );
    }

    public GeneratedLessonToolDraftDto headerDescriptionGrid(HeaderDescriptionGridToolInputDto input, UUID id) {
        List<GridItemDataDto> gridItems = input.gridItems().stream()
                .map(this::toGridItem)
                .toList();
        return new GeneratedLessonToolDraftDto(
                id,
                "header-description-grid",
                new HeaderDescriptionGridToolDataDto(
                        input.smallHeader().trim(),
                        input.description().trim(),
                        gridItems
                ),
                normalizeNotes(input.authoringNotes())
        );
    }

    public GeneratedLessonToolDraftDto imageFeatureGrid(ImageFeatureGridToolInputDto input, UUID id) {
        List<GridItemDataDto> gridItems = input.gridItems().stream()
                .map(this::toGridItem)
                .toList();
        return new GeneratedLessonToolDraftDto(
                id,
                "image-feature-grid",
                ImageFeatureGridToolDataDto.draft(
                        input.smallHeader().trim(),
                        input.description().trim(),
                        gridItems
                ),
                normalizeNotes(input.authoringNotes())
        );
    }

    public GeneratedLessonToolDraftDto reviewCardGrid(ReviewCardGridToolInputDto input, UUID id) {
        List<ReviewCardDataDto> cards = input.cards().stream()
                .map(card -> new ReviewCardDataDto(
                        UUID.randomUUID(),
                        card.frontTitle().trim(),
                        card.backTitle().trim(),
                        card.description().trim()
                ))
                .toList();
        return new GeneratedLessonToolDraftDto(
                id,
                "review-card-grid",
                new ReviewCardGridToolDataDto(
                        input.smallHeader().trim(),
                        input.description().trim(),
                        cards
                ),
                normalizeNotes(input.authoringNotes())
        );
    }

    public GeneratedLessonToolDraftDto contentAccordionBlock(ContentAccordionBlockToolInputDto input, UUID id) {
        List<AccordionItemDataDto> items = input.items().stream()
                .map(this::toAccordionItem)
                .toList();
        return new GeneratedLessonToolDraftDto(
                id,
                "content-accordion-block",
                new ContentAccordionBlockToolDataDto(
                        input.smallHeader().trim(),
                        input.description().trim(),
                        items
                ),
                normalizeNotes(input.authoringNotes())
        );
    }

    public GeneratedLessonToolDraftDto contentTabsBlock(ContentTabsBlockToolInputDto input, UUID id) {
        List<TabItemDataDto> items = input.items().stream()
                .map(this::toTabItem)
                .toList();
        return new GeneratedLessonToolDraftDto(
                id,
                "content-tabs-block",
                new ContentTabsBlockToolDataDto(
                        input.smallHeader().trim(),
                        input.description().trim(),
                        items
                ),
                normalizeNotes(input.authoringNotes())
        );
    }

    public GeneratedLessonToolDraftDto mediaTextBlock(MediaTextBlockToolInputDto input, UUID id) {
        String mediaType = input.mediaType() != null ? input.mediaType().trim() : "image";
        String layout = input.layout() != null ? input.layout().trim() : "image-left";
        return new GeneratedLessonToolDraftDto(
                id,
                "media-text-block",
                MediaTextBlockToolDataDto.draft(
                        input.smallHeader().trim(),
                        input.description().trim(),
                        input.supportingTitle() != null ? input.supportingTitle().trim() : "",
                        input.supportingDescription() != null ? input.supportingDescription().trim() : "",
                        mediaType,
                        layout
                ),
                normalizeNotes(input.authoringNotes())
        );
    }

    // ──────────────────────────────────────────────
    // Helpers
    // ──────────────────────────────────────────────

    private ListItemDataDto toListItem(LessonListItemInputDto item) {
        return new ListItemDataDto(UUID.randomUUID(), item.text().trim());
    }

    private TabItemDataDto toTabItem(LessonTabItemInputDto item) {
        return new TabItemDataDto(
                UUID.randomUUID(),
                item.label().trim(),
                item.title().trim(),
                item.description().trim()
        );
    }

    private AccordionItemDataDto toAccordionItem(LessonAccordionItemInputDto item) {
        return new AccordionItemDataDto(
                UUID.randomUUID(),
                item.title().trim(),
                item.content().trim()
        );
    }

    private GridItemDataDto toGridItem(GridItemInputDto item) {
        return new GridItemDataDto(
                UUID.randomUUID(),
                item.title().trim(),
                item.description().trim()
        );
    }

    private String normalizeNotes(String authoringNotes) {
        return authoringNotes == null ? "" : authoringNotes.trim();
    }
}
