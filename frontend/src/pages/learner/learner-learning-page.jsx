import React, { useMemo, useState } from "react"
import { useNavigate, useOutletContext, useParams } from "react-router-dom"
import { BookOpen, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  LearnerEmptyState,
  LearnerPageHeader,
  LessonRow,
  ProgressBar,
} from "@/components/learner/learner-ui.jsx"
import { getCertificationModules } from "@/services/learnerService.js"

export default function LearnerLearningPage() {
  const navigate = useNavigate()
  const params = useParams()
  const { data, searchValue } = useOutletContext()
  const [selectedCertificationId, setSelectedCertificationId] = useState(
    params.certificationId ??
      (data.enrolledCertifications[0]?.certificationId
        ? String(data.enrolledCertifications[0].certificationId)
        : "")
  )
  const [localSearch, setLocalSearch] = useState("")

  const query = (localSearch || searchValue).toLowerCase().trim()
  const certification = data.enrolledCertifications.find(
    (item) => String(item.certificationId) === selectedCertificationId
  )

  const lessons = data.lessons.filter(
    (lesson) =>
      (!selectedCertificationId ||
        String(lesson.certificationId) === selectedCertificationId) &&
      (!query ||
        lesson.name?.toLowerCase().includes(query) ||
        lesson.middleCategoryTitle?.toLowerCase().includes(query) ||
        lesson.majorCategoryTitle?.toLowerCase().includes(query))
  )

  const continueLesson = data.lessons.find((lesson) => !lesson.completed) ?? data.lessons[0]
  const completed = lessons.filter((lesson) => lesson.completed).length
  const progress = lessons.length ? Math.round((completed / lessons.length) * 100) : 0

  const modules = useMemo(() => {
    if (!certification) return []
    return getCertificationModules(certification)
  }, [certification])

  return (
    <div className="space-y-7">
      <LearnerPageHeader
        title="My Learning"
        subtitle="Continue lessons, browse modules, and track completion across your enrolled certifications."
      >
        <div className="flex flex-col gap-2 sm:flex-row">
          <select
            value={selectedCertificationId}
            onChange={(event) => setSelectedCertificationId(event.target.value)}
            className="h-10 rounded-xl border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100"
          >
            {data.enrolledCertifications.map((item) => (
              <option key={item.certificationId} value={item.certificationId}>
                {item.title}
              </option>
            ))}
          </select>
        </div>
      </LearnerPageHeader>

      {data.enrolledCertifications.length === 0 ? (
        <LearnerEmptyState
          icon={BookOpen}
          title="No learning content unlocked"
          description="Enroll in a certification to access modules, lessons, and completion tracking."
          action={
            <Button onClick={() => navigate("/learner/certifications")}>
              Browse Certifications
            </Button>
          }
        />
      ) : (
        <>
          <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-zinc-500">Continue Learning</p>
              {continueLesson ? (
                <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-zinc-950">
                      {continueLesson.name}
                    </h2>
                    <p className="mt-1 text-sm text-zinc-500">
                      {continueLesson.certificationTitle} · {continueLesson.middleCategoryTitle}
                    </p>
                  </div>
                  <Button onClick={() => navigate(`/learner/lessons/${continueLesson.lessonId}`)}>
                    {continueLesson.completed ? "Review Lesson" : "Continue"}
                  </Button>
                </div>
              ) : (
                <LearnerEmptyState
                  title="No next lesson"
                  description="Your lessons will appear here once enrollment data is available."
                />
              )}
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-zinc-500">Certification Progress</p>
              <p className="mt-3 text-3xl font-bold text-zinc-950">{progress}%</p>
              <div className="mt-4">
                <ProgressBar value={progress} />
              </div>
              <p className="mt-3 text-xs text-zinc-500">
                {completed} of {lessons.length} visible lessons completed
              </p>
            </div>
          </section>

          <div className="relative max-w-xl">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              value={localSearch}
              onChange={(event) => setLocalSearch(event.target.value)}
              placeholder="Search modules or lessons"
              className="h-11 w-full rounded-xl border border-zinc-200 bg-white pl-10 pr-3 text-sm outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100"
            />
          </div>

          <section className="space-y-4">
            {modules.map((major) => (
              <div key={major.majorCategoryId ?? major.title} className="rounded-2xl border border-zinc-200 bg-white shadow-sm">
                <div className="border-b border-zinc-100 p-5">
                  <h2 className="font-semibold text-zinc-950">{major.title}</h2>
                </div>
                <div className="space-y-4 p-5">
                  {major.middleCategory.map((middle) => {
                    const middleLessons = middle.lessons.filter((lesson) =>
                      lessons.some((visible) => String(visible.lessonId) === String(lesson.lessonId))
                    )
                    if (middleLessons.length === 0) return null
                    return (
                      <div key={middle.middleCategoryId ?? middle.title}>
                        <p className="mb-3 text-sm font-semibold text-zinc-700">
                          {middle.title}
                        </p>
                        <div className="space-y-3">
                          {middleLessons.map((lesson) => {
                            const withProgress =
                              data.lessons.find((item) => String(item.lessonId) === String(lesson.lessonId)) ??
                              lesson
                            return (
                              <LessonRow
                                key={lesson.lessonId}
                                lesson={withProgress}
                                onOpen={() => navigate(`/learner/lessons/${lesson.lessonId}`)}
                              />
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </section>
        </>
      )}
    </div>
  )
}
