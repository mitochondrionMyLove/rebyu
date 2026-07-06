package com.capstone.rebyu.ai.tools;

import com.capstone.rebyu.ai.collector.LessonDraftCollector;
import com.capstone.rebyu.ai.context.LessonGenerationExecutionContext;
import com.capstone.rebyu.ai.dto.AccordionToolInputDto;
import com.capstone.rebyu.ai.dto.DescriptionToolInputDto;
import com.capstone.rebyu.ai.dto.FlipGridToolInputDto;
import com.capstone.rebyu.ai.dto.GeneratedLessonSectionReferenceDto;
import com.capstone.rebyu.ai.dto.GeneratedLessonToolDraftDto;
import com.capstone.rebyu.ai.dto.HeadingToolInputDto;
import com.capstone.rebyu.ai.dto.ImageLeftTextToolInputDto;
import com.capstone.rebyu.ai.dto.ImageRightTextToolInputDto;
import com.capstone.rebyu.ai.dto.ImageToolInputDto;
import com.capstone.rebyu.ai.dto.LessonSectionDraftInputDto;
import com.capstone.rebyu.ai.dto.OrderedListToolInputDto;
import com.capstone.rebyu.ai.dto.SubheadingToolInputDto;
import com.capstone.rebyu.ai.dto.TabsToolInputDto;
import com.capstone.rebyu.ai.dto.UnorderedListToolInputDto;
import com.capstone.rebyu.ai.dto.VideoToolInputDto;
import com.capstone.rebyu.ai.mapper.GeneratedLessonToolDraftMapper;
import com.capstone.rebyu.ai.service.LessonToolDraftValidator;
import dev.langchain4j.agent.tool.Tool;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@RequiredArgsConstructor
public class LessonComponentDraftTools {

    private final LessonDraftCollector lessonDraftCollector;
    private final LessonToolDraftValidator lessonToolDraftValidator;
    private final GeneratedLessonToolDraftMapper lessonToolDraftMapper;
    private final LessonGenerationExecutionContext generationExecutionContext;

    @Tool("""
            Create one editable lesson section.

            Use a concise, meaningful section name based only on grounded source content.
            Create a section before adding content tools into it.

            Do not save a lesson or section to the database.
            """)
    public GeneratedLessonSectionReferenceDto createLessonSection(
            LessonSectionDraftInputDto input
    ) {
        lessonToolDraftValidator.validateSection(input, generationExecutionContext);

        UUID sectionDraftId = lessonDraftCollector.createSection(input.sectionName().trim());

        return new GeneratedLessonSectionReferenceDto(
                sectionDraftId,
                input.sectionName().trim()
        );
    }

    @Tool("""
            Add a main heading to an editable lesson section.

            Use this only when a major subtopic needs a clear title.
            Do not overuse headings. Do not save anything.
            """)
    public GeneratedLessonToolDraftDto createHeadingTool(
            HeadingToolInputDto input
    ) {
        lessonToolDraftValidator.validateHeading(input, generationExecutionContext);

        GeneratedLessonToolDraftDto draft = lessonToolDraftMapper.heading(
                createLocalDraftId(),
                input.text().trim(),
                input.authoringNotes()
        );

        lessonDraftCollector.addTool(input.sectionDraftId(), draft);
        return draft;
    }

    @Tool("""
            Add a supporting subheading to an editable lesson section.

            Use this only when a smaller concept needs organization under a heading.
            Do not save anything.
            """)
    public GeneratedLessonToolDraftDto createSubheadingTool(
            SubheadingToolInputDto input
    ) {
        lessonToolDraftValidator.validateSubheading(input, generationExecutionContext);

        GeneratedLessonToolDraftDto draft = lessonToolDraftMapper.subheading(
                createLocalDraftId(),
                input.text().trim(),
                input.authoringNotes()
        );

        lessonDraftCollector.addTool(input.sectionDraftId(), draft);
        return draft;
    }

    @Tool("""
            Add an explanatory text block to an editable lesson section.

            Use this for grounded definitions, explanations, procedures, examples, and
            concept clarification. Do not invent unsupported facts or examples.
            Do not save anything.
            """)
    public GeneratedLessonToolDraftDto createDescriptionTool(
            DescriptionToolInputDto input
    ) {
        lessonToolDraftValidator.validateDescription(input, generationExecutionContext);

        GeneratedLessonToolDraftDto draft = lessonToolDraftMapper.description(
                input,
                createLocalDraftId()
        );

        lessonDraftCollector.addTool(input.sectionDraftId(), draft);
        return draft;
    }

    @Tool("""
            Add a bullet list to an editable lesson section.

            Use this for related key points, characteristics, requirements, benefits,
            limitations, or grouped facts. Do not use it when paragraph explanation is
            clearer. Do not save anything.
            """)
    public GeneratedLessonToolDraftDto createUnorderedListTool(
            UnorderedListToolInputDto input
    ) {
        lessonToolDraftValidator.validateUnorderedList(input, generationExecutionContext);

        GeneratedLessonToolDraftDto draft = lessonToolDraftMapper.unorderedList(
                input,
                createLocalDraftId()
        );

        lessonDraftCollector.addTool(input.sectionDraftId(), draft);
        return draft;
    }

    @Tool("""
            Add a numbered list to an editable lesson section.

            Use this only for steps, sequences, procedures, workflows, or ordered methods.
            Do not save anything.
            """)
    public GeneratedLessonToolDraftDto createOrderedListTool(
            OrderedListToolInputDto input
    ) {
        lessonToolDraftValidator.validateOrderedList(input, generationExecutionContext);

        GeneratedLessonToolDraftDto draft = lessonToolDraftMapper.orderedList(
                input,
                createLocalDraftId()
        );

        lessonDraftCollector.addTool(input.sectionDraftId(), draft);
        return draft;
    }

    @Tool("""
            Add an image-left-with-text lesson draft only when a visual would materially
            improve understanding.

            Create only the title, description, and authoring notes.
            Never provide an image file, image key, image URL, blob, or external link.

            The admin must manually upload the real image before saving the lesson.
            """)
    public GeneratedLessonToolDraftDto createImageLeftTextTool(
            ImageLeftTextToolInputDto input
    ) {
        lessonToolDraftValidator.validateImageLeftText(input, generationExecutionContext);

        GeneratedLessonToolDraftDto draft = lessonToolDraftMapper.imageLeftText(
                input,
                createLocalDraftId()
        );

        lessonDraftCollector.addTool(input.sectionDraftId(), draft);
        return draft;
    }

    @Tool("""
            Add a text-left-with-image lesson draft only when a visual would materially
            improve understanding.

            Create only text and authoring notes.
            Always force file to null and imageKey to an empty string.
            The admin manually uploads the real image later.
            """)
    public GeneratedLessonToolDraftDto createImageRightTextTool(
            ImageRightTextToolInputDto input
    ) {
        lessonToolDraftValidator.validateImageRightText(input, generationExecutionContext);

        GeneratedLessonToolDraftDto draft = lessonToolDraftMapper.imageRightText(
                input,
                createLocalDraftId()
        );

        lessonDraftCollector.addTool(input.sectionDraftId(), draft);
        return draft;
    }

    @Tool("""
            Add tabs to an editable lesson section.

            Use tabs only when related content benefits from separate views, such as
            comparisons, categories, roles, grouped concepts, advantages, or limitations.
            Do not use tabs merely to make the lesson look more complex.
            Do not save anything.
            """)
    public GeneratedLessonToolDraftDto createTabsTool(
            TabsToolInputDto input
    ) {
        lessonToolDraftValidator.validateTabs(input, generationExecutionContext);

        GeneratedLessonToolDraftDto draft = lessonToolDraftMapper.tabs(
                input,
                createLocalDraftId()
        );

        lessonDraftCollector.addTool(input.sectionDraftId(), draft);
        return draft;
    }

    @Tool("""
            Add an accordion to an editable lesson section.

            Use this for expandable explanations, detailed steps, commonly confused
            concepts, grouped definitions, or supporting reference content.
            Do not save anything.
            """)
    public GeneratedLessonToolDraftDto createAccordionTool(
            AccordionToolInputDto input
    ) {
        lessonToolDraftValidator.validateAccordion(input, generationExecutionContext);

        GeneratedLessonToolDraftDto draft = lessonToolDraftMapper.accordion(
                input,
                createLocalDraftId()
        );

        lessonDraftCollector.addTool(input.sectionDraftId(), draft);
        return draft;
    }

    @Tool("""
            Add a flip-card grid to an editable lesson section.

            Use this only for concise review pairs such as:
            - term and definition
            - concept and explanation
            - rule and meaning
            - question and answer
            - abbreviation and full meaning

            Create one or more cards. Every card needs frontTitle, backTitle, and
            description. Do not create images or videos. Do not save anything.
            """)
    public GeneratedLessonToolDraftDto createFlipGridTool(
            FlipGridToolInputDto input
    ) {
        lessonToolDraftValidator.validateFlipGrid(input, generationExecutionContext);

        GeneratedLessonToolDraftDto draft = lessonToolDraftMapper.flipGrid(
                input,
                createLocalDraftId()
        );

        lessonDraftCollector.addTool(input.sectionDraftId(), draft);
        return draft;
    }

    @Tool("""
            Add an image draft only when an image is truly needed to support the lesson.

            Do not generate the image, imageKey, image URL, file, blob, or external link.
            Return only authoring notes and optional alt text.

            The admin must upload the real image before saving.
            """)
    public GeneratedLessonToolDraftDto createImageTool(
            ImageToolInputDto input
    ) {
        lessonToolDraftValidator.validateImage(input, generationExecutionContext);

        GeneratedLessonToolDraftDto draft = lessonToolDraftMapper.image(
                input,
                createLocalDraftId()
        );

        lessonDraftCollector.addTool(input.sectionDraftId(), draft);
        return draft;
    }

    @Tool("""
            Add a video draft only when a demonstration would materially improve learning.

            Do not generate a video, videoKey, video URL, file, blob, or external link.
            Return only authoring notes and an optional learner-facing description.

            The admin must upload the real video before saving.
            """)
    public GeneratedLessonToolDraftDto createVideoTool(
            VideoToolInputDto input
    ) {
        lessonToolDraftValidator.validateVideo(input, generationExecutionContext);

        GeneratedLessonToolDraftDto draft = lessonToolDraftMapper.video(
                input,
                createLocalDraftId()
        );

        lessonDraftCollector.addTool(input.sectionDraftId(), draft);
        return draft;
    }

    private UUID createLocalDraftId() {
        return UUID.randomUUID();
    }
}
