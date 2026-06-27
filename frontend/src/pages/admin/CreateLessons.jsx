import React, { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useMutation } from "@tanstack/react-query"
import {
  AlignLeft,
  FilePlay,
  Heading as HeadingIcon,
  Image as ImageIcon,
  Layers3,
  LayoutDashboard,
  ListCollapse,
  ArrowLeft,
  Save,
  Plus,
  BetweenHorizontalEnd,
} from "lucide-react"

import Section from "../../components/Section"
import { base } from "../../services/base"
import SpeedDial from "@mui/material/SpeedDial"
import SpeedDialAction from "@mui/material/SpeedDialAction"

const actions = [
  {
    type: "heading",
    name: "Heading",
    icon: <HeadingIcon className="h-5 w-5" />,
    createData: () => ({ text: "" }),
  },
  {
    type: "description",
    name: "Description",
    icon: <AlignLeft className="h-5 w-5" />,
    createData: () => ({ text: "" }),
  },
  {
    type: "tabs",
    name: "Tabs",
    icon: <LayoutDashboard className="h-5 w-5" />,
    createData: () => ({
      items: [
        {
          id: crypto.randomUUID(),
          label: "Overview",
          title: "Overview",
          description: "Write the overview content here.",
        },
      ],
    }),
  },
  {
    type: "accordion",
    name: "Accordion",
    icon: <ListCollapse className="h-5 w-5" />,
    createData: () => ({
      items: [
        {
          id: crypto.randomUUID(),
          title: "What is this lesson about?",
          content: "Write the answer or lesson explanation here.",
        },
      ],
    }),
  },
  {
    type: "flip-grid",
    name: "Flip Cards",
    icon: <Layers3 className="h-5 w-5" />,
    createData: () => ({
      cards: [
        {
          id: crypto.randomUUID(),
          frontTitle: "Definition",
          backTitle: "Answer",
          description: "Write the explanation here.",
        },
      ],
    }),
  },
  {
    type: "image",
    name: "Image",
    icon: <ImageIcon className="h-5 w-5" />,
    createData: () => ({ imageKey: "" }),
  },
  {
    type: "video",
    name: "Video",
    icon: <FilePlay className="h-5 w-5" />,
    createData: () => ({ videoKey: "" }),
  },
]

function CreateLessons() {
  const navigate = useNavigate()
  const location = useLocation()

  const state = location.state ?? {}
  const lessonName = state.lessonName ?? "Untitled Lesson"
  const lessonId = state.lessonId

  const [sections, setSections] = useState([])
  const [sectionIndex, setSectionIndex] = useState(0)

  function handleCancel() {
    navigate(-1)
  }

  function handleAddSection() {
    setSections((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        sectionName: "",
        title: "",
        content: [],
      },
    ])
  }

  function handleSectionChange(sectionId, field, value) {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId ? { ...section, [field]: value } : section
      )
    )
  }

  function handleDeleteSection(sectionId) {
    setSections((prev) => prev.filter((section) => section.id !== sectionId))
  }

  function handleAddTool(toolName) {
    const itemTool = actions.find((item) => item.name === toolName)

    if (!itemTool) {
      return alert("Choose a tool")
    }

    setSections((prev) =>
      prev.map((section, index) => {
        if (index !== sectionIndex) return section
        return {
          ...section,
          content: [
            ...section.content,
            {
              id: crypto.randomUUID(),
              type: itemTool.type,
              data: itemTool.createData(),
            },
          ],
        }
      })
    )
  }

  function handleRemoveTool(targetSectionIndex, targetToolIndex) {
    setSections((prev) =>
      prev.map((section, currentSectionIndex) => {
        if (currentSectionIndex !== targetSectionIndex) return section
        return {
          ...section,
          content: section.content.filter(
            (_, currentToolIndex) => currentToolIndex !== targetToolIndex
          ),
        }
      })
    )
  }

  function handleToolDataChange(sectionId, toolId, data) {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              content: section.content.map((tool) =>
                tool.id === toolId
                  ? { ...tool, data: { ...tool.data, ...data } }
                  : tool
              ),
            }
          : section
      )
    )
  }

  const { mutate: saveLesson, isPending } = useMutation({
    mutationFn: async () => {
      const updatedSections = await Promise.all(
        sections.map(async (section) => {
          const updatedContent = await Promise.all(
            section.content.map(async (tool) => {
              if (tool.type === "image" && tool.data.file) {
                const formData = new FormData()
                formData.append("lessonId", lessonId)
                formData.append("sectionName", section.sectionName || "Untitled")
                formData.append("toolId", tool.id)
                formData.append("folderName", "photo")
                formData.append("file", tool.data.file)
                const key = await base("files/upload", { method: "POST", data: formData })
                if (!key) throw new Error("File upload failed because the server did not return a file name.")
                const { file: _f, ...rest } = tool.data
                return { ...tool, data: { ...rest, imageKey: key } }
              }
              if (tool.type === "video" && tool.data.file) {
                const formData = new FormData()
                formData.append("lessonId", lessonId)
                formData.append("sectionName", section.sectionName || "Untitled")
                formData.append("toolId", tool.id)
                formData.append("folderName", "video")
                formData.append("file", tool.data.file)
                const key = await base("files/upload", { method: "POST", data: formData })
                if (!key) throw new Error("File upload failed because the server did not return a file name.")
                const { file: _f, ...rest } = tool.data
                return { ...tool, data: { ...rest, videoKey: key } }
              }
              return tool
            })
          )
          return { ...section, content: updatedContent }
        })
      )

      const lessonComponent = updatedSections.map((section) => ({
        sectionId: section.id,
        sectionName: section.sectionName,
        content: section.content.map(({ id, type, data }) => {
          const { file: _f, ...cleanData } = data
          return { id, type, data: cleanData }
        }),
      }))

      await base(`lessons/lesson/${lessonId}`, {
        method: "PUT",
        data: { lessonComponentStructure: JSON.stringify(lessonComponent) },
      })
    },
    onSuccess: () => navigate(-1),
    onError: (error) => {
      console.error("Could not save lesson:", error)
      alert(error.message || "Failed to save lesson.")
    },
  })

  return (
    <section className="flex h-full min-h-0 w-full min-w-0 flex-col overflow-hidden bg-zinc-100">
      <header className="flex h-16 min-w-0 shrink-0 items-center justify-between border-b border-zinc-200 bg-white px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={handleCancel}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-950"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          <div className="min-w-0">
            <p className="text-xs font-medium text-zinc-500">Lesson editor</p>
            <h1 className="truncate text-base font-semibold text-zinc-950">
              {lessonName}
            </h1>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={handleCancel}
            className="hidden h-9 rounded-lg px-4 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-950 sm:block"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => saveLesson()}
            disabled={isPending}
            className="flex h-9 items-center gap-2 rounded-lg bg-zinc-950 px-3 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:opacity-60 sm:px-4"
          >
            <Save className="h-4 w-4" />
            <span className="hidden sm:inline">
              {isPending ? "Saving…" : "Save Lesson"}
            </span>
            <span className="sm:hidden">{isPending ? "…" : "Save"}</span>
          </button>
        </div>
      </header>

      <div className="flex min-h-0 min-w-0 flex-1 overflow-hidden">
        <div className="fixed right-10 bottom-10 z-50">
          <SpeedDial
            ariaLabel="Add content block"
            icon={<Plus />}
            direction="up"
            sx={{
              "& .MuiFab-primary": {
                backgroundColor: "black",
                color: "white",
                "&:hover": { backgroundColor: "black" },
              },
              "& .MuiSpeedDialAction-fab": {
                backgroundColor: "white",
                color: "black",
              },
            }}
          >
            {actions.map((action) => (
              <SpeedDialAction
                key={action.name}
                icon={action.icon}
                slotProps={{ tooltip: { title: action.name } }}
                onClick={() => handleAddTool(action.name)}
              />
            ))}
          </SpeedDial>
        </div>

        <main className="h-full min-w-0 flex-1 overflow-x-hidden overflow-y-auto px-4 py-8 sm:px-8 lg:pr-24">
          <div className="mx-auto flex w-full max-w-6xl min-w-0 flex-col gap-10 pb-16">
            {sections.length === 0 ? (
              <div className="mx-auto flex min-h-[600px] w-full max-w-5xl flex-col items-center justify-center px-6 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-700">
                  <BetweenHorizontalEnd className="h-6 w-6" />
                </div>

                <h2 className="mt-5 text-xl font-semibold text-zinc-900">
                  Start building your lesson
                </h2>

                <p className="mt-2 max-w-sm text-sm leading-6 text-zinc-500">
                  Add your first section to start writing the lesson content.
                </p>

                <button
                  type="button"
                  onClick={handleAddSection}
                  className="mt-6 flex h-10 items-center gap-2 rounded-lg bg-zinc-950 px-4 text-sm font-medium text-white transition hover:bg-zinc-800"
                >
                  <Plus className="h-4 w-4" />
                  Add first section
                </button>
              </div>
            ) : (
              <>
                {sections.map((section, index) => (
                  <Section
                    key={section.id}
                    section={section}
                    sectionIndex={index}
                    onChange={handleSectionChange}
                    onDelete={handleDeleteSection}
                    handleRemovalTool={handleRemoveTool}
                    onToolDataChange={handleToolDataChange}
                    onClick={() => setSectionIndex(index)}
                  />
                ))}

                <button
                  type="button"
                  onClick={handleAddSection}
                  className="mx-auto flex w-full max-w-5xl items-center justify-center gap-2 rounded-xl border border-dashed border-zinc-300 bg-white/70 py-4 text-sm font-medium text-zinc-600 transition hover:border-zinc-500 hover:bg-white hover:text-zinc-950"
                >
                  <Plus className="h-4 w-4" />
                  Add another section
                </button>
              </>
            )}
          </div>
        </main>
      </div>
    </section>
  )
}

export default CreateLessons
