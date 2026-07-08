import { useEffect, useMemo, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useNavigate, useOutletContext, useParams } from "react-router-dom"
import { toast } from "sonner"
import {
  ArrowRight,
  Bot,
  BotIcon,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Circle,
  Loader2,
  Menu,
  PlayCircle,
  Plus,
  Search,
  SendHorizontal,
  Sparkles,
  X,
} from "lucide-react"

import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Message,
  MessageContent,
} from "@/components/ui/message"
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"

import { cn } from "@/lib/utils"
import { base } from "@/services/base"
import { getFileViewUrl } from "@/services/fileService.js"
import {
  getCertificationModules,
  getLessonById,
  markLessonComplete,
  parseLessonStructure,
} from "@/services/learnerService.js"
import { LearnerEmptyState } from "@/components/learner/learner-ui.jsx"

const AI_TUTOR_ENDPOINT = "ai/tutor"

function renderText(text, className) {
  return String(text ?? "")
      .split("\n")
      .filter(Boolean)
      .map((line, index) => (
          <p key={`${line}-${index}`} className={className}>
            {line}
          </p>
      ))
}

function LessonTool({ tool }) {
  const data = tool?.data ?? {}

  if (tool.type === "heading") {
    return (
        <h2 className="text-3xl font-bold tracking-tight text-zinc-950">
          {data.text}
        </h2>
    )
  }

  if (tool.type === "subheading") {
    return (
        <h3 className="text-xl font-semibold text-zinc-900">
          {data.text}
        </h3>
    )
  }

  if (tool.type === "description") {
    return (
        <div className="space-y-3">
          {renderText(data.text, "text-base leading-8 text-zinc-600")}
        </div>
    )
  }

  if (tool.type === "unordered-list" || tool.type === "ordered-list") {
    const Tag = tool.type === "ordered-list" ? "ol" : "ul"

    return (
        <Tag
            className={`space-y-2 pl-6 text-zinc-700 ${
                tool.type === "ordered-list" ? "list-decimal" : "list-disc"
            }`}
        >
          {(data.items ?? []).map((item) => (
              <li key={item.id ?? item.text}>{item.text}</li>
          ))}
        </Tag>
    )
  }

  if (tool.type === "image") {
    return data.imageKey ? (
        <img
            src={getFileViewUrl(data.imageKey)}
            alt=""
            className="max-h-[520px] w-full rounded-2xl bg-zinc-50 object-contain"
        />
    ) : null
  }

  if (tool.type === "video") {
    return data.videoKey ? (
        <video
            controls
            className="w-full rounded-2xl bg-zinc-950"
            src={getFileViewUrl(data.videoKey)}
        />
    ) : null
  }

  if (tool.type === "image-left-text" || tool.type === "image-right-text") {
    const image = data.imageKey ? (
        <img
            src={getFileViewUrl(data.imageKey)}
            alt={data.title ?? ""}
            className="h-72 w-full rounded-2xl object-cover"
        />
    ) : (
        <div className="flex h-72 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-400">
          No image
        </div>
    )

    const text = (
        <div>
          <h3 className="text-xl font-semibold text-zinc-950">
            {data.title}
          </h3>

          <p className="mt-3 leading-7 text-zinc-600">
            {data.description}
          </p>
        </div>
    )

    return (
        <div className="grid gap-6 md:grid-cols-2 md:items-center">
          {tool.type === "image-left-text" ? image : text}
          {tool.type === "image-left-text" ? text : image}
        </div>
    )
  }

  if (tool.type === "tabs") {
    return (
        <div className="grid gap-3 md:grid-cols-2">
          {(data.items ?? []).map((item) => (
              <div
                  key={item.id ?? item.label}
                  className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4"
              >
                <p className="text-sm font-semibold text-zinc-500">
                  {item.label}
                </p>

                <h3 className="mt-2 font-semibold text-zinc-950">
                  {item.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-zinc-600">
                  {item.description}
                </p>
              </div>
          ))}
        </div>
    )
  }

  if (tool.type === "accordion") {
    return (
        <div className="divide-y divide-zinc-100 rounded-2xl border border-zinc-200">
          {(data.items ?? []).map((item) => (
              <details key={item.id ?? item.title} className="group p-4">
                <summary className="cursor-pointer list-none font-semibold text-zinc-950">
                  {item.title}
                </summary>

                <p className="mt-3 text-sm leading-6 text-zinc-600">
                  {item.content}
                </p>
              </details>
          ))}
        </div>
    )
  }

  if (tool.type === "flip-grid") {
    return (
        <div className="grid gap-4 md:grid-cols-2">
          {(data.cards ?? []).map((card) => (
              <div
                  key={card.id ?? card.frontTitle}
                  className="rounded-2xl border border-zinc-200 bg-white p-5"
              >
                <p className="font-semibold text-zinc-950">
                  {card.frontTitle}
                </p>

                <p className="mt-3 text-sm font-medium text-zinc-600">
                  {card.backTitle}
                </p>

                <p className="mt-2 text-sm leading-6 text-zinc-500">
                  {card.description}
                </p>
              </div>
          ))}
        </div>
    )
  }

  return (
      <div className="rounded-xl border border-dashed border-zinc-300 p-4 text-sm text-zinc-500">
        Unsupported lesson block: {tool.type}
      </div>
  )
}

function useIsXl() {
  const [isXl, setIsXl] = useState(() => {
    if (typeof window === "undefined") {
      return false
    }

    return window.matchMedia("(min-width: 1280px)").matches
  })

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1280px)")

    function handleChange(event) {
      setIsXl(event.matches)
    }

    mediaQuery.addEventListener("change", handleChange)

    return () => {
      mediaQuery.removeEventListener("change", handleChange)
    }
  }, [])

  return isXl
}

function getLessonId(lesson) {
  return String(lesson?.lessonId ?? lesson?.id ?? "")
}

function getLessonTitle(lesson) {
  return lesson?.name ?? lesson?.title ?? "Untitled Lesson"
}

function getMajorTitle(major, index) {
  return major?.title ?? major?.name ?? `Module ${index + 1}`
}

function getMiddleTitle(middle, index) {
  return middle?.title ?? middle?.name ?? `Category ${index + 1}`
}

function getMiddleCategories(major) {
  if (Array.isArray(major?.middleCategory)) {
    return major.middleCategory
  }

  if (Array.isArray(major?.middleCategories)) {
    return major.middleCategories
  }

  return []
}

function getMiddleLessons(middle) {
  return Array.isArray(middle?.lessons) ? middle.lessons : []
}

function isCompleted(lesson) {
  return Boolean(lesson?.completed)
}

function createTutorMessageId(prefix = "message") {
  if (
      typeof crypto !== "undefined" &&
      typeof crypto.randomUUID === "function"
  ) {
    return `${prefix}-${crypto.randomUUID()}`
  }

  return `${prefix}-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}`
}

function getTutorResponseText(response) {
  const payload = response?.data ?? response ?? {}

  if (typeof payload === "string") {
    return payload
  }

  return (
      payload.answer ??
      payload.reply ??
      payload.message ??
      payload.content ??
      payload.response ??
      ""
  )
}

function getTutorErrorMessage(error) {
  return (
      error?.response?.data?.message ??
      error?.message ??
      "I could not answer right now. Please try again."
  )
}

function buildModulesFromLessons(lessons) {
  const majorMap = new Map()

  lessons.forEach((lesson) => {
    const majorId =
        lesson.majorCategoryId ??
        lesson.majorCategoryTitle ??
        "uncategorized-major"

    const middleId =
        lesson.middleCategoryId ??
        lesson.middleCategoryTitle ??
        "uncategorized-middle"

    if (!majorMap.has(String(majorId))) {
      majorMap.set(String(majorId), {
        majorCategoryId: majorId,
        title: lesson.majorCategoryTitle ?? "Learning Module",
        middleCategory: [],
      })
    }

    const major = majorMap.get(String(majorId))

    let middle = major.middleCategory.find(
        (item) =>
            String(item.middleCategoryId ?? item.title) === String(middleId)
    )

    if (!middle) {
      middle = {
        middleCategoryId: middleId,
        title: lesson.middleCategoryTitle ?? "Lessons",
        lessons: [],
      }

      major.middleCategory.push(middle)
    }

    middle.lessons.push(lesson)
  })

  return Array.from(majorMap.values())
}

function normalizeModules(certification, certificationLessons) {
  const providedModules = certification
      ? getCertificationModules(certification)
      : []

  if (Array.isArray(providedModules) && providedModules.length > 0) {
    return providedModules
  }

  return buildModulesFromLessons(certificationLessons)
}

function GeminiTutorMessage({ message }) {
  const isLearner = message.role === "user"

  return (
      <Message align={isLearner ? "end" : "start"}>
        <MessageContent>
          {!isLearner ? (
              <p className="mb-1 text-xs font-semibold text-primary">
                REBYU AI Tutor
              </p>
          ) : null}

          <Bubble
              variant={isLearner ? "default" : "secondary"}
              align={isLearner ? "end" : "start"}
          >
            <BubbleContent className="whitespace-pre-wrap text-sm leading-6">
              {message.text}
            </BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
  )
}

function GeminiStyleTutor({
                            lessonId,
                            lessonName,
                            learnerName,
                            onClose,
                          }) {
  const [messages, setMessages] = useState([])
  const [draft, setDraft] = useState("")
  const [pending, setPending] = useState(false)

  useEffect(() => {
    setMessages([])
    setDraft("")
    setPending(false)
  }, [lessonId])

  async function sendTutorMessage(value) {
    const question = String(value ?? "").trim()

    if (!question || pending) {
      return
    }

    setMessages((current) => [
      ...current,
      {
        id: createTutorMessageId("learner"),
        role: "user",
        text: question,
      },
    ])

    setDraft("")
    setPending(true)

    try {
      const response = await base(AI_TUTOR_ENDPOINT, {
        method: "POST",
        data: {
          sessionId: 1,
          lessonName: lessonName,
          message: question,
        },
      })

      const answer = String(getTutorResponseText(response)).trim()

      if (!answer) {
        throw new Error("The AI Tutor did not return a response.")
      }

      setMessages((current) => [
        ...current,
        {
          id: createTutorMessageId("assistant"),
          role: "assistant",
          text: answer,
        },
      ])
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          id: createTutorMessageId("error"),
          role: "assistant",
          text: getTutorErrorMessage(error),
        },
      ])
    } finally {
      setPending(false)
    }
  }

  function handleSubmit(event) {
    event.preventDefault()
    sendTutorMessage(draft)
  }

  function handleKeyDown(event) {
    if (
        event.key === "Enter" &&
        !event.shiftKey &&
        !event.nativeEvent.isComposing
    ) {
      event.preventDefault()
      sendTutorMessage(draft)
    }
  }

  const hasConversation = messages.length > 0

  return (
      <section className="flex h-full min-h-0 flex-col bg-white">
        <header className="flex h-12 shrink-0 items-center justify-between border-b border-zinc-100 px-4">
          <div className="flex items-center gap-2">
            <Bot className="size-4 text-primary" />

            <p className="text-sm font-semibold text-zinc-800">
              REBYU AI Tutor
            </p>
          </div>

          <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onClose}
              aria-label="Close AI Tutor"
              className="size-8 text-zinc-500 hover:text-zinc-950"
          >
            <X className="size-4" />
          </Button>
        </header>

        {!hasConversation ? (
            <div className="flex min-h-0 flex-1 flex-col justify-end px-5 pb-7">
              <div>
                <p className="text-xl font-semibold tracking-tight text-primary">
                  Hello, {learnerName}
                </p>

                <h2 className="mt-1 text-xl font-medium tracking-tight text-zinc-700">
                  How can I help you today?
                </h2>

                <p className="mt-3 text-sm leading-6 text-zinc-500">
                  Ask me anything about{" "}
                  <span className="font-medium text-zinc-700">
                {lessonName ?? "this lesson"}
              </span>
                  .
                </p>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="h-8 rounded-full text-xs"
                    disabled={pending}
                    onClick={() =>
                        sendTutorMessage("Explain this lesson in simple words.")
                    }
                >
                  <Sparkles className="size-3.5" />
                  Explain simply
                </Button>

                <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="h-8 rounded-full text-xs"
                    disabled={pending}
                    onClick={() =>
                        sendTutorMessage(
                            "Give me a simple real-life example about this topic."
                        )
                    }
                >
                  Give example
                </Button>

                <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="h-8 rounded-full text-xs"
                    disabled={pending}
                    onClick={() =>
                        sendTutorMessage(
                            "Create one short practice question about this lesson."
                        )
                    }
                >
                  Practice me
                </Button>
              </div>
            </div>
        ) : (
            <MessageScrollerProvider autoScroll scrollPreviousItemPeek={48}>
              <MessageScroller className="min-h-0 flex-1">
                <MessageScrollerViewport>
                  <MessageScrollerContent
                      className="space-y-5 px-4 py-5"
                      aria-busy={pending}
                  >
                    {messages.map((message) => (
                        <MessageScrollerItem
                            key={message.id}
                            messageId={message.id}
                            scrollAnchor={message.role === "user"}
                        >
                          <GeminiTutorMessage message={message} />
                        </MessageScrollerItem>
                    ))}

                    {pending ? (
                        <MessageScrollerItem messageId={`thinking-${lessonId}`}>
                          <Message align="start">
                            <MessageContent>
                              <p className="mb-1 text-xs font-semibold text-primary">
                                REBYU AI Tutor
                              </p>

                              <Bubble variant="secondary">
                                <BubbleContent className="flex items-center gap-2 text-sm text-zinc-500">
                                  <Loader2 className="size-4 animate-spin" />
                                  Thinking...
                                </BubbleContent>
                              </Bubble>
                            </MessageContent>
                          </Message>
                        </MessageScrollerItem>
                    ) : null}
                  </MessageScrollerContent>
                </MessageScrollerViewport>

                <MessageScrollerButton />
              </MessageScroller>
            </MessageScrollerProvider>
        )}

        <form
            onSubmit={handleSubmit}
            className="shrink-0 border-t border-zinc-100 bg-white p-4"
        >
          <div className="rounded-2xl border border-zinc-200 bg-white p-2 shadow-sm">
            <Textarea
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type to ask about this lesson"
                disabled={pending}
                className="min-h-[72px] resize-none border-0 bg-transparent px-2 py-2 text-sm shadow-none outline-none focus-visible:ring-0"
            />

            <div className="flex items-center justify-between px-1 pb-1">
              <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-8 text-zinc-500"
                  aria-label="Add attachment"
              >
                <Plus className="size-4" />
              </Button>

              <div className="flex items-center gap-2">
              <span className="hidden text-[10px] text-zinc-400 sm:inline">
                REBYU AI
              </span>

                <Button
                    type="submit"
                    size="icon"
                    disabled={pending || !draft.trim()}
                    aria-label="Send message"
                    className="size-8 rounded-lg"
                >
                  {pending ? (
                      <Loader2 className="size-4 animate-spin" />
                  ) : (
                      <SendHorizontal className="size-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          <p className="mt-2 text-center text-[10px] text-zinc-400">
            AI responses may be inaccurate. Review your lesson materials.
          </p>
        </form>
      </section>
  )
}

function CourseOutline({
                         modules,
                         currentLessonId,
                         lessonById,
                         onOpenLesson,
                       }) {
  const [search, setSearch] = useState("")
  const [expandedModules, setExpandedModules] = useState(() => new Set())

  useEffect(() => {
    const currentLessonModules = new Set()

    modules.forEach((major, majorIndex) => {
      const containsCurrentLesson = getMiddleCategories(major).some((middle) =>
          getMiddleLessons(middle).some(
              (lesson) => getLessonId(lesson) === String(currentLessonId)
          )
      )

      if (containsCurrentLesson) {
        currentLessonModules.add(
            String(
                major.majorCategoryId ??
                major.id ??
                `major-${majorIndex}`
            )
        )
      }
    })

    if (currentLessonModules.size > 0) {
      setExpandedModules((current) => {
        const next = new Set(current)

        currentLessonModules.forEach((moduleId) => {
          next.add(moduleId)
        })

        return next
      })
    }
  }, [modules, currentLessonId])

  const normalizedSearch = search.trim().toLowerCase()

  const visibleModules = useMemo(() => {
    if (!normalizedSearch) {
      return modules
    }

    return modules
        .map((major, majorIndex) => {
          const majorMatches = getMajorTitle(major, majorIndex)
              .toLowerCase()
              .includes(normalizedSearch)

          const visibleMiddleCategories = getMiddleCategories(major)
              .map((middle, middleIndex) => {
                const middleMatches = getMiddleTitle(middle, middleIndex)
                    .toLowerCase()
                    .includes(normalizedSearch)

                const visibleLessons = getMiddleLessons(middle).filter((lesson) =>
                    getLessonTitle(lesson)
                        .toLowerCase()
                        .includes(normalizedSearch)
                )

                if (!middleMatches && visibleLessons.length === 0) {
                  return null
                }

                return {
                  ...middle,
                  lessons: middleMatches
                      ? getMiddleLessons(middle)
                      : visibleLessons,
                }
              })
              .filter(Boolean)

          if (!majorMatches && visibleMiddleCategories.length === 0) {
            return null
          }

          return {
            ...major,
            middleCategory: majorMatches
                ? getMiddleCategories(major)
                : visibleMiddleCategories,
          }
        })
        .filter(Boolean)
  }, [modules, normalizedSearch])

  function toggleModule(moduleKey) {
    setExpandedModules((current) => {
      const next = new Set(current)

      if (next.has(moduleKey)) {
        next.delete(moduleKey)
      } else {
        next.add(moduleKey)
      }

      return next
    })
  }

  return (
      <div className="flex h-full min-h-0 flex-col bg-white">
        <div className="border-b border-zinc-200 px-4 py-4">
          <p className="text-sm font-semibold text-zinc-950">
            Course Outline
          </p>

          <p className="mt-1 text-xs text-zinc-500">
            Browse modules and continue your lessons.
          </p>

          <div className="relative mt-4">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />

            <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search course outline"
                className="h-9 rounded-lg pl-9 text-xs"
            />
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {visibleModules.length === 0 ? (
              <p className="px-4 py-10 text-center text-sm text-zinc-500">
                No lessons found.
              </p>
          ) : (
              visibleModules.map((major, majorIndex) => {
                const moduleKey = String(
                    major.majorCategoryId ??
                    major.id ??
                    `major-${majorIndex}`
                )

                const isExpanded =
                    Boolean(normalizedSearch) || expandedModules.has(moduleKey)

                const middleCategories = getMiddleCategories(major)

                const allModuleLessons = middleCategories.flatMap((middle) =>
                    getMiddleLessons(middle)
                )

                const completedCount = allModuleLessons.filter((lesson) => {
                  const learnerLesson =
                      lessonById.get(getLessonId(lesson)) ?? lesson

                  return isCompleted(learnerLesson)
                }).length

                const moduleProgress = allModuleLessons.length
                    ? Math.round(
                        (completedCount / allModuleLessons.length) * 100
                    )
                    : 0

                return (
                    <div key={moduleKey} className="border-b border-zinc-200">
                      <button
                          type="button"
                          onClick={() => toggleModule(moduleKey)}
                          className="w-full px-4 py-3.5 text-left transition hover:bg-zinc-50"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate text-xs font-semibold text-zinc-900">
                              Module {majorIndex + 1}:{" "}
                              {getMajorTitle(major, majorIndex)}
                            </p>

                            <p className="mt-1 text-[11px] text-zinc-500">
                              {completedCount} of {allModuleLessons.length} lessons
                              completed
                            </p>
                          </div>

                          {isExpanded ? (
                              <ChevronDown className="mt-0.5 size-4 shrink-0 text-zinc-500" />
                          ) : (
                              <ChevronRight className="mt-0.5 size-4 shrink-0 text-zinc-500" />
                          )}
                        </div>

                        <div className="mt-3 flex items-center gap-2.5">
                          <div className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-zinc-200">
                            <div
                                className="h-full rounded-full bg-primary transition-all"
                                style={{
                                  width: `${moduleProgress}%`,
                                }}
                            />
                          </div>

                          <span className="w-8 shrink-0 text-right text-[11px] font-medium tabular-nums text-zinc-500">
                      {moduleProgress}%
                    </span>
                        </div>
                      </button>

                      {isExpanded ? (
                          <div className="pb-3">
                            {middleCategories.map((middle, middleIndex) => {
                              const middleLessons = getMiddleLessons(middle)

                              const isCurrentMiddle = middleLessons.some(
                                  (lesson) =>
                                      getLessonId(lesson) === String(currentLessonId)
                              )

                              return (
                                  <div
                                      key={
                                          middle.middleCategoryId ??
                                          middle.id ??
                                          `middle-${middleIndex}`
                                      }
                                  >
                                    <div
                                        className={cn(
                                            "border-y px-4 py-2.5",
                                            isCurrentMiddle
                                                ? "border-primary/20 bg-primary/10"
                                                : "border-zinc-100 bg-zinc-50"
                                        )}
                                    >
                                      <p className="text-xs font-semibold text-zinc-800">
                                        {getMiddleTitle(middle, middleIndex)}
                                      </p>
                                    </div>

                                    <div className="py-1">
                                      {middleLessons.map((lesson, lessonIndex) => {
                                        const learnerLesson =
                                            lessonById.get(getLessonId(lesson)) ?? lesson

                                        const active =
                                            getLessonId(lesson) === String(currentLessonId)

                                        return (
                                            <button
                                                key={
                                                    getLessonId(lesson) ||
                                                    `lesson-${lessonIndex}`
                                                }
                                                type="button"
                                                onClick={() => onOpenLesson(learnerLesson)}
                                                className={cn(
                                                    "flex w-full items-center gap-2 border-l-2 px-4 py-2 text-left transition",
                                                    active
                                                        ? "border-primary bg-primary/10 text-primary"
                                                        : "border-transparent text-zinc-600 hover:bg-zinc-50 hover:text-zinc-950"
                                                )}
                                            >
                                              {isCompleted(learnerLesson) ? (
                                                  <CheckCircle2 className="size-3.5 shrink-0 text-primary" />
                                              ) : (
                                                  <Circle className="size-3.5 shrink-0 text-zinc-400" />
                                              )}

                                              <span className="min-w-0 truncate text-xs">
                                    {majorIndex + 1}.{middleIndex + 1}.
                                                {lessonIndex + 1}{" "}
                                                {getLessonTitle(learnerLesson)}
                                  </span>
                                            </button>
                                        )
                                      })}
                                    </div>
                                  </div>
                              )
                            })}
                          </div>
                      ) : null}
                    </div>
                )
              })
          )}
        </div>
      </div>
  )
}

export default function LearnerLessonPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { lessonId } = useParams()
  const { data } = useOutletContext()

  const [navOpen, setNavOpen] = useState(false)
  const [coachOpen, setCoachOpen] = useState(false)

  const isXl = useIsXl()

  const lessons = data?.lessons ?? []
  const completedLessons = data?.completedLessons ?? []
  const enrolledCertifications = data?.enrolledCertifications ?? []

  const lessonQuery = useQuery({
    queryKey: ["learner-lesson", lessonId],
    queryFn: () => getLessonById(lessonId),
  })

  const currentLesson =
      lessons.find(
          (lesson) => String(lesson.lessonId) === String(lessonId)
      ) ?? lessonQuery.data

  const certification = enrolledCertifications.find(
      (item) =>
          String(item.certificationId) ===
          String(currentLesson?.certificationId)
  )

  const certificationLessons = lessons.filter(
      (lesson) =>
          String(lesson.certificationId) ===
          String(currentLesson?.certificationId)
  )

  const lessonById = useMemo(() => {
    return new Map(
        certificationLessons.map((lesson) => [
          String(lesson.lessonId),
          lesson,
        ])
    )
  }, [certificationLessons])

  const modules = useMemo(() => {
    return normalizeModules(certification, certificationLessons)
  }, [certification, certificationLessons])

  const currentIndex = certificationLessons.findIndex(
      (lesson) => String(lesson.lessonId) === String(lessonId)
  )

  const previousLesson =
      currentIndex > 0
          ? certificationLessons[currentIndex - 1]
          : null

  const nextLesson =
      currentIndex >= 0 &&
      currentIndex < certificationLessons.length - 1
          ? certificationLessons[currentIndex + 1]
          : null

  const sections = useMemo(() => {
    return parseLessonStructure(
        lessonQuery.data?.lessonComponentStructure ??
        currentLesson?.lessonComponentStructure
    )
  }, [
    currentLesson?.lessonComponentStructure,
    lessonQuery.data?.lessonComponentStructure,
  ])

  const completed =
      Boolean(currentLesson?.completed) ||
      completedLessons.some(
          (item) => String(item.lessonId) === String(lessonId)
      )

  const learnerName =
      data?.user?.firstName ??
      data?.user?.displayName ??
      data?.learner?.firstName ??
      data?.profile?.firstName ??
      "Learner"

  const completeMutation = useMutation({
    mutationFn: () =>
        markLessonComplete({
          learnerId: data?.learnerId,
          lessonId: Number(lessonId),
          completedAt: new Date().toISOString(),
        }),

    onSuccess: async () => {
      toast.success("Lesson marked complete")

      await queryClient.invalidateQueries({
        queryKey: ["learner-portal-data"],
      })
    },

    onError: (error) => {
      toast.error("Could not mark lesson complete", {
        description:
            error?.response?.data?.message ??
            error?.message ??
            "Please try again.",
      })
    },
  })

  function openLesson(lesson) {
    setNavOpen(false)
    navigate(`/learner/lessons/${lesson.lessonId}`)
  }

  if (lessonQuery.isLoading && !currentLesson) {
    return (
        <LearnerEmptyState
            icon={PlayCircle}
            title="Loading lesson"
            description="Preparing your lesson content."
        />
    )
  }

  if (!currentLesson) {
    return (
        <LearnerEmptyState
            title="Lesson not found"
            description="The lesson is not available from the backend."
        />
    )
  }

  return (
      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
        <div
            className={cn(
                "grid min-h-[calc(100dvh-8rem)]",
                coachOpen && isXl
                    ? "xl:grid-cols-[292px_minmax(0,1fr)_380px]"
                    : "xl:grid-cols-[292px_minmax(0,1fr)]"
            )}
        >
          {/* LEFT: Course Outline */}
          <aside className="hidden min-h-0 border-r border-zinc-200 xl:block">
            <div className="sticky top-0 h-[calc(100dvh-8rem)]">
              <CourseOutline
                  modules={modules}
                  currentLessonId={lessonId}
                  lessonById={lessonById}
                  onOpenLesson={openLesson}
              />
            </div>
          </aside>

          {/* CENTER: Lesson Content */}
          <main className="min-w-0 bg-white">
            <div className="min-h-[calc(100dvh-8rem)] px-5 py-10 sm:px-10 sm:py-12 xl:px-14">
              <article className="mx-auto w-full max-w-3xl">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-400">
                      {certification?.title ??
                          currentLesson.certificationTitle ??
                          "Certification"}
                    </p>

                    <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-950 sm:text-4xl">
                      {currentLesson.name}
                    </h1>
                  </div>

                  <Button
                      variant="outline"
                      size="sm"
                      className="shrink-0 gap-2 xl:hidden"
                      onClick={() => setNavOpen(true)}
                  >
                    <Menu className="size-4" />
                    Outline
                  </Button>
                </div>

                {sections.length === 0 ? (
                    <div className="mt-10">
                      <LearnerEmptyState
                          icon={PlayCircle}
                          title="No lesson blocks yet"
                          description="This lesson exists, but no learner-facing lesson content has been published yet."
                      />
                    </div>
                ) : (
                    <div className="mt-8 space-y-10">
                      {sections.map((section, index) => (
                          <section
                              key={section.id ?? index}
                              className="space-y-5"
                          >
                            {section.sectionName ? (
                                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-400">
                                  {section.sectionName}
                                </p>
                            ) : null}

                            {(section.content ?? []).map(
                                (tool, toolIndex) => (
                                    <LessonTool
                                        key={tool.id ?? toolIndex}
                                        tool={tool}
                                    />
                                )
                            )}
                          </section>
                      ))}
                    </div>
                )}

                <div className="mt-14 flex flex-col gap-3 border-t border-zinc-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
                  <Button
                      variant="outline"
                      disabled={!previousLesson}
                      onClick={() =>
                          previousLesson && openLesson(previousLesson)
                      }
                  >
                    Previous
                  </Button>

                  <div className="flex flex-wrap gap-2">
                    <Button
                        disabled={
                            completed ||
                            completeMutation.isPending ||
                            !data?.learnerId
                        }
                        onClick={() => completeMutation.mutate()}
                    >
                      {completed
                          ? "Completed"
                          : completeMutation.isPending
                              ? "Saving..."
                              : "Mark as Complete"}
                    </Button>

                    <Button
                        variant="outline"
                        disabled={!nextLesson}
                        onClick={() => nextLesson && openLesson(nextLesson)}
                        className="gap-2"
                    >
                      Next Lesson
                      <ArrowRight className="size-4" />
                    </Button>
                  </div>
                </div>
              </article>
            </div>
          </main>

          {/* RIGHT: AI Tutor */}
          {coachOpen && isXl ? (
              <aside className="hidden min-h-0 border-l border-zinc-200 bg-white xl:block">
                <div className="sticky top-0 h-[calc(100dvh-8rem)] overflow-hidden">
                  <GeminiStyleTutor
                      lessonId={lessonId}
                      lessonName={currentLesson.name}
                      learnerName={learnerName}
                      onClose={() => setCoachOpen(false)}
                  />
                </div>
              </aside>
          ) : null}
        </div>

        {!coachOpen ? (
            <Button
                type="button"
                onClick={() => setCoachOpen(true)}
                aria-label="Open AI Tutor"
                className="fixed bottom-6 right-6 z-50 size-14 rounded-full p-0 shadow-lg transition hover:scale-105 hover:shadow-xl"
            >
              <BotIcon className="size-6" aria-hidden="true" />
              <span className="sr-only">Open AI Tutor</span>
            </Button>
        ) : null}

        {/* Mobile Course Outline */}
        <Sheet open={navOpen} onOpenChange={setNavOpen}>
          <SheetContent side="left" className="w-full p-0 sm:max-w-sm">
            <SheetTitle className="sr-only">Course Outline</SheetTitle>

            <CourseOutline
                modules={modules}
                currentLessonId={lessonId}
                lessonById={lessonById}
                onOpenLesson={openLesson}
            />
          </SheetContent>
        </Sheet>

        {/* Mobile AI Tutor */}
        <Sheet
            open={coachOpen && !isXl}
            onOpenChange={(open) => {
              if (!open) {
                setCoachOpen(false)
              }
            }}
        >
          <SheetContent side="right" className="w-full gap-0 p-0 sm:max-w-md">
            <SheetTitle className="sr-only">AI Tutor</SheetTitle>

            <GeminiStyleTutor
                lessonId={lessonId}
                lessonName={currentLesson.name}
                learnerName={learnerName}
                onClose={() => setCoachOpen(false)}
            />
          </SheetContent>
        </Sheet>
      </div>
  )
}