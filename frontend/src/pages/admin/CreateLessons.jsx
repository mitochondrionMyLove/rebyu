import React, { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import {
  AlignLeft,
  FilePlay,
  Heading as HeadingIcon,
  Image as ImageIcon,
  ListCollapse,
  List,
  ListOrdered,
  ArrowLeft,
  Save,
  Plus,
  X,
  BetweenHorizontalEnd,
  AlertCircleIcon,
  Type,
  PanelLeft,
  PanelRight,
  PanelsTopLeft,
  FlipHorizontal,
} from "lucide-react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

import Section from "../../components/Section"
import { setLessonComponent } from "../../services/lessonService.js"
import { saveFile as MediaFileUpload } from "../../services/fileService.js"

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
    type: "subheading",
    name: "Smaller Heading",
    icon: <Type className="h-5 w-5" />,
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
    type: "unordered-list",
    name: "Bullet List",
    icon: <List className="h-5 w-5" />,
    createData: () => ({
      items: [
        {
          id: crypto.randomUUID(),
          text: "",
        },
      ],
    }),
  },

  {
    type: "ordered-list",
    name: "Numbered List",
    icon: <ListOrdered className="h-5 w-5" />,
    createData: () => ({
      items: [
        {
          id: crypto.randomUUID(),
          text: "",
        },
      ],
    }),
  },

  {
    type: "image-left-text",
    name: "Image Left + Text",
    icon: <PanelLeft className="h-5 w-5" />,
    createData: () => ({
      file: null,
      imageKey: "",
      title: "",
      description: "",
    }),
  },

  {
    type: "image-right-text",
    name: "Text Left + Image",
    icon: <PanelRight className="h-5 w-5" />,
    createData: () => ({
      file: null,
      imageKey: "",
      title: "",
      description: "",
    }),
  },

  {
    type: "tabs",
    name: "Tabs",
    icon: <PanelsTopLeft className="h-5 w-5" />,
    createData: () => ({
      items: [
        {
          id: crypto.randomUUID(),
          label: "Overview",
          title: "Overview",
          description: "",
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
          title: "",
          content: "",
        },
      ],
    }),
  },

  {
    type: "flip-grid",
    name: "Flip Cards",
    icon: <FlipHorizontal className="h-5 w-5" />,
    createData: () => ({
      cards: [
        {
          id: crypto.randomUUID(),
          frontTitle: "",
          backTitle: "",
          description: "",
        },
      ],
    }),
  },

  {
    type: "image",
    name: "Image",
    icon: <ImageIcon className="h-5 w-5" />,
    createData: () => ({
      file: null,
      imageKey: "",
    }),
  },

  {
    type: "video",
    name: "Video",
    icon: <FilePlay className="h-5 w-5" />,
    createData: () => ({
      file: null,
      videoKey: "",
    }),
  },
]

function CreateLessons() {
  const navigate = useNavigate()
  const location = useLocation()

  const state = location.state ?? {}
  const lessonName = state.lessonName ?? "Untitled Lesson"
  const lessonId = state.lessonId ?? 0

  const [sections, setSections] = useState([])
  const [sectionIndex, setSectionIndex] = useState(0)

  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isToolMenuOpen, setIsToolMenuOpen] = useState(false)

  const [isErrorAddingToolWithoutSection, setIsErrorAddingToolWithoutSection] =
    useState(false)

  const [validationError, setValidationError] = useState("")

  function handleCancel() {
    navigate(-1)
  }

  function handleAddSection() {
    const newSection = {
      id: crypto.randomUUID(),
      sectionName: "",
      content: [],
    }

    setSections((previousSections) => {
      setSectionIndex(previousSections.length)

      return [...previousSections, newSection]
    })
  }

  function handleSectionChange(sectionId, field, value) {
    setSections((previousSections) =>
      previousSections.map((section) =>
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
    setSections((previousSections) =>
      previousSections.filter((section) => section.id !== sectionId)
    )

    setSectionIndex(0)
  }

  function handleAddTool(toolType) {
    const selectedTool = actions.find((action) => action.type === toolType)

    if (!selectedTool) {
      return
    }

    if (!sections[sectionIndex]) {
      setIsErrorAddingToolWithoutSection(true)
      return
    }

    const newTool = {
      id: crypto.randomUUID(),
      type: selectedTool.type,
      data: selectedTool.createData(),
    }

    setSections((previousSections) =>
      previousSections.map((section, currentSectionIndex) => {
        if (currentSectionIndex !== sectionIndex) {
          return section
        }

        return {
          ...section,
          content: [...section.content, newTool],
        }
      })
    )
  }

  // The tool menu intentionally stays open after adding a tool.
  function handleSelectTool(toolType) {
    handleAddTool(toolType)
  }

  function handleRemoveTool(targetSectionIndex, targetToolIndex) {
    setSections((previousSections) =>
      previousSections.map((section, currentSectionIndex) => {
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

  function handleToolDataChange(
    targetSectionIndex,
    targetToolIndex,
    newData
  ) {
    setSections((previousSections) =>
      previousSections.map((section, currentSectionIndex) => {
        if (currentSectionIndex !== targetSectionIndex) {
          return section
        }

        return {
          ...section,
          content: section.content.map((tool, currentToolIndex) => {
            if (currentToolIndex !== targetToolIndex) {
              return tool
            }

            return {
              ...tool,
              data: newData,
            }
          }),
        }
      })
    )
  }

  function isBlank(value) {
    return typeof value !== "string" || value.trim().length === 0
  }

  function validateTool(tool, sectionNumber, toolNumber) {
    const data = tool.data ?? {}
    const toolLabel = `Section ${sectionNumber}, tool ${toolNumber}`

    if (tool.type === "heading" || tool.type === "subheading") {
      if (isBlank(data.text)) {
        return `${toolLabel}: heading text is required.`
      }
    }

    if (tool.type === "description") {
      if (isBlank(data.text)) {
        return `${toolLabel}: description text is required.`
      }
    }

    if (
      tool.type === "unordered-list" ||
      tool.type === "ordered-list"
    ) {
      if (!data.items || data.items.length === 0) {
        return `${toolLabel}: add at least one list item.`
      }

      const hasEmptyItem = data.items.some((item) => isBlank(item.text))

      if (hasEmptyItem) {
        return `${toolLabel}: all list items must have text.`
      }
    }

    if (tool.type === "tabs") {
      if (!data.items || data.items.length === 0) {
        return `${toolLabel}: add at least one tab.`
      }

      const hasInvalidTab = data.items.some(
        (item) =>
          isBlank(item.label) ||
          isBlank(item.title) ||
          isBlank(item.description)
      )

      if (hasInvalidTab) {
        return `${toolLabel}: every tab needs a label, title, and description.`
      }
    }

    if (tool.type === "accordion") {
      if (!data.items || data.items.length === 0) {
        return `${toolLabel}: add at least one accordion item.`
      }

      const hasInvalidItem = data.items.some(
        (item) => isBlank(item.title) || isBlank(item.content)
      )

      if (hasInvalidItem) {
        return `${toolLabel}: every accordion item needs a title and content.`
      }
    }

    if (tool.type === "flip-grid") {
      if (!data.cards || data.cards.length === 0) {
        return `${toolLabel}: add at least one flip card.`
      }

      const hasInvalidCard = data.cards.some(
        (card) =>
          isBlank(card.frontTitle) ||
          isBlank(card.backTitle) ||
          isBlank(card.description)
      )

      if (hasInvalidCard) {
        return `${toolLabel}: every flip card needs front text, back text, and a description.`
      }
    }

    if (tool.type === "image") {
      if (!data.file && isBlank(data.imageKey)) {
        return `${toolLabel}: upload an image first.`
      }
    }

    if (tool.type === "video") {
      if (!data.file && isBlank(data.videoKey)) {
        return `${toolLabel}: upload a video first.`
      }
    }

    if (
      tool.type === "image-left-text" ||
      tool.type === "image-right-text"
    ) {
      if (!data.file && isBlank(data.imageKey)) {
        return `${toolLabel}: upload an image first.`
      }

      if (isBlank(data.title)) {
        return `${toolLabel}: image text title is required.`
      }

      if (isBlank(data.description)) {
        return `${toolLabel}: image text description is required.`
      }
    }

    return null
  }

  function validateLesson() {
    if (isBlank(lessonName) || lessonName === "Untitled Lesson") {
      return "Lesson name is required."
    }

    if (sections.length === 0) {
      return "Add at least one section before saving."
    }

    for (
      let currentSectionIndex = 0;
      currentSectionIndex < sections.length;
      currentSectionIndex++
    ) {
      const section = sections[currentSectionIndex]
      const sectionNumber = currentSectionIndex + 1

      if (isBlank(section.sectionName)) {
        return `Section ${sectionNumber} needs a section name.`
      }

      if (!section.content || section.content.length === 0) {
        return `Section ${sectionNumber} needs at least one tool.`
      }

      for (
        let currentToolIndex = 0;
        currentToolIndex < section.content.length;
        currentToolIndex++
      ) {
        const tool = section.content[currentToolIndex]

        const toolError = validateTool(
          tool,
          sectionNumber,
          currentToolIndex + 1
        )

        if (toolError) {
          return toolError
        }
      }
    }

    return null
  }

  async function saveMediaFile(tool, sectionName) {
    const file = tool.data?.file

    if (!file) {
      return
    }

    const imageTools = [
      "image-left-text",
      "image-right-text",
      "image",
    ]

    if (imageTools.includes(tool.type)) {
      await MediaFileUpload(
        lessonId,
        sectionName,
        tool.id,
        "photo",
        file
      )
    }

    if (tool.type === "video") {
      await MediaFileUpload(
        lessonId,
        sectionName,
        tool.id,
        "video",
        file
      )
    }
  }

  async function uploadLessonMedia() {
    const mediaUploads = sections.flatMap((section) =>
      section.content.map((tool) => saveMediaFile(tool, section.sectionName))
    )

    await Promise.all(mediaUploads)
  }

  async function handleSaveLesson() {
    const error = validateLesson()

    if (error) {
      setValidationError(error)
      return
    }

    try {
      setIsSaving(true)

      await uploadLessonMedia()
      await setLessonComponent(lessonId, sections)

      setIsSuccessDialogOpen(true)
    } catch (error) {
      console.error("Could not save lesson:", error)

      setValidationError(
        "Could not save the lesson. Please try again."
      )
    } finally {
      setIsSaving(false)
    }
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
            disabled={isSaving}
            className="flex h-9 items-center gap-2 rounded-lg bg-zinc-950 px-3 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 sm:px-4"
          >
            <Save className="h-4 w-4" />

            <span className="hidden sm:inline">
              {isSaving ? "Saving..." : "Save Lesson"}
            </span>

            <span className="sm:hidden">
              {isSaving ? "Saving..." : "Save"}
            </span>
          </button>
        </div>

        <AlertDialog
          open={isSuccessDialogOpen}
          onOpenChange={setIsSuccessDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Created Successfully!</AlertDialogTitle>

              <AlertDialogDescription>
                You have successfully created the lesson for {lessonName}.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogAction onClick={() => navigate(-1)}>
                Ok
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog
          open={Boolean(validationError)}
          onOpenChange={(open) => {
            if (!open) {
              setValidationError("")
            }
          }}
        >
          <AlertDialogContent size="sm">
            <AlertDialogHeader>
              <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20">
                <AlertCircleIcon />
              </AlertDialogMedia>

              <AlertDialogTitle>Cannot Save Lesson</AlertDialogTitle>

              <AlertDialogDescription>
                {validationError}
              </AlertDialogDescription>
            </AlertDialogHeader>

            <div className="mt-6 w-full">
              <AlertDialogAction
                variant="destructive"
                onClick={() => setValidationError("")}
                className="!h-11 !w-full rounded-xl text-sm font-semibold"
              >
                Ok
              </AlertDialogAction>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      </header>

      <div className="flex min-h-0 min-w-0 flex-1 overflow-hidden">
        <div className="fixed right-4 bottom-4 z-50 sm:right-8 sm:bottom-8">
          <Collapsible
            open={isToolMenuOpen}
            onOpenChange={setIsToolMenuOpen}
          >
            <div className="relative">
              <CollapsibleContent className="absolute right-0 bottom-14 mb-3 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-zinc-200 bg-white p-3 shadow-xl">
                <div className="mb-3 px-2 pt-1">
                  <p className="text-sm font-semibold text-zinc-900">
                    Add lesson content
                  </p>

                  <p className="mt-1 text-xs leading-5 text-zinc-500">
                    Choose a content block to add to the selected section.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {actions.map((action) => (
                    <button
                      key={action.type}
                      type="button"
                      onClick={() => handleSelectTool(action.type)}
                      className="flex min-h-20 flex-col items-start justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-3 text-left text-zinc-700 transition hover:border-zinc-400 hover:bg-zinc-50 hover:text-zinc-950"
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100 text-zinc-800">
                        {action.icon}
                      </span>

                      <span className="text-xs font-medium leading-4">
                        {action.name}
                      </span>
                    </button>
                  ))}
                </div>
              </CollapsibleContent>

              <CollapsibleTrigger asChild>
                <button
                  type="button"
                  aria-label={
                    isToolMenuOpen
                      ? "Close content menu"
                      : "Open content menu"
                  }
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-950 text-white shadow-lg transition hover:bg-zinc-800 focus:outline-none focus:ring-4 focus:ring-zinc-300"
                >
                  {isToolMenuOpen ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Plus className="h-5 w-5" />
                  )}
                </button>
              </CollapsibleTrigger>
            </div>
          </Collapsible>

          <AlertDialog
            open={isErrorAddingToolWithoutSection}
            onOpenChange={setIsErrorAddingToolWithoutSection}
          >
            <AlertDialogContent
              size="sm"
              className="w-[calc(100%-2rem)] max-w-sm rounded-2xl border border-destructive/15 p-0 shadow-2xl"
            >
              <div className="px-6 pt-6 pb-5">
                <AlertDialogHeader className="items-center text-center sm:text-center">
                  <AlertDialogMedia className="mb-1 flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive dark:bg-destructive/20">
                    <AlertCircleIcon className="h-7 w-7" />
                  </AlertDialogMedia>

                  <AlertDialogTitle className="mt-3 text-lg font-semibold tracking-tight">
                    Cannot Add Tool
                  </AlertDialogTitle>

                  <AlertDialogDescription className="mt-2 max-w-[280px] text-sm leading-6 text-muted-foreground">
                    Create a section first before adding lesson content.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="mt-6 w-full">
                  <AlertDialogAction
                    variant="destructive"
                    onClick={() =>
                      setIsErrorAddingToolWithoutSection(false)
                    }
                    className="!h-11 !w-full rounded-xl text-sm font-semibold"
                  >
                    Got it
                  </AlertDialogAction>
                </div>
              </div>
            </AlertDialogContent>
          </AlertDialog>
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
                    handleToolDataChange={handleToolDataChange}
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