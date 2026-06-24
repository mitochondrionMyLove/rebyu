import React, { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
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
import SpeedDial from "@mui/material/SpeedDial"
import SpeedDialAction from "@mui/material/SpeedDialAction"

const actions = [
  {
    type: "heading",
    name: "Heading",
    icon: <HeadingIcon className="h-5 w-5" />,
    createData: () => ({
      text: "",
    }),
  },
  {
    type: "description",
    name: "Description",
    icon: <AlignLeft className="h-5 w-5" />,
    createData: () => ({
      text: "",
    }),
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
    createData: () => ({
      imageKey: "",
    }),
  },
  {
    type: "video",
    name: "Video",
    icon: <FilePlay className="h-5 w-5" />,
    createData: () => ({
      videoKey: "",
    }),
  },
]

function CreateLessons() {
  const navigate = useNavigate()
  const location = useLocation()

  const state = location.state ?? {}
  const lessonName = state.lessonName ?? "Untitled Lesson"

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
        section.id === sectionId
          ? {
              ...section,
              [field]: value,
            }
          : section
      )
    )
  }

  function handleDeleteSection(sectionId) {
    setSections((prev) =>
      prev.filter((section) => section.id !== sectionId)
    )
  }

  function handleAddTool(toolName) {
    const itemTool = actions.find((item) => item.name === toolName)

    if (!itemTool) {
      return alert("Choose a tool")
    }

    setSections((prev) =>
      prev.map((section, index) => {
        if (index !== sectionIndex) {
          return section
        }

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
        if (currentSectionIndex !== targetSectionIndex) {
          return section
        }

        return {
          ...section,
          content: section.content.filter(
            (_, currentToolIndex) => currentToolIndex !== targetToolIndex
          ),
        }
      })
    )
  }

  function handleSaveLesson() {
    console.log("Lesson name:", lessonName)
    console.log("Sections:", sections)

    alert("Lesson data was printed in the browser console.")
  }

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
            <p className="text-xs font-medium text-zinc-500">
              Lesson editor
            </p>

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
            onClick={handleSaveLesson}
            className="flex h-9 items-center gap-2 rounded-lg bg-zinc-950 px-3 text-sm font-medium text-white transition hover:bg-zinc-800 sm:px-4"
          >
            <Save className="h-4 w-4" />
            <span className="hidden sm:inline">Save Lesson</span>
            <span className="sm:hidden">Save</span>
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
                "&:hover": {
                  backgroundColor: "black",
                },
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
                slotProps={{
                  tooltip: {
                    title: action.name,
                  },
                }}
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