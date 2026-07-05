import React, { useMemo, useState } from "react"
import { useNavigate, useOutletContext } from "react-router-dom"
import { Award, BarChart3, BookOpen, Brain, CalendarDays, Target, TrendingUp } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  BarChartCard,
  DonutCard,
  LearnerEmptyState,
  LearnerPageHeader,
  LearnerStatCard,
  LineChartCard,
  ProgressBar,
  WeakTopicCard,
} from "@/components/learner/learner-ui.jsx"

export default function LearnerProgressPage() {
  const navigate = useNavigate()
  const { data } = useOutletContext()
  const [selectedCertificationId, setSelectedCertificationId] = useState(
    data.enrolledCertifications[0]?.certificationId
      ? String(data.enrolledCertifications[0].certificationId)
      : ""
  )

  const selectedCertification = data.enrolledCertifications.find(
    (certification) => String(certification.certificationId) === selectedCertificationId
  )

  const lessons = useMemo(() => {
    if (!selectedCertificationId) return data.lessons
    return data.lessons.filter(
      (lesson) => String(lesson.certificationId) === selectedCertificationId
    )
  }, [data.lessons, selectedCertificationId])

  const completed = lessons.filter((lesson) => lesson.completed).length
  const total = lessons.length
  const progress = total ? Math.round((completed / total) * 100) : null
  const certificationWeakAreas = data.weakAreas.filter((area) =>
    lessons.some((lesson) => String(lesson.lessonId) === String(area.lessonId))
  )
  const recentResult = data.recentExamResults[0]

  const recommendations = certificationWeakAreas.length
    ? certificationWeakAreas.slice(0, 3).map((area) => `Review ${area.title}`)
    : lessons.find((lesson) => !lesson.completed)
      ? [`Continue ${lessons.find((lesson) => !lesson.completed).name}`]
      : data.enrolledCertifications.length
        ? ["Review completed lessons to maintain mastery"]
        : ["Enroll in a certification to start learning"]

  return (
    <div className="space-y-7">
      <LearnerPageHeader
        title="My Progress"
        subtitle="Track your learning progress, strengths, and areas to improve."
      >
        <select
          value={selectedCertificationId}
          onChange={(event) => setSelectedCertificationId(event.target.value)}
          className="h-10 rounded-xl border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100"
        >
          {data.enrolledCertifications.length === 0 && (
            <option value="">No enrolled certifications</option>
          )}
          {data.enrolledCertifications.map((certification) => (
            <option
              key={certification.certificationId}
              value={certification.certificationId}
            >
              {certification.title}
            </option>
          ))}
        </select>
      </LearnerPageHeader>

      {data.enrolledCertifications.length === 0 ? (
        <LearnerEmptyState
          icon={BookOpen}
          title="No certification enrollment yet"
          description="Enroll in a certification first to unlock lessons, progress analytics, and personalized recommendations."
          action={
            <Button onClick={() => navigate("/learner/certifications")}>
              Browse Certifications
            </Button>
          }
        />
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <LearnerStatCard
              icon={TrendingUp}
              label="Overall Progress"
              value={progress === null ? "No lessons" : `${progress}%`}
              helper={`${completed} of ${total} lessons completed${selectedCertification ? ` in ${selectedCertification.title}` : ""}`}
            />
            <LearnerStatCard
              icon={Brain}
              label="Topic Mastery"
              value={data.stats.topicMastery === null ? "No data" : `${data.stats.topicMastery}%`}
              helper={
                data.stats.topicMastery === null
                  ? "No mastery data yet"
                  : "Average BKT mastery from available lessons"
              }
            />
            <LearnerStatCard
              icon={Award}
              label="Confidence Level"
              value={
                data.stats.confidenceLevel === null
                  ? "No data"
                  : `${Math.round(data.stats.confidenceLevel)}%`
              }
              helper="Uses learner readiness/confidence data when available"
            />
            <LearnerStatCard
              icon={CalendarDays}
              label="Study Streak"
              value={data.stats.studyStreak === null ? "No activity" : `${data.stats.studyStreak} days`}
              helper="Based on available activity logs"
            />
          </div>

          <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
            <LineChartCard title="Learning Performance" data={data.performancePoints} />
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
              <h2 className="font-semibold text-zinc-950">Topics to Review</h2>
              {certificationWeakAreas.length === 0 ? (
                <LearnerEmptyState
                  icon={Target}
                  title="No review topics yet"
                  description="Weak topics will appear after mastery or assessment data is recorded."
                />
              ) : (
                <div className="mt-4 space-y-3">
                  {certificationWeakAreas.slice(0, 4).map((topic) => (
                    <WeakTopicCard key={topic.lessonId} topic={topic} />
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="grid gap-5 xl:grid-cols-2">
            <BarChartCard title="Weak Areas" data={certificationWeakAreas} />
            <DonutCard title="Recent Mock Exam Results" result={recentResult} />
          </div>

          <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-700">
                <BarChart3 className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-semibold text-zinc-950">Recommended Next Steps</h2>
                <p className="text-sm text-zinc-500">
                  Based on your available progress, mastery, and completion data.
                </p>
              </div>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              {recommendations.map((item) => (
                <div key={item} className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                  <p className="text-sm font-medium text-zinc-900">{item}</p>
                  <div className="mt-3">
                    <ProgressBar value={progress ?? 0} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  )
}
