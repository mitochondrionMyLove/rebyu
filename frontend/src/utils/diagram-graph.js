function cleanLabel(value = "") {
    const parser = new DOMParser()

    const document = parser.parseFromString(
        `<div>${value}</div>`,
        "text/html"
    )

    return (document.body.textContent ?? "")
        .replace(/\s+/g, " ")
        .trim()
}

function normalizeLabel(value = "") {
    return cleanLabel(value)
        .toLowerCase()
        .replace(/\s+/g, " ")
        .trim()
}

function parseStyle(styleText = "") {
    return styleText
        .split(";")
        .filter(Boolean)
        .reduce((result, stylePart) => {
            const [rawKey, ...rawValue] = stylePart.split("=")
            const key = rawKey.trim()

            if (!key) {
                return result
            }

            result[key] = rawValue.join("=") || "1"

            return result
        }, {})
}

function getCellLabel(cell) {
    const directValue = cell.getAttribute("value")

    if (directValue) {
        return cleanLabel(directValue)
    }

    /*
      Some Draw.io elements are wrapped like this:

      <object label="Student">
        <mxCell vertex="1" />
      </object>
    */
    const parent = cell.parentElement

    return cleanLabel(
        parent?.getAttribute("label") ??
        parent?.getAttribute("value") ??
        ""
    )
}

function getGeometry(cell) {
    const geometry = Array.from(cell.children).find(
        (child) => child.tagName === "mxGeometry"
    )

    if (!geometry) {
        return null
    }

    return {
        x: Number(geometry.getAttribute("x") ?? 0),
        y: Number(geometry.getAttribute("y") ?? 0),
        width: Number(geometry.getAttribute("width") ?? 0),
        height: Number(geometry.getAttribute("height") ?? 0),
    }
}

function isTextOnlyCell(cell) {
    const style = parseStyle(
        cell.getAttribute("style") ?? ""
    )

    return (
        style.text === "1" ||
        style.shape === "label" ||
        style.shape === "text"
    )
}

function getNodeType(styleText = "") {
    const style = parseStyle(styleText)

    const shape = (
        style.shape ??
        (style.rounded === "1" ? "rounded" : "rectangle")
    ).toLowerCase()

    if (
        shape === "rhombus" ||
        shape === "diamond"
    ) {
        return "diamond"
    }

    if (
        shape === "ellipse" ||
        shape === "doubleellipse"
    ) {
        return "ellipse"
    }

    if (shape === "cylinder") {
        return "data-store"
    }

    if (
        shape === "process" ||
        shape.includes("process")
    ) {
        return "process"
    }

    if (
        shape === "swimlane" ||
        style.swimlane === "1"
    ) {
        return "container"
    }

    return "shape"
}

function getGraphModelDocument(xml) {
    const parser = new DOMParser()

    const document = parser.parseFromString(
        xml,
        "application/xml"
    )

    const parserError =
        document.getElementsByTagName("parsererror")[0]

    if (parserError) {
        throw new Error("Diagram XML could not be parsed.")
    }

    const directGraphModel =
        document.getElementsByTagName("mxGraphModel")[0]

    if (directGraphModel) {
        return directGraphModel
    }

    /*
      Supports an uncompressed <mxfile><diagram>...</diagram></mxfile>
      where the mxGraphModel is stored as text inside <diagram>.
    */
    const diagramElement =
        document.getElementsByTagName("diagram")[0]

    const diagramXml = diagramElement?.textContent?.trim()

    if (
        diagramXml &&
        diagramXml.includes("<mxGraphModel")
    ) {
        const nestedDocument = parser.parseFromString(
            diagramXml,
            "application/xml"
        )

        const nestedParserError =
            nestedDocument.getElementsByTagName(
                "parsererror"
            )[0]

        if (nestedParserError) {
            throw new Error("Nested diagram XML could not be parsed.")
        }

        const nestedGraphModel =
            nestedDocument.getElementsByTagName(
                "mxGraphModel"
            )[0]

        if (nestedGraphModel) {
            return nestedGraphModel
        }
    }

    throw new Error(
        "No readable mxGraphModel was found. Ensure Draw.io returns uncompressed XML."
    )
}

function resolveNodeId(
    startingId,
    cellsById,
    nodesById
) {
    if (!startingId) {
        return null
    }

    let currentCell = cellsById.get(startingId)
    const visitedIds = new Set()

    while (currentCell) {
        const currentId = currentCell.getAttribute("id")

        if (!currentId || visitedIds.has(currentId)) {
            return null
        }

        visitedIds.add(currentId)

        if (nodesById.has(currentId)) {
            return currentId
        }

        const parentId = currentCell.getAttribute("parent")

        if (!parentId) {
            return null
        }

        currentCell = cellsById.get(parentId)
    }

    return null
}

/*
  Output example:

  {
    nodes: [
      {
        id: "student-id",
        label: "Student",
        labelKey: "student",
        nodeType: "shape",
        style: "...",
        geometry: { x, y, width, height }
      }
    ],

    edges: [
      {
        id: "edge-id",
        sourceId: "student-id",
        targetId: "course-id",
        sourceLabel: "Student",
        targetLabel: "Course",
        sourceLabelKey: "student",
        targetLabelKey: "course",
        label: "enrolls",
        labelKey: "enrolls",
        style: "..."
      }
    ]
  }
*/
export function extractDiagramData(xml) {
    if (typeof xml !== "string" || !xml.trim()) {
        return {
            nodes: [],
            edges: [],
        }
    }

    const graphModel = getGraphModelDocument(xml)

    const cells = Array.from(
        graphModel.getElementsByTagName("mxCell")
    )

    const cellsById = new Map(
        cells
            .map((cell) => [
                cell.getAttribute("id"),
                cell,
            ])
            .filter(([id]) => Boolean(id))
    )

    const vertexCells = cells.filter((cell) => {
        const isVertex =
            cell.getAttribute("vertex") === "1"

        const isRootCell =
            cell.getAttribute("id") === "0" ||
            cell.getAttribute("id") === "1"

        return (
            isVertex &&
            !isRootCell &&
            !isTextOnlyCell(cell)
        )
    })

    const nodes = vertexCells.map((cell) => {
        const label = getCellLabel(cell)
        const style = cell.getAttribute("style") ?? ""

        return {
            id: cell.getAttribute("id"),
            label,
            labelKey: normalizeLabel(label),
            nodeType: getNodeType(style),
            style,
            geometry: getGeometry(cell),
        }
    })

    const nodesById = new Map(
        nodes.map((node) => [node.id, node])
    )

    const edges = cells
        .filter(
            (cell) =>
                cell.getAttribute("edge") === "1"
        )
        .map((cell) => {
            const sourceId = resolveNodeId(
                cell.getAttribute("source"),
                cellsById,
                nodesById
            )

            const targetId = resolveNodeId(
                cell.getAttribute("target"),
                cellsById,
                nodesById
            )

            const label = getCellLabel(cell)

            return {
                id: cell.getAttribute("id"),

                sourceId,
                targetId,

                sourceLabel:
                    nodesById.get(sourceId)?.label ?? "",

                sourceLabelKey:
                    nodesById.get(sourceId)?.labelKey ?? "",

                targetLabel:
                    nodesById.get(targetId)?.label ?? "",

                targetLabelKey:
                    nodesById.get(targetId)?.labelKey ?? "",

                label,
                labelKey: normalizeLabel(label),

                style: cell.getAttribute("style") ?? "",
            }
        })
        .filter(
            (edge) =>
                edge.sourceId &&
                edge.targetId
        )

    return {
        nodes,
        edges,
    }
}