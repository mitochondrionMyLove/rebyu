package com.capstone.rebyu.diagram.service;

import com.capstone.rebyu.diagram.dto.DiagramGraphDto;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

class DiagramGraphExtractorTest {

    private final DiagramGraphExtractor extractor = new DiagramGraphExtractor();

    private static final String TWO_NODE_ONE_EDGE_XML = """
            <mxGraphModel dx="800" dy="600" grid="1" gridSize="10" guides="1" tooltips="1"
                connect="1" arrows="1" fold="1" page="1" pageScale="1" math="0" shadow="0">
              <root>
                <mxCell id="0" />
                <mxCell id="1" parent="0" />
                <mxCell id="2" value="Student" style="rounded=0;whiteSpace=wrap;html=1;" vertex="1" parent="1">
                  <mxGeometry x="40" y="40" width="120" height="60" as="geometry" />
                </mxCell>
                <mxCell id="3" value="Course" style="rounded=0;whiteSpace=wrap;html=1;" vertex="1" parent="1">
                  <mxGeometry x="260" y="40" width="120" height="60" as="geometry" />
                </mxCell>
                <mxCell id="4" value="enrolls in 1..*" style="edgeStyle=orthogonalEdgeStyle;html=1;"
                    edge="1" parent="1" source="2" target="3">
                  <mxGeometry relative="1" as="geometry" />
                </mxCell>
              </root>
            </mxGraphModel>
            """;

    @Test
    void extractsNodesAndEdgesFromMxGraphModel() {
        DiagramGraphDto graph = extractor.extract(TWO_NODE_ONE_EDGE_XML);

        assertEquals(2, graph.nodes().size());
        assertEquals(1, graph.edges().size());
        assertTrue(graph.nodes().stream().anyMatch(n -> n.labelKey().equals("student")));
        assertTrue(graph.nodes().stream().anyMatch(n -> n.labelKey().equals("course")));

        DiagramGraphDto.Edge edge = graph.edges().get(0);
        assertEquals("2", edge.sourceId());
        assertEquals("3", edge.targetId());
        assertEquals("enrolls in 1..*", edge.labelKey());
    }

    @Test
    void blankXmlReturnsEmptyGraph() {
        DiagramGraphDto graph = extractor.extract("   ");
        assertEquals(List.of(), graph.nodes());
        assertEquals(List.of(), graph.edges());
    }

    @Test
    void malformedXmlThrowsRatherThanReturningGarbage() {
        assertThrows(DiagramGraphExtractor.DiagramParseException.class,
                () -> extractor.extract("<mxGraphModel><root>"));
    }

    @Test
    void doctypeDeclarationIsRejectedForXxeHardening() {
        String maliciousXml = """
                <?xml version="1.0"?>
                <!DOCTYPE mxGraphModel [<!ENTITY xxe SYSTEM "file:///etc/passwd">]>
                <mxGraphModel><root><mxCell id="0"/><mxCell id="1" parent="0"/></root></mxGraphModel>
                """;
        assertThrows(DiagramGraphExtractor.DiagramParseException.class,
                () -> extractor.extract(maliciousXml));
    }
}
