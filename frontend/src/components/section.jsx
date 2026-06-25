import React from "react"
import { Trash2 } from "lucide-react"
import {
  AccordionTool,
  DescriptionTool,
  FlipGridTool,
  HeadingTool,
  ImageTool,
  TabsTool,
  VideoTool,
  SubheadingTool,
  UnorderedListTool,
  OrderedListTool,
  ImageLeftTextTool,
  ImageRightTextTool,
} from "./tools"

const TOOL_COMPONENTS = {
  heading: HeadingTool,
  subheading: SubheadingTool,
  description: DescriptionTool,
  "unordered-list": UnorderedListTool,
  "ordered-list": OrderedListTool,
  tabs: TabsTool,
  accordion: AccordionTool,
  "flip-grid": FlipGridTool,
  image: ImageTool,
  video: VideoTool,
  "image-left-text": ImageLeftTextTool,
  "image-right-text": ImageRightTextTool,
}

function Section({
                   section,
                   onChange,
                   onDelete,
                   handleToolDataChange,
                   onClick,
                   sectionIndex,
                   handleRemovalTool,
                 }) {
  const tools = section.content ?? []

  return (
      <div
          className="group relative mx-auto w-full max-w-5xl min-w-0"
          onClick={onClick}
      >
        <div className="mb-3 flex min-w-0 items-center justify-between gap-3 px-1">
          <input
              id={`section-name-${section.id}`}
              type="text"
              value={section.sectionName ?? ""}
              onChange={(event) =>
                  onChange(section.id, "sectionName", event.target.value)
              }
              placeholder="Untitled Section"
              className="w-full max-w-sm min-w-0 bg-transparent text-xs font-semibold tracking-[0.16em] text-zinc-500 uppercase outline-none placeholder:text-zinc-400 focus:text-zinc-950"
          />

          <button
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                onDelete(section.id)
              }}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-zinc-400 opacity-100 transition hover:bg-red-50 hover:text-red-600 sm:opacity-0 sm:group-hover:opacity-100"
              title="Delete section"
              aria-label="Delete section"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        <article className="min-h-[720px] w-full overflow-hidden rounded-sm border border-zinc-200 bg-white shadow-[0_12px_35px_rgba(0,0,0,0.08)] transition duration-200 hover:shadow-[0_16px_45px_rgba(0,0,0,0.12)]">
          <div className="flex min-h-[720px] w-full flex-col gap-3 p-10">
            {tools.map((item, toolIndex) => {
              const ToolComponent = TOOL_COMPONENTS[item.type]
              if (!ToolComponent) {
                return (
                    <p
                        key={item.id ?? toolIndex}
                        className="rounded-lg bg-red-50 p-3 text-sm text-red-600"
                    >
                      Unknown tool type: {item.type}
                      {item}
                    </p>
                )
              }

              return (
                  <ToolComponent
                      key={item.id ?? toolIndex}
                      data={item.data}
                      onDelete={() => handleRemovalTool(sectionIndex, toolIndex)}
                      onDataChange={(newData) =>
                          handleToolDataChange(sectionIndex, toolIndex, newData)
                      }
                  />
              )
            })}
          </div>
        </article>
      </div>
  )
}

export default Section