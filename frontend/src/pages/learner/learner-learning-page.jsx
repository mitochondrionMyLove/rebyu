import { useMemo, useState } from "react"
import { useNavigate, useOutletContext } from "react-router-dom"
import {
  Award,
  BookOpen,
  CheckCircle2,
  CirclePlay,
  Grid2X2,
  List,
  Search,
  Trophy,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  LearnerEmptyState,
  ProgressBar,
} from "@/components/learner/learner-ui.jsx"

function getCertificationTitle(certification) {
  return certification?.title ?? "Untitled Certification"
}

function getCertificationDescription(certification) {
  return (
      certification?.description ??
      "Continue learning and prepare for your certification assessment."
  )
}

function getCertificationImage(certification) {
  return (
      certification?.imageUrl ??
      certification?.thumbnailUrl ??
      certification?.coverUrl ??
      null
  )
}

function getAchievementTitle(achievement) {
  return (
      achievement?.title ??
      achievement?.achievementTitle ??
      achievement?.name ??
      "Achievement"
  )
}

function getAchievementDescription(achievement) {
  return (
      achievement?.description ??
      achievement?.achievementDescription ??
      achievement?.earnedAt ??
      "Keep learning to unlock more achievements."
  )
}

function getAchievementIcon(achievement) {
  return (
      achievement?.iconUrl ??
      achievement?.imageUrl ??
      achievement?.badgeUrl ??
      null
  )
}

function getCourseStatus(progress, completedLessons) {
  if (progress >= 100) {
    return "COMPLETED"
  }

  if (completedLessons > 0) {
    return "IN PROGRESS"
  }

  return "READY TO START"
}

function CourseCard({ course, onOpen }) {
  const {
    certification,
    progress,
    totalLessons,
    completedLessons,
    nextLesson,
  } = course

  const imageUrl = getCertificationImage(certification)
  const status = getCourseStatus(progress, completedLessons)

  return (
      <article className="group overflow-hidden border border-border bg-card transition hover:border-primary/40 hover:shadow-md">
        <div className="relative h-40 overflow-hidden bg-muted">
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/15 via-primary/5 to-muted">
            <BookOpen className="size-12 text-primary/45" />
          </div>

          {imageUrl ? (
              <img
                  src={imageUrl}
                  alt={getCertificationTitle(certification)}
                  className="absolute inset-0 h-full w-full object-cover"
                  onError={(event) => {
                    event.currentTarget.style.display = "none"
                  }}
              />
          ) : null}

          <span className="absolute left-3 top-3 rounded-sm bg-primary px-2 py-1 text-[10px] font-semibold tracking-wide text-primary-foreground">
          {status}
        </span>

          <div className="absolute inset-0 flex items-center justify-center bg-black/10 opacity-0 transition group-hover:opacity-100">
            <div className="flex size-12 items-center justify-center rounded-full border-2 border-white bg-black/20 text-white backdrop-blur-sm">
              <CirclePlay className="size-7" />
            </div>
          </div>
        </div>

        <div className="p-4">
          <p className="text-xs font-medium text-muted-foreground">
            REBYU Certification Review
          </p>

          <h2 className="mt-2 min-h-[48px] text-base font-semibold leading-6 text-foreground">
            {getCertificationTitle(certification)}
          </h2>

          <p className="mt-2 min-h-[42px] text-sm leading-5 text-muted-foreground">
            {getCertificationDescription(certification)}
          </p>

          <div className="mt-4">
            <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {completedLessons} of {totalLessons} lessons
            </span>

              <span className="font-medium text-foreground">
              {progress}%
            </span>
            </div>

            <ProgressBar value={progress} />
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
            <p className="truncate text-xs text-muted-foreground">
              {nextLesson
                  ? `Next: ${nextLesson.name ?? nextLesson.title}`
                  : progress >= 100
                      ? "Course completed"
                      : "Start learning"}
            </p>

            <Button
                size="sm"
                variant="ghost"
                className="shrink-0 text-primary hover:text-primary"
                onClick={onOpen}
            >
              {progress >= 100 ? "Review" : "Continue"}
            </Button>
          </div>
        </div>
      </article>
  )
}

function AchievementItem({ achievement }) {
  const iconUrl = getAchievementIcon(achievement)

  return (
      <div className="flex gap-3 border-b border-border py-4 last:border-b-0">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-md border bg-muted">
          {iconUrl ? (
              <img
                  src={iconUrl}
                  alt=""
                  className="size-full rounded-md object-cover"
                  onError={(event) => {
                    event.currentTarget.style.display = "none"
                  }}
              />
          ) : (
              <Award className="size-5 text-primary" />
          )}
        </div>

        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground">
            {getAchievementTitle(achievement)}
          </p>

          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            {getAchievementDescription(achievement)}
          </p>
        </div>
      </div>
  )
}

export default function LearnerLearningPage() {
  const navigate = useNavigate()
  const { data, searchValue } = useOutletContext()

  const enrolledCertifications = data?.enrolledCertifications ?? []
  const allLessons = data?.lessons ?? []

  const achievements = Array.isArray(data?.latestAchievements)
      ? data.latestAchievements
      : Array.isArray(data?.achievements)
          ? data.achievements
          : []

  const [localSearch, setLocalSearch] = useState("")
  const [selectedIndustry, setSelectedIndustry] = useState("ALL")
  const [selectedStatus, setSelectedStatus] = useState("ALL")
  const [viewMode, setViewMode] = useState("GRID")

  const query = (localSearch || searchValue || "").trim().toLowerCase()

  const industries = useMemo(() => {
    return [
      ...new Set(
          enrolledCertifications
              .map((certification) => certification.industry)
              .filter(Boolean)
      ),
    ]
  }, [enrolledCertifications])

  const courses = useMemo(() => {
    return enrolledCertifications.map((certification) => {
      const lessons = allLessons.filter(
          (lesson) =>
              String(lesson.certificationId) ===
              String(certification.certificationId)
      )

      const completedLessons = lessons.filter((lesson) => lesson.completed).length
      const totalLessons = lessons.length

      const progress =
          totalLessons > 0
              ? Math.round((completedLessons / totalLessons) * 100)
              : 0

      const nextLesson =
          lessons.find((lesson) => !lesson.completed) ?? lessons[0] ?? null

      return {
        certification,
        lessons,
        completedLessons,
        totalLessons,
        progress,
        nextLesson,
        status: getCourseStatus(progress, completedLessons),
      }
    })
  }, [allLessons, enrolledCertifications])

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const certification = course.certification

      const matchesSearch =
          !query ||
          getCertificationTitle(certification).toLowerCase().includes(query) ||
          getCertificationDescription(certification).toLowerCase().includes(query) ||
          certification.industry?.toLowerCase().includes(query)

      const matchesIndustry =
          selectedIndustry === "ALL" ||
          certification.industry === selectedIndustry

      const matchesStatus =
          selectedStatus === "ALL" || course.status === selectedStatus

      return matchesSearch && matchesIndustry && matchesStatus
    })
  }, [courses, query, selectedIndustry, selectedStatus])

  function openCertification(course) {
    if (course.nextLesson?.lessonId) {
      navigate(`/learner/lessons/${course.nextLesson.lessonId}`)
      return
    }

    navigate(`/learner/certifications/${course.certification.certificationId}`)
  }

  return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <BookOpen className="size-7 text-foreground" />

          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              My Learning
            </h1>

            <p className="mt-0.5 text-sm text-muted-foreground">
              Continue your enrolled certification reviews.
            </p>
          </div>
        </div>

        {enrolledCertifications.length === 0 ? (
            <LearnerEmptyState
                icon={BookOpen}
                title="No certification enrollment yet"
                description="Enroll in a certification to start learning and track your progress."
                action={
                  <Button onClick={() => navigate("/learner/certifications")}>
                    Browse Certifications
                  </Button>
                }
            />
        ) : (
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_280px]">
              <main className="min-w-0">
                <div className="mb-4">
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground">
                    In Progress
                  </h2>
                </div>

                <div className="mb-5 flex flex-col gap-3 border-b border-border pb-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="relative w-full lg:max-w-sm">
                    <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                    <input
                        value={localSearch}
                        onChange={(event) => setLocalSearch(event.target.value)}
                        placeholder="Search courses, training"
                        className="h-10 w-full border border-input bg-background pl-10 pr-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/15"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <select
                        value={selectedIndustry}
                        onChange={(event) => setSelectedIndustry(event.target.value)}
                        className="h-10 min-w-[130px] border border-input bg-background px-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                    >
                      <option value="ALL">All Industries</option>

                      {industries.map((industry) => (
                          <option key={industry} value={industry}>
                            {industry}
                          </option>
                      ))}
                    </select>

                    <select
                        value={selectedStatus}
                        onChange={(event) => setSelectedStatus(event.target.value)}
                        className="h-10 min-w-[130px] border border-input bg-background px-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                    >
                      <option value="ALL">All Types</option>
                      <option value="IN PROGRESS">In Progress</option>
                      <option value="READY TO START">Ready to Start</option>
                      <option value="COMPLETED">Completed</option>
                    </select>

                    <div className="flex overflow-hidden border border-input">
                      <button
                          type="button"
                          onClick={() => setViewMode("GRID")}
                          className={`flex size-10 items-center justify-center transition ${
                              viewMode === "GRID"
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-background text-muted-foreground hover:bg-muted"
                          }`}
                          aria-label="Grid view"
                      >
                        <Grid2X2 className="size-4" />
                      </button>

                      <button
                          type="button"
                          onClick={() => setViewMode("LIST")}
                          className={`flex size-10 items-center justify-center border-l border-input transition ${
                              viewMode === "LIST"
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-background text-muted-foreground hover:bg-muted"
                          }`}
                          aria-label="List view"
                      >
                        <List className="size-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {filteredCourses.length === 0 ? (
                    <div className="border border-dashed border-border py-14 text-center">
                      <Search className="mx-auto size-7 text-muted-foreground" />

                      <p className="mt-3 text-sm font-medium text-foreground">
                        No certifications found
                      </p>

                      <p className="mt-1 text-sm text-muted-foreground">
                        Try another keyword or change your filters.
                      </p>

                      <Button
                          variant="outline"
                          size="sm"
                          className="mt-4"
                          onClick={() => {
                            setLocalSearch("")
                            setSelectedIndustry("ALL")
                            setSelectedStatus("ALL")
                          }}
                      >
                        Clear Filters
                      </Button>
                    </div>
                ) : (
                    <div
                        className={
                          viewMode === "GRID"
                              ? "grid gap-4 sm:grid-cols-2 2xl:grid-cols-3"
                              : "grid gap-4"
                        }
                    >
                      {filteredCourses.map((course) => (
                          <CourseCard
                              key={course.certification.certificationId}
                              course={course}
                              onOpen={() => openCertification(course)}
                          />
                      ))}
                    </div>
                )}
              </main>

              <aside className="border-t border-border pt-5 xl:border-l xl:border-t-0 xl:pl-6 xl:pt-0">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-foreground">
                    Latest Achievements
                  </h2>

                  <Button
                      variant="link"
                      size="sm"
                      className="h-auto p-0 text-xs"
                      onClick={() => navigate("/learner/profile")}
                  >
                    Show all
                  </Button>
                </div>

                {achievements.length > 0 ? (
                    <div className="mt-3">
                      {achievements.slice(0, 5).map((achievement, index) => (
                          <AchievementItem
                              key={
                                  achievement.achievementId ??
                                  achievement.id ??
                                  `${getAchievementTitle(achievement)}-${index}`
                              }
                              achievement={achievement}
                          />
                      ))}
                    </div>
                ) : (
                    <div className="mt-4 border border-dashed border-border p-4 text-center">
                      <Trophy className="mx-auto size-6 text-muted-foreground" />

                      <p className="mt-2 text-sm font-medium text-foreground">
                        No achievements yet
                      </p>

                      <p className="mt-1 text-xs leading-5 text-muted-foreground">
                        Complete lessons, quizzes, and exams to earn achievements.
                      </p>
                    </div>
                )}

                <div className="mt-6 border-t border-border pt-5">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-primary" />

                    <p className="text-sm font-semibold text-foreground">
                      Keep your progress moving
                    </p>
                  </div>

                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Continue your unfinished lessons to unlock quizzes, exams, and
                    readiness insights.
                  </p>
                </div>
              </aside>
            </div>
        )}
      </div>
  )
}