import React, { useEffect, useRef, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import {
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  ChevronDown,
  ChevronRight,
  ClipboardPlus,
  Layers3,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

function ViewCertificationAdmin() {
  const location = useLocation()
  const navigate = useNavigate()
  const pageRef = useRef(null)

  useEffect(() => {
    pageRef.current?.scrollIntoView({
      block: "start",
      behavior: "auto",
    })

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    })
  }, [location.key])

  const certification =
    location.state?.certification?.certification ??
    location.state?.certification ??
    null

  if (!certification) {
    return (
      <section className="flex min-h-full items-center justify-center bg-zinc-50 p-6">
        <div className="max-w-md rounded-3xl border border-zinc-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-semibold text-zinc-950">
            Certification not found
          </h1>

          <p className="mt-2 text-sm text-zinc-500">
            Go back to the certifications page and select a certification
            again.
          </p>

          <Button
            className="mt-6 bg-zinc-950 text-white hover:bg-zinc-800"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go back
          </Button>
        </div>
      </section>
    )
  }

  const majorCategories = certification.majorCategory ?? []

  const totalMiddleCategories = majorCategories.reduce(
    (total, majorCategory) =>
      total + (majorCategory.middleCategory?.length ?? 0),
    0
  )

  const totalLessons = majorCategories.reduce(
    (total, majorCategory) =>
      total +
      (majorCategory.middleCategory ?? []).reduce(
        (middleTotal, middleCategory) =>
          middleTotal + (middleCategory.lessons?.length ?? 0),
        0
      ),
    0
  )

  const imageSrc = certification.imageKey?.startsWith("http")
    ? certification.imageKey
    : `/${certification.imageKey?.replace(/^\/+/, "")}`

  function handleAddMockExam() {
    alert("Mock exam builder is not available yet.")
  }

  return (
    <section
      ref={pageRef}
      className="min-h-full overflow-y-auto bg-zinc-50"
    >
      <header className="bg-zinc-950 px-6 py-10 sm:px-10 lg:px-20 lg:py-14">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_230px] lg:items-center">
          <div>
            <Badge className="mb-4 border-0 bg-white px-3 py-1 text-xs font-semibold text-zinc-950 hover:bg-white">
              {certification.industry || "General"}
            </Badge>

            <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              {certification.title}
            </h1>

            <p className="mt-4 max-w-3xl text-sm leading-6 text-zinc-300 sm:text-base">
              {certification.description || "No description available."}
            </p>

            <div className="mt-7 flex flex-wrap gap-3 text-sm text-zinc-300">
              <div className="flex items-center gap-2 rounded-full border border-zinc-700 px-4 py-2">
                <Layers3 className="h-4 w-4" />

                <span>
                  {majorCategories.length} major{" "}
                  {majorCategories.length === 1 ? "category" : "categories"}
                </span>
              </div>

              <div className="flex items-center gap-2 rounded-full border border-zinc-700 px-4 py-2">
                <BookOpen className="h-4 w-4" />

                <span>
                  {totalMiddleCategories} modules · {totalLessons} lessons
                </span>
              </div>
            </div>
          </div>

          <div className="mx-auto flex h-44 w-44 items-center justify-center overflow-hidden rounded-2xl bg-zinc-100 sm:h-52 sm:w-52 lg:mx-0 lg:justify-self-end">
            {certification.imageKey ? (
              <img
                src={imageSrc}
                alt={certification.title}
                className="h-full w-full object-cover"
                onError={(event) => {
                  event.currentTarget.style.display = "none"
                }}
              />
            ) : (
              <BookOpen className="h-14 w-14 text-zinc-400" />
            )}
          </div>
        </div>
      </header>

      <main className="px-6 py-10 sm:px-10 lg:px-20 lg:py-12">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-500">
                Certification curriculum
              </p>

              <h2 className="mt-1 text-2xl font-semibold text-zinc-950">
                Course Modules
              </h2>

              <p className="mt-2 max-w-xl text-sm text-zinc-500">
                Manage the major categories, modules, lessons, and assessment
                structure under this certification.
              </p>
            </div>

            <Button
              onClick={handleAddMockExam}
              className="h-11 rounded-xl bg-zinc-950 px-5 font-medium text-white hover:bg-zinc-800"
            >
              <ClipboardPlus className="mr-2 h-4 w-4" />
              Add Mock Exam
            </Button>
          </div>

          {majorCategories.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-10 text-center">
              <Layers3 className="mx-auto h-8 w-8 text-zinc-400" />

              <h3 className="mt-4 font-semibold text-zinc-900">
                No major categories yet
              </h3>

              <p className="mt-2 text-sm text-zinc-500">
                Add a major category to start building this certification.
              </p>
            </div>
          ) : (
            <div className="space-y-10">
              {majorCategories.map((majorCategory, majorIndex) => (
                <MajorCategorySection
                  key={majorCategory.majorCategoryId}
                  majorCategory={majorCategory}
                  majorIndex={majorIndex}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </section>
  )
}

function MajorCategorySection({ majorCategory, majorIndex }) {
  const middleCategories = majorCategory.middleCategory ?? []

  return (
    <section>
      <div className="mb-3 flex items-center gap-2">
        <span className="text-sm font-semibold text-zinc-950">
          Major Category {majorIndex + 1}: {majorCategory.title}
        </span>

        {majorCategory.priority && (
          <Badge
            variant="secondary"
            className="bg-amber-100 text-[10px] font-bold uppercase tracking-wide text-amber-800"
          >
            {majorCategory.priority}
          </Badge>
        )}
      </div>

      <div className="space-y-3">
        {middleCategories.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-5 text-sm text-zinc-500">
            No middle categories under this major category.
          </div>
        ) : (
          middleCategories.map((middleCategory) => (
            <MiddleCategoryCard
              key={middleCategory.middleCategoryId}
              middleCategory={middleCategory}
            />
          ))
        )}
      </div>
    </section>
  )
}

function MiddleCategoryCard({ middleCategory }) {
  const [isOpen, setIsOpen] = useState(false)

  const lessons = middleCategory.lessons ?? []
  const navigate = useNavigate()

  function handleOpenLesson(event, lesson) {
    event.stopPropagation()

    navigate(`/admin/lessons/${lesson.name}/create`, {
      state: {
        lessonName: lesson.name,
      },
    })
  }

  return (
    <article className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-zinc-50"
      >
        <div>
          <h3 className="font-semibold text-indigo-950">
            Middle Category: {middleCategory.title}
          </h3>

          <p className="mt-1 text-xs text-zinc-500">
            {lessons.length} {lessons.length === 1 ? "lesson" : "lessons"}
          </p>
        </div>

        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-700">
          {isOpen ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </span>
      </button>

      {isOpen && (
        <div className="border-t border-zinc-100 px-5 py-3">
          {lessons.length === 0 ? (
            <p className="py-3 text-sm text-zinc-500">
              No lessons have been added yet.
            </p>
          ) : (
            <div className="space-y-2">
              {lessons.map((lesson, lessonIndex) => (
                <div
                  key={lesson.lessonId ?? lessonIndex}
                  className="group flex items-center justify-between gap-4 rounded-xl bg-zinc-100 px-4 py-3 transition hover:bg-zinc-200"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-zinc-300 bg-white text-xs font-semibold text-zinc-600">
                      {lessonIndex + 1}
                    </span>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-zinc-800">
                        {lesson.name || lesson.title || "Untitled lesson"}
                      </p>

                      <p className="mt-0.5 text-xs text-zinc-500">
                        Lesson {lessonIndex + 1}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(event) => handleOpenLesson(event, lesson)}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-indigo-950 transition hover:bg-white"
                    title="View lesson"
                  >
                    <ArrowUpRight className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </article>
  )
}

export default ViewCertificationAdmin