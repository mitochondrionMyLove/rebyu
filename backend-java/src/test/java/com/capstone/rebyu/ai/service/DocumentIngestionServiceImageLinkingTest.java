package com.capstone.rebyu.ai.service;

import dev.langchain4j.data.document.Metadata;
import dev.langchain4j.data.segment.TextSegment;
import org.junit.jupiter.api.Test;

import java.lang.reflect.Method;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * Exercises DocumentIngestionService's pure chunk/image-linking logic
 * (attachImageLinksAndStripMarkers) without needing S3/pgvector/AI — the
 * core mechanism that links extracted images to the relevant text chunk via
 * chunk metadata instead of embedding image data.
 */
class DocumentIngestionServiceImageLinkingTest {

    private final DocumentIngestionService service = new DocumentIngestionService(
            null, null, null, null, null, null, null, null, null, null);

    @SuppressWarnings("unchecked")
    private List<TextSegment> invoke(List<TextSegment> segments) throws Exception {
        Method method = DocumentIngestionService.class
                .getDeclaredMethod("attachImageLinksAndStripMarkers", List.class);
        method.setAccessible(true);
        return (List<TextSegment>) method.invoke(service, segments);
    }

    @Test
    void linksAnImageKeyAndStripsTheMarkerFromEmbeddedText() throws Exception {
        TextSegment segment = TextSegment.from(
                "Figure 1 shows the network topology.\n"
                        + "[SOURCE_IMAGE key=\"question-source-images/abc-p1-1.png\" page=1 order=1]\n"
                        + "The router forwards packets between subnets.",
                Metadata.from("documentId", "9"));

        List<TextSegment> result = invoke(List.of(segment));

        assertEquals(1, result.size());
        TextSegment linked = result.get(0);
        assertFalse(linked.text().contains("SOURCE_IMAGE"),
                "marker syntax must not pollute the embedded/searchable text");
        assertTrue(linked.text().contains("Figure 1 shows the network topology."));
        assertTrue(linked.text().contains("router forwards packets"));
        assertEquals("question-source-images/abc-p1-1.png", linked.metadata().getString("imageKeys"));
        // Metadata already on the segment (documentId etc.) must survive.
        assertEquals("9", linked.metadata().getString("documentId"));
    }

    @Test
    void linksMultipleImageKeysInOneChunkAsCommaJoined() throws Exception {
        TextSegment segment = TextSegment.from(
                "[SOURCE_IMAGE key=\"img-a\" page=1 order=1]\n"
                        + "Some connecting text.\n"
                        + "[SOURCE_IMAGE key=\"img-b\" page=1 order=2]",
                new Metadata());

        List<TextSegment> result = invoke(List.of(segment));

        String imageKeys = result.get(0).metadata().getString("imageKeys");
        assertEquals("img-a,img-b", imageKeys);
    }

    @Test
    void segmentWithoutAMarkerIsReturnedUnchanged() throws Exception {
        TextSegment segment = TextSegment.from("Plain paragraph, no images here.", new Metadata());

        List<TextSegment> result = invoke(List.of(segment));

        assertSame(segment, result.get(0));
        assertNull(result.get(0).metadata().getString("imageKeys"));
    }
}
