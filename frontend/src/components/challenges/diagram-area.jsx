import { useCallback, useEffect, useRef, useState } from "react"
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

export default function DiagramArea({
                                        initialXml,
                                        onChange,
                                    }) {
    const [isLoading, setIsLoading] = useState(true)
    const onChangeRef = useRef(onChange)
    const autosaveTimerRef = useRef(null)





    const startingXmlRef = useRef(
        typeof initialXml === "string" && initialXml.trim()
            ? initialXml
            : EMPTY_GRID_DIAGRAM
    )

    const lastSavedXmlRef = useRef(
        startingXmlRef.current
    )

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

    const handleAutoSave = useCallback((data) => {
        const nextXml =
            typeof data?.xml === "string"
                ? data.xml
                : ""

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
        <div className="relative h-full w-full overflow-hidden bg-white">
            {isLoading && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-white">
                    <LoaderCircle className="h-7 w-7 animate-spin text-muted-foreground" />

                    <div className="text-center">
                        <p className="text-sm font-medium text-foreground">
                            Loading diagram editor
                        </p>

                        <p className="mt-1 text-xs text-muted-foreground">
                            Preparing Draw.io workspace...
                        </p>
                    </div>
                </div>
            )}

            <DrawIoEmbed
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
                    libs: "flowchart;er;uml",
                    format: 0,
                    noSaveBtn: 1,
                    noExitBtn: 1,
                    saveAndExit: 0,
                    splash: 0,
                }}
                configuration={{




                    compressXml: false,
                    compact: true,

                    hideMenus: [
                        "file",
                        "edit",
                        "view",
                        "arrange",
                        "extras",
                        "help",
                    ],

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
                    version: "rebyu-diagram-editor-v2",
                }}
            />
        </div>
    )
}
