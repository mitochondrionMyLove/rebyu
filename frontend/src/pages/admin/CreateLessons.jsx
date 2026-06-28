import React, { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import {
  AlignLeft,
  ArrowLeft,
  BetweenHorizontalEnd,
  CircleAlert,
  FilePlay,
  FlipHorizontal,
  Heading as HeadingIcon,
  Image as ImageIcon,
  List,
  ListCollapse,
  ListOrdered,
  PanelLeft,
  PanelRight,
  PanelsTopLeft,
  Plus,
  Save,
  Type,
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
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import Section from "../../components/certifications/section"
import {
  getLessonComponent,
  setLessonComponent,
} from "../../services/lessonService.js"
import { saveFile as MediaFileUpload } from "../../services/fileService.js"

const actions = [
  {
    type: "heading",
    name: "Heading",
    description: "Add a main lesson heading",
    icon: HeadingIcon,
    createData: () => ({
      text: "",
    }),
  },
  {
    type: "subheading",
    name: "Smaller Heading",
    description: "Add a supporting heading",
    icon: Type,
    createData: () => ({
      text: "",
    }),
  },
  {
    type: "description",
    name: "Description",
    description: "Add lesson text or explanation",
    icon: AlignLeft,
    createData: () => ({
      text: "",
    }),
  },
  {
    type: "unordered-list",
    name: "Bullet List",
    description: "Add unordered list items",
    icon: List,
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
    description: "Add ordered list items",
    icon: ListOrdered,
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
    description: "Place image beside written content",
    icon: PanelLeft,
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
    description: "Place written content beside image",
    icon: PanelRight,
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
    description: "Organize content into tabs",
    icon: PanelsTopLeft,
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
    description: "Create expandable content items",
    icon: ListCollapse,
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
    description: "Create interactive review cards",
    icon: FlipHorizontal,
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
    description: "Upload an image",
    icon: ImageIcon,
    createData: () => ({
      file: null,
      imageKey: "",
    }),
  },
  {
    type: "video",
    name: "Video",
    description: "Upload a lesson video",
    icon: FilePlay,
    createData: () => ({
      file: null,
      videoKey: "",
    }),
  },
]

const MEDIA_TOOL_CONFIG = {
  image: {
    folderName: "photo",
    keyField: "imageKey",
  },
  "image-left-text": {
    folderName: "photo",
    keyField: "imageKey",
  },
  "image-right-text": {
    folderName: "photo",
    keyField: "imageKey",
  },
  video: {
    folderName: "video",
    keyField: "videoKey",
  },
}

function LessonToolButton({ action, onClick, disabled }) {
  const Icon = action.icon

  return (
      <Tooltip>
        <TooltipTrigger asChild>
          <button
              type="button"
              disabled={disabled}
              onClick={onClick}
              aria-label={action.name}
              className="grid h-9 w-9 place-items-center bg-transparent text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-40"
          >
            <Icon className="h-[18px] w-[18px]" />
          </button>
        </TooltipTrigger>

        <TooltipContent side="left" align="center" sideOffset={10}>
          {action.name}
        </TooltipContent>
      </Tooltip>
  )
}

function SectionToolsRail({ isLoadingLesson, onAddTool }) {
  return (
      <div className="flex w-9 flex-col items-center">
        {actions.map((action) => (
            <LessonToolButton
                key={action.type}
                action={action}
                disabled={isLoadingLesson}
                onClick={() => onAddTool(action.type)}
            />
        ))}
      </div>
  )
}

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
  const [isLoadingLesson, setIsLoadingLesson] = useState(true)

  const [isErrorAddingToolWithoutSection, setIsErrorAddingToolWithoutSection] =
      useState(false)

  const [validationError, setValidationError] = useState("")

  function normalizeSections(savedSections, imageKeys = {}, videoKeys = {}) {
    if (!Array.isArray(savedSections)) {
      return []
    }

    return savedSections.map((section) => ({
      id: section.id || crypto.randomUUID(),
      sectionName: section.sectionName ?? "",

      content: Array.isArray(section.content)
          ? section.content.map((tool) => {
            const toolId = tool.id || crypto.randomUUID()

            const normalizedData = {
              ...(tool.data ?? {}),
            }

            const mediaConfig = MEDIA_TOOL_CONFIG[tool.type]

            if (mediaConfig?.keyField === "imageKey") {
              normalizedData.file = null

              normalizedData.imageKey =
                  imageKeys[toolId] ?? normalizedData.imageKey ?? ""
            }

            if (mediaConfig?.keyField === "videoKey") {
              normalizedData.file = null

              normalizedData.videoKey =
                  videoKeys[toolId] ?? normalizedData.videoKey ?? ""
            }

            return {
              id: toolId,
              type: tool.type ?? "",
              data: normalizedData,
            }
          })
          : [],
    }))
  }

  function parseLessonComponent(response) {
    const responseData = response?.data ?? response ?? {}

    const structure = responseData.lessonComponentStructure ?? "[]"
    const imageKeys = responseData.imageKeys ?? {}
    const videoKeys = responseData.videoKeys ?? {}

    if (Array.isArray(structure)) {
      return normalizeSections(structure, imageKeys, videoKeys)
    }

    if (typeof structure !== "string" || structure.trim().length === 0) {
      return []
    }

    try {
      const parsedStructure = JSON.parse(structure)

      return normalizeSections(parsedStructure, imageKeys, videoKeys)
    } catch (error) {
      toast.error("Could not read saved lesson", {
        description:
            error?.message || "The saved lesson component JSON is invalid.",
      })

      return []
    }
  }

  useEffect(() => {
    let isMounted = true

    async function loadSavedLesson() {
      if (!lessonId) {
        if (isMounted) {
          setSections([])
          setIsLoadingLesson(false)
        }

        return
      }

      try {
        setIsLoadingLesson(true)

        const response = await getLessonComponent(lessonId)
        const savedSections = parseLessonComponent(response)

        if (!isMounted) {
          return
        }

        setSections(savedSections)
        setSectionIndex(0)
      } catch (error) {
        if (isMounted) {
          setSections([])

          const errorMessage = "Could not load the saved lesson content."

          setValidationError(errorMessage)

          toast.error("Could not load lesson", {
            description: error?.message || errorMessage,
          })
        }
      } finally {
        if (isMounted) {
          setIsLoadingLesson(false)
        }
      }
    }

    loadSavedLesson()

    return () => {
      isMounted = false
    }
  }, [lessonId])

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
    setSections((previousSections) => {
      const updatedSections = previousSections.filter(
          (section) => section.id !== sectionId
      )

      setSectionIndex(
          updatedSections.length === 0
              ? 0
              : Math.min(sectionIndex, updatedSections.length - 1)
      )

      return updatedSections
    })
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

  function handleToolDataChange(targetSectionIndex, targetToolIndex, newData) {
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

    if (tool.type === "unordered-list" || tool.type === "ordered-list") {
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

    if (tool.type === "image-left-text" || tool.type === "image-right-text") {
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

  function isBrowserFile(value) {
    return typeof File !== "undefined" && value instanceof File
  }

  function getUploadedFileKey(uploadResponse) {
    const responseData = uploadResponse?.data ?? uploadResponse

    if (typeof responseData === "string") {
      return responseData.trim().replace(/^"/, "").replace(/"$/, "")
    }

    return (
        responseData?.fileKey ??
        responseData?.key ??
        responseData?.imageKey ??
        responseData?.videoKey ??
        ""
    )
  }

  async function uploadToolMedia(tool, sectionName) {
    const mediaConfig = MEDIA_TOOL_CONFIG[tool.type]

    const currentData = {
      ...(tool.data ?? {}),
    }

    if (!mediaConfig) {
      return {
        ...tool,
        data: currentData,
      }
    }

    const selectedFile = currentData.file

    if (!isBrowserFile(selectedFile)) {
      return {
        ...tool,
        data: {
          ...currentData,
          file: null,
          [mediaConfig.keyField]: currentData[mediaConfig.keyField] ?? "",
        },
      }
    }

    const uploadResponse = await MediaFileUpload(
        lessonId,
        sectionName,
        tool.id,
        mediaConfig.folderName,
        selectedFile
    )

    const uploadedFileKey = getUploadedFileKey(uploadResponse)

    if (!uploadedFileKey) {
      throw new Error(`No file key was returned while uploading ${tool.type}.`)
    }

    return {
      ...tool,
      data: {
        ...currentData,
        file: null,
        [mediaConfig.keyField]: uploadedFileKey,
      },
    }
  }

  async function buildSavedLessonStructure() {
    return Promise.all(
        sections.map(async (section) => {
          const savedTools = await Promise.all(
              section.content.map((tool) =>
                  uploadToolMedia(tool, section.sectionName)
              )
          )

          return {
            ...section,
            content: savedTools,
          }
        })
    )
  }

  async function handleSaveLesson() {
    if (isLoadingLesson) {
      return
    }

    const error = validateLesson()

    if (error) {
      setValidationError(error)
      return
    }

    try {
      setIsSaving(true)

      const savedLessonStructure = await buildSavedLessonStructure()

      await setLessonComponent(lessonId, savedLessonStructure)

      setSections(savedLessonStructure)
      setIsSuccessDialogOpen(true)

      toast.success("Lesson saved", {
        description: `${lessonName} was saved successfully.`,
      })
    } catch (error) {
      const errorMessage = "Could not save the lesson. Please try again."

      setValidationError(errorMessage)

      toast.error("Could not save lesson", {
        description: error?.message || errorMessage,
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
      <TooltipProvider delayDuration={150}>
        <section className="flex h-full min-h-0 w-full min-w-0 flex-col overflow-hidden bg-background">
          <header className="flex shrink-0 items-center justify-between border-b bg-background px-4 py-4 sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={handleCancel}
                  aria-label="Back"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>

              <div className="min-w-0">
                <p className="text-sm text-muted-foreground">
                  Lesson editor
                </p>

                <h1 className="truncate text-lg font-semibold tracking-tight">
                  {lessonName}
                </h1>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  className="hidden sm:inline-flex"
              >
                Cancel
              </Button>

              <Button
                  type="button"
                  onClick={handleSaveLesson}
                  disabled={isSaving || isLoadingLesson}
                  className="gap-2"
              >
                <Save className="h-4 w-4" />

                <span className="hidden sm:inline">
                {isLoadingLesson
                    ? "Loading..."
                    : isSaving
                        ? "Saving..."
                        : "Save Lesson"}
              </span>

                <span className="sm:hidden">
                {isLoadingLesson
                    ? "Loading..."
                    : isSaving
                        ? "Saving..."
                        : "Save"}
              </span>
              </Button>
            </div>
          </header>

          <AlertDialog
              open={isSuccessDialogOpen}
              onOpenChange={setIsSuccessDialogOpen}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Lesson saved</AlertDialogTitle>

                <AlertDialogDescription>
                  {lessonName} was saved successfully.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogAction onClick={() => navigate(-1)}>
                  Done
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
                <AlertDialogMedia className="bg-destructive/10 text-destructive">
                  <CircleAlert />
                </AlertDialogMedia>

                <AlertDialogTitle>Cannot save lesson</AlertDialogTitle>

                <AlertDialogDescription>
                  {validationError}
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogAction onClick={() => setValidationError("")}>
                  Okay
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog
              open={isErrorAddingToolWithoutSection}
              onOpenChange={setIsErrorAddingToolWithoutSection}
          >
            <AlertDialogContent size="sm">
              <AlertDialogHeader>
                <AlertDialogMedia className="bg-destructive/10 text-destructive">
                  <CircleAlert />
                </AlertDialogMedia>

                <AlertDialogTitle>Create a section first</AlertDialogTitle>

                <AlertDialogDescription>
                  Add a section before adding lesson content.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogAction
                    onClick={() => setIsErrorAddingToolWithoutSection(false)}
                >
                  Okay
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <div className="min-h-0 min-w-0 flex-1 overflow-hidden p-4 sm:p-6">
            <div className="mx-auto h-full min-h-0 w-full max-w-[1600px] overflow-hidden rounded-lg border bg-background">
              <main className="min-h-0 min-w-0 overflow-y-auto">
                <div className="mx-auto w-full max-w-[1280px] p-5 sm:p-6">
                  {isLoadingLesson ? (
                      <Card className="mt-6 shadow-none">
                        <CardContent className="flex min-h-[460px] flex-col items-center justify-center px-6 text-center">
                          <div className="h-10 w-10 animate-spin rounded-full border-4 border-muted border-t-primary" />

                          <h3 className="mt-5 text-base font-semibold">
                            Loading lesson content
                          </h3>

                          <p className="mt-2 text-sm text-muted-foreground">
                            Loading sections, blocks, images, and videos.
                          </p>
                        </CardContent>
                      </Card>
                  ) : sections.length === 0 ? (
                      <Card className="mt-6 shadow-none">
                        <CardContent className="flex min-h-[460px] flex-col items-center justify-center px-6 text-center">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                            <BetweenHorizontalEnd className="h-5 w-5 text-muted-foreground" />
                          </div>

                          <h3 className="mt-4 text-base font-semibold">
                            Start building your lesson
                          </h3>

                          <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
                            Add your first section, then use the tools beside the
                            selected section to add text, images, videos, and
                            interactive content.
                          </p>

                          <Button
                              type="button"
                              onClick={handleAddSection}
                              className="mt-5 gap-2"
                          >
                            <Plus className="h-4 w-4" />
                            Add first section
                          </Button>
                        </CardContent>
                      </Card>
                  ) : (
                      <div className="mt-6 space-y-6 pb-8">
                        {sections.map((section, index) => {
                          const isSelected = sectionIndex === index

                          return (
                              <div
                                  key={section.id}
                                  className="grid items-center gap-3 xl:grid-cols-[minmax(0,1fr)_48px] xl:gap-3"
                                  onMouseDown={() => setSectionIndex(index)}
                                  onFocusCapture={() => setSectionIndex(index)}
                              >
                                <div className="min-w-0">
                                  <Section
                                      section={section}
                                      sectionIndex={index}
                                      onChange={handleSectionChange}
                                      onDelete={handleDeleteSection}
                                      handleRemovalTool={handleRemoveTool}
                                      handleToolDataChange={handleToolDataChange}
                                      onClick={() => setSectionIndex(index)}
                                  />
                                </div>

                                {isSelected && (
                                    <div className="hidden self-center xl:flex xl:justify-center">
                                      <SectionToolsRail
                                          isLoadingLesson={isLoadingLesson}
                                          onAddTool={handleAddTool}
                                      />
                                    </div>
                                )}

                                {isSelected && (
                                    <div className="flex justify-start xl:hidden">
                                      <SectionToolsRail
                                          isLoadingLesson={isLoadingLesson}
                                          onAddTool={handleAddTool}
                                      />
                                    </div>
                                )}
                              </div>
                          )
                        })}

                        <div className=" flex pl-10">
                          <Button
                              type="button"
                              variant="outline"
                              onClick={handleAddSection}
                              className="h-12 w-[92%] border-dashed text-muted-foreground hover:text-foreground"
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Add another section
                          </Button>

                          <div className="hidden xl:block" aria-hidden="true" />
                        </div>
                      </div>
                  )}
                </div>
              </main>
            </div>
          </div>
        </section>
      </TooltipProvider>
  )
}

export default CreateLessons