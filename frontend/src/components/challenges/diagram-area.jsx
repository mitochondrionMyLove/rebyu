import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { LoaderCircle } from "lucide-react"
import { DrawIoEmbed } from "react-drawio"

const EMPTY_GRID_DIAGRAM = `
<mxGraphModel
  dx="1200"
  dy="800"
  grid="1"
  gridSize="10"
  guides="1"
  tooltips="1"
  connect="1"
  arrows="1"
  fold="1"
  page="0"
  pageScale="1"
  background="#ffffff"
  math="0"
  shadow="0"
>
  <root>
    <mxCell id="0" />
    <mxCell id="1" parent="0" />
  </root>
</mxGraphModel>
`

const DIAGRAM_TOOL_PRESETS = {
    ACTIVITY_DIAGRAM: {
        label: "Activity Diagram",
        libs: "uml;flowchart;general",
    },
    UML_CLASS: {
        label: "Class Diagram",
        libs: "uml;general",
    },
    UML_COMPONENT: {
        label: "Component Diagram",
        libs: "uml;general",
    },
    ERD: {
        label: "ER Diagram",
        libs: "er;general",
    },
    FLOWCHART: {
        label: "Flowchart",
        libs: "flowchart;general",
    },
    SEQUENCE_DIAGRAM: {
        label: "Sequence Diagram",
        libs: "uml;general",
    },
    UI_DESIGN: {
        label: "UI Design",
        libs: "mockups;ios;android;bootstrap;general",
    },
    USE_CASE: {
        label: "Use Case Diagram",
        libs: "uml;general",
    },
}

function getDiagramToolPreset(diagramType) {
    return DIAGRAM_TOOL_PRESETS[diagramType] ?? DIAGRAM_TOOL_PRESETS.ERD
}

export default function DiagramArea({
                                        diagramType = "ERD",
                                        initialXml,
                                        onChange,
                                        className = "",
                                    }) {
    const [isLoading, setIsLoading] = useState(true)
    const onChangeRef = useRef(onChange)
    const autosaveTimerRef = useRef(null)

    const toolPreset = useMemo(
        () => getDiagramToolPreset(diagramType),
        [diagramType]
    )

    const startingXmlRef = useRef(
        typeof initialXml === "string" && initialXml.trim()
            ? initialXml
            : EMPTY_GRID_DIAGRAM
    )

    const lastSavedXmlRef = useRef(startingXmlRef.current)

    useEffect(() => {
        onChangeRef.current = onChange
    }, [onChange])

    useEffect(() => {
        return () => {
            if (autosaveTimerRef.current) {
                clearTimeout(autosaveTimerRef.current)
            }
        }
    }, [])

    useEffect(() => {
        setIsLoading(true)
    }, [diagramType])

    const handleAutoSave = useCallback((data) => {
        const nextXml = typeof data?.xml === "string" ? data.xml : ""

        if (!nextXml || nextXml === lastSavedXmlRef.current) {
            return
        }

        lastSavedXmlRef.current = nextXml

        if (autosaveTimerRef.current) {
            clearTimeout(autosaveTimerRef.current)
        }

        autosaveTimerRef.current = setTimeout(() => {
            onChangeRef.current?.(lastSavedXmlRef.current)
        }, 750)
    }, [])

    return (
        <div
            className={`h-full min-h-[620px] w-full overflow-hidden rounded-2xl border border-sky-200 bg-[#eef9fd] p-2 shadow-sm ${className}`}
        >
            <div className="relative h-full w-full overflow-hidden rounded-xl border border-sky-100 bg-white">
                {isLoading && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-white">
                        <LoaderCircle className="h-7 w-7 animate-spin text-sky-500" />

                        <div className="text-center">
                            <p className="text-sm font-semibold text-slate-800">
                                Loading {toolPreset.label} editor
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                                Preparing diagram workspace...
                            </p>
                        </div>
                    </div>
                )}

                <DrawIoEmbed
                    key={diagramType}
                    xml={startingXmlRef.current}
                    autosave
                    onLoad={() => setIsLoading(false)}
                    onAutoSave={handleAutoSave}
                    style={{
                        width: "100%",
                        height: "100%",
                        display: "block",
                        border: "none",
                    }}
                    urlParameters={{
                        ui: "simple",
                        sidebar: 1,
                        libraries: 1,
                        libs: toolPreset.libs,
                        format: 0,
                        noSaveBtn: 1,
                        noExitBtn: 1,
                        saveAndExit: 0,
                        splash: 0,
                    }}
                    configuration={{
                        compressXml: false,
                        compact: true,
                        hideMenus: ["file", "edit", "view", "arrange", "extras", "help"],
                        hideMenuItems: [
                            "importFrom",
                            "exportAs",
                            "embed",
                            "newLibrary",
                            "openLibrary",
                            "pageSetup",
                            "print",
                            "settings",
                            "help",
                            "exit",
                        ],
                        css: `
              .geTabContainer {
                display: none !important;
              }
            `,
                        defaultGridEnabled: true,
                        defaultGridSize: 10,
                        defaultPageVisible: false,
                        override: true,
                        version: `rebyu-diagram-editor-${diagramType}`,
                    }}
                />
            </div>
        </div>
    )
}
