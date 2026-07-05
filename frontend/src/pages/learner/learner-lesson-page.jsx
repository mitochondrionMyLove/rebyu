import React, { useMemo, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useNavigate, useOutletContext, useParams } from "react-router-dom"
import { toast } from "sonner"
import { ArrowLeft, ArrowRight, CheckCircle2, ChevronRight, Menu, PlayCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { getFileViewUrl } from "@/services/fileService.js"
import {
  getCertificationModules,
  getLessonById,
  markLessonComplete,
  parseLessonStructure,
} from "@/services/learnerService.js"
import {
  LearnerEmptyState,
  ProgressBar,
} from "@/components/learner/learner-ui.jsx"

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
    return <h2 className="text-3xl font-bold tracking-tight text-zinc-950">{data.text}</h2>
  }

  if (tool.type === "subheading") {
    return <h3 className="text-xl font-semibold text-zinc-900">{data.text}</h3>
  }

  if (tool.type === "description") {
    return <div className="space-y-3">{renderText(data.text, "text-base leading-8 text-zinc-600")}</div>
  }

  if (tool.type === "unordered-list" || tool.type === "ordered-list") {
    const Tag = tool.type === "ordered-list" ? "ol" : "ul"
    return (
      <Tag className={`space-y-2 pl-6 text-zinc-700 ${tool.type === "ordered-list" ? "list-decimal" : "list-disc"}`}>
        {(data.items ?? []).map((item) => (
          <li key={item.id ?? item.text}>{item.text}</li>
        ))}
      </Tag>
    )
  }

  if (tool.type === "image") {
    return data.imageKey ? (
      <img src={getFileViewUrl(data.imageKey)} alt="" className="max-h-[520px] w-full rounded-2xl object-contain bg-zinc-50" />
    ) : null
  }

  if (tool.type === "video") {
    return data.videoKey ? (
      <video controls className="w-full rounded-2xl bg-zinc-950" src={getFileViewUrl(data.videoKey)} />
    ) : null
  }

  if (tool.type === "image-left-text" || tool.type === "image-right-text") {
    const image = data.imageKey ? (
      <img src={getFileViewUrl(data.imageKey)} alt={data.title ?? ""} className="h-72 w-full rounded-2xl object-cover" />
    ) : (
      <div className="flex h-72 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-400">
        No image
      </div>
    )
    const text = (
      <div>
        <h3 className="text-xl font-semibold text-zinc-950">{data.title}</h3>
        <p className="mt-3 leading-7 text-zinc-600">{data.description}</p>
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
          <div key={item.id ?? item.label} className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
            <p className="text-sm font-semibold text-zinc-500">{item.label}</p>
            <h3 className="mt-2 font-semibold text-zinc-950">{item.title}</h3>
            <p className="mt-2 text-sm leading-6 text-zinc-600">{item.description}</p>
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
            <p className="mt-3 text-sm leading-6 text-zinc-600">{item.content}</p>
          </details>
        ))}
      </div>
    )
  }

  if (tool.type === "flip-grid") {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {(data.cards ?? []).map((card) => (
          <div key={card.id ?? card.frontTitle} className="rounded-2xl border border-zinc-200 bg-white p-5">
            <p className="font-semibold text-zinc-950">{card.frontTitle}</p>
            <p className="mt-3 text-sm font-medium text-zinc-600">{card.backTitle}</p>
            <p className="mt-2 text-sm leading-6 text-zinc-500">{card.description}</p>
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

function LessonNavigation({ lessons, currentLessonId, onOpen }) {
  return (
    <div className="space-y-2">
      {lessons.map((lesson) => {
        const active = String(lesson.lessonId) === String(currentLessonId)
        return (
          <button
            key={lesson.lessonId}
            type="button"
            onClick={() => onOpen(lesson.lessonId)}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition ${
              active ? "bg-zinc-950 text-white" : "hover:bg-zinc-100"
            }`}
          >
            {lesson.completed ? <CheckCircle2 className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            <span className="min-w-0 flex-1 truncate">{lesson.name}</span>
          </button>
        )
      })}
    </div>
  )
}

export default function LearnerLessonPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { lessonId } = useParams()
  const { data } = useOutletContext()
  const [navOpen, setNavOpen] = useState(false)

  const lessonQuery = useQuery({
    queryKey: ["learner-lesson", lessonId],
    queryFn: () => getLessonById(lessonId),
  })

  const currentLesson =
    data.lessons.find((lesson) => String(lesson.lessonId) === String(lessonId)) ??
    lessonQuery.data

  const certification = data.enrolledCertifications.find(
    (item) => String(item.certificationId) === String(currentLesson?.certificationId)
  )

  const certificationLessons = data.lessons.filter(
    (lesson) => String(lesson.certificationId) === String(currentLesson?.certificationId)
  )
  const currentIndex = certificationLessons.findIndex(
    (lesson) => String(lesson.lessonId) === String(lessonId)
  )
  const previousLesson = currentIndex > 0 ? certificationLessons[currentIndex - 1] : null
  const nextLesson =
    currentIndex >= 0 && currentIndex < certificationLessons.length - 1
      ? certificationLessons[currentIndex + 1]
      : null

  const sections = useMemo(
    () => parseLessonStructure(lessonQuery.data?.lessonComponentStructure ?? currentLesson?.lessonComponentStructure),
    [currentLesson?.lessonComponentStructure, lessonQuery.data?.lessonComponentStructure]
  )

  const completed = data.completedLessons.some(
    (item) => String(item.lessonId) === String(lessonId)
  )

  const completeMutation = useMutation({
    mutationFn: () =>
      markLessonComplete({
        learnerId: data.learnerId,
        lessonId: Number(lessonId),
        completedAt: new Date().toISOString(),
      }),
    onSuccess: async () => {
      toast.success("Lesson marked complete")
      await queryClient.invalidateQueries({ queryKey: ["learner-portal-data"] })
    },
    onError: (error) => {
      toast.error("Could not mark lesson complete", {
        description: error?.response?.data?.message || error?.message || "Please try again.",
      })
    },
  })

  if (lessonQuery.isLoading && !currentLesson) {
    return <LearnerEmptyState icon={BookOpen} title="Loading lesson" description="Preparing your lesson content." />
  }

  if (!currentLesson) {
    return <LearnerEmptyState title="Lesson not found" description="The lesson is not available from the backend." />
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
      <div className="min-w-0 space-y-6">
        <div className="flex items-center justify-between gap-3">
          <Button variant="ghost" className="gap-2" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <Button variant="outline" className="gap-2 xl:hidden" onClick={() => setNavOpen(true)}>
            <Menu className="h-4 w-4" />
            Lessons
          </Button>
        </div>

        <article className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-400">
            {certification?.title ?? currentLesson.certificationTitle ?? "Certification"}
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-zinc-950">
            {currentLesson.name}
          </h1>
          <p className="mt-3 text-sm text-zinc-500">
            {currentLesson.majorCategoryTitle} {currentLesson.middleCategoryTitle ? `· ${currentLesson.middleCategoryTitle}` : ""}
          </p>

          <div className="mt-6">
            <ProgressBar value={completed ? 100 : 0} />
          </div>

          {sections.length === 0 ? (
            <div className="mt-8">
              <LearnerEmptyState
                icon={PlayCircle}
                title="No lesson blocks yet"
                description="This lesson exists, but no learner-facing lesson content has been published yet."
              />
            </div>
          ) : (
            <div className="mt-8 space-y-10">
              {sections.map((section, index) => (
                <section key={section.id ?? index} className="space-y-5">
                  {section.sectionName && (
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-400">
                      {section.sectionName}
                    </p>
                  )}
                  {(section.content ?? []).map((tool, toolIndex) => (
                    <LessonTool key={tool.id ?? toolIndex} tool={tool} />
                  ))}
                </section>
              ))}
            </div>
          )}

          <div className="mt-10 flex flex-col gap-3 border-t border-zinc-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <Button
              variant="outline"
              disabled={!previousLesson}
              onClick={() => previousLesson && navigate(`/learner/lessons/${previousLesson.lessonId}`)}
            >
              Previous
            </Button>
            <div className="flex flex-wrap gap-2">
              <Button
                disabled={completed || completeMutation.isPending || !data.learnerId}
                onClick={() => completeMutation.mutate()}
              >
                {completed ? "Completed" : completeMutation.isPending ? "Saving..." : "Mark as Complete"}
              </Button>
              <Button
                variant="outline"
                disabled={!nextLesson}
                onClick={() => nextLesson && navigate(`/learner/lessons/${nextLesson.lessonId}`)}
                className="gap-2"
              >
                Next Lesson
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </article>
      </div>

      <aside className="hidden xl:block">
        <div className="sticky top-24 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
          <p className="mb-3 font-semibold text-zinc-950">Lesson Navigation</p>
          <LessonNavigation
            lessons={certificationLessons}
            currentLessonId={lessonId}
            onOpen={(id) => navigate(`/learner/lessons/${id}`)}
          />
        </div>
      </aside>

      <Sheet open={navOpen} onOpenChange={setNavOpen}>
        <SheetContent side="right" className="p-4">
          <SheetTitle>Lesson Navigation</SheetTitle>
          <LessonNavigation
            lessons={certificationLessons}
            currentLessonId={lessonId}
            onOpen={(id) => {
              setNavOpen(false)
              navigate(`/learner/lessons/${id}`)
            }}
          />
        </SheetContent>
      </Sheet>
    </div>
  )
}
