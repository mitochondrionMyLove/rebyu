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

export default function DiagramArea() {
    return (
        <div className="h-full w-full overflow-hidden bg-white">
            <DrawIoEmbed
                xml={EMPTY_GRID_DIAGRAM}
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

                    // Hide Draw.io save/exit controls
                    noSaveBtn: 1,
                    noExitBtn: 1,
                    saveAndExit: 0,

                    splash: 0,
                }}
                configuration={{
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
                    version: "codestrike-simple-editor-v3",
                }}
            />
        </div>
    )
}