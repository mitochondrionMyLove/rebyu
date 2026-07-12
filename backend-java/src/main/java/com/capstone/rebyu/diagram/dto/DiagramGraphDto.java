package com.capstone.rebyu.diagram.dto;

import java.util.List;

/**
 * A draw.io diagram reduced to its structural graph: labeled nodes and the
 * labeled, directed connections between them. This — not the raw XML — is
 * what {@code DiagramGradingService} compares against the reference diagram.
 */
public record DiagramGraphDto(List<Node> nodes, List<Edge> edges) {

    public record Node(String id, String label, String labelKey, String nodeType) {}

    public record Edge(
            String id,
            String sourceId,
            String targetId,
            String label,
            String labelKey
    ) {}
}
