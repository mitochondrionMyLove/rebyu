import React from "react"
import { useNavigate, useOutletContext, useParams } from "react-router-dom"
import { ArrowLeft, BookOpen, Layers3 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  LearnerEmptyState,
  ProgressBar,
} from "@/components/learner/learner-ui.jsx"
import { getFileViewUrl } from "@/services/fileService.js"
import { getCertificationModules } from "@/services/learnerService.js"
import CertificationAssessmentsSection from "@/components/assessments/certification-assessments-section.jsx"

const DEFAULT_IMAGE = "https://www.eclosio.ong/wp-content/uploads/2018/08/default.png"

export default function LearnerCertificationDetailPage() {
  const navigate = useNavigate()
  const { certificationId } = useParams()
  const { data } = useOutletContext()

  const certification = data.certifications.find(
    (item) => String(item.certificationId) === String(certificationId)
  )

  if (!certification) {
    return (
      <LearnerEmptyState
        title="Certification not found"
        description="The requested certification is not available from the backend."
        action={<Button onClick={() => navigate("/learner/certifications")}>Back to Certifications</Button>}
      />
    )
  }

  const enrolled = data.enrolledCertifications.some(
    (item) => String(item.certificationId) === String(certificationId)
  )
  const modules = getCertificationModules(certification)
  const lessons = data.lessons.filter((lesson) => String(lesson.certificationId) === String(certificationId))
  const allLessons = modules.flatMap((major) =>
    major.middleCategory.flatMap((middle) => middle.lessons)
  )
  const completed = lessons.filter((lesson) => lesson.completed).length
  const progress = lessons.length ? Math.round((completed / lessons.length) * 100) : 0
  const imageUrl = certification.imageKey ? getFileViewUrl(certification.imageKey) : DEFAULT_IMAGE

  return (
    <div className="space-y-7">
      <Button variant="ghost" className="gap-2" onClick={() => navigate(-1)}>
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>

      <section className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
        <div className="grid lg:grid-cols-[420px_minmax(0,1fr)]">
          <img src={imageUrl} alt={certification.title} className="h-72 w-full object-cover lg:h-full" />
          <div className="p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-400">
              {certification.industry || "Certification"}
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-zinc-950">
              {certification.title}
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-zinc-600">
              {certification.description || "No description available."}
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-zinc-50 p-4">
                <Layers3 className="h-5 w-5 text-zinc-500" />
                <p className="mt-3 text-2xl font-bold text-zinc-950">{modules.length}</p>
                <p className="text-xs text-zinc-500">Major modules</p>
              </div>
              <div className="rounded-2xl bg-zinc-50 p-4">
                <BookOpen className="h-5 w-5 text-zinc-500" />
                <p className="mt-3 text-2xl font-bold text-zinc-950">{allLessons.length}</p>
                <p className="text-xs text-zinc-500">Lessons</p>
              </div>
              <div className="rounded-2xl bg-zinc-50 p-4">
                <p className="text-2xl font-bold text-zinc-950">{enrolled ? `${progress}%` : "Open"}</p>
                <p className="mt-3 text-xs text-zinc-500">
                  {enrolled ? "Learner progress" : "Available to view"}
                </p>
              </div>
            </div>

            {enrolled && (
              <div className="mt-6">
                <ProgressBar value={progress} />
                <p className="mt-2 text-xs text-zinc-500">
                  {completed} of {lessons.length} enrolled lessons completed
                </p>
              </div>
            )}

            <div className="mt-6 flex flex-wrap gap-2">
              {enrolled ? (
                <Button onClick={() => navigate(`/learner/learning/${certificationId}`)}>
                  Continue Learning
                </Button>
              ) : (
                <Button variant="outline" disabled>
                  Enrollment action unavailable
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      <CertificationAssessmentsSection
        certificationId={certificationId}
        learnerId={data.learnerId ?? null}
        enrolled={enrolled}
      />

      <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-zinc-950">Curriculum</h2>
        <div className="mt-5 space-y-4">
          {modules.map((major) => (
            <div key={major.majorCategoryId ?? major.title} className="rounded-2xl border border-zinc-200">
              <div className="border-b border-zinc-100 bg-zinc-50 px-4 py-3">
                <p className="font-medium text-zinc-950">{major.title}</p>
              </div>
              <div className="space-y-4 p-4">
                {major.middleCategory.map((middle) => (
                  <div key={middle.middleCategoryId ?? middle.title}>
                    <p className="text-sm font-semibold text-zinc-700">{middle.title}</p>
                    <div className="mt-2 divide-y divide-zinc-100 rounded-xl border border-zinc-100">
                      {middle.lessons.map((lesson) => {
                        const unlocked = enrolled
                        const complete = data.completedLessons.some(
                          (item) => String(item.lessonId) === String(lesson.lessonId)
                        )
                        return (
                          <button
                            key={lesson.lessonId}
                            type="button"
                            disabled={!unlocked}
                            onClick={() => navigate(`/learner/lessons/${lesson.lessonId}`)}
                            className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left text-sm transition enabled:hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            <span className="font-medium text-zinc-800">{lesson.name}</span>
                            <span className="text-xs text-zinc-500">
                              {complete ? "Completed" : unlocked ? "Unlocked" : "Locked"}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
