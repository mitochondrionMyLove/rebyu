import React, { useEffect, useMemo, useState } from "react"
import { useNavigate, useOutletContext } from "react-router-dom"
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js"
import { Bar, Doughnut, Line } from "react-chartjs-2"
import { BookOpen, Target } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { LearnerEmptyState } from "@/components/learner/learner-ui.jsx"
import LearnerPremiumGuard from "@/components/learner/learner-premium-guard.jsx"
import { FEATURES } from "@/services/subscriptionService.js"

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Tooltip,
    Legend,
    Filler
)

const BAR_COLORS = [
  "#8F9AF6",
  "#B8EFC7",
  "#242424",
  "#A9DEFA",
  "#A9C7E5",
  "#8BD4B4",
]

function toPercent(value) {
  if (value === null || value === undefined || value === "") {
    return null
  }

  const numericValue = Number(value)

  if (!Number.isFinite(numericValue)) {
    return null
  }

  const normalizedValue =
      numericValue >= 0 && numericValue <= 1
          ? numericValue * 100
          : numericValue

  return Math.max(0, Math.min(100, Math.round(normalizedValue)))
}

function getNumber(value, fallback = 0) {
  const parsedValue = Number(value)

  return Number.isFinite(parsedValue) ? parsedValue : fallback
}

function getTopicScore(topic) {
  return (
      toPercent(
          topic.mastery ??
          topic.masteryPercentage ??
          topic.score ??
          topic.percentage ??
          topic.correctRate ??
          topic.value
      ) ?? 0
  )
}

function getTopicTitle(topic, fallback = "Untitled Topic") {
  return (
      topic.title ??
      topic.name ??
      topic.lessonName ??
      topic.topicName ??
      fallback
  )
}

function getTrendText(value) {
  if (value === null || value === undefined || value === "") {
    return null
  }

  const numericValue = Number(value)

  if (!Number.isFinite(numericValue)) {
    return null
  }

  return `${numericValue > 0 ? "+" : ""}${numericValue.toFixed(2)}%`
}

function ProgressStatCard({
                            label,
                            value,
                            trend,
                            backgroundClassName,
                          }) {
  return (
      <article
          className={`min-h-[92px] rounded-[10px] px-4 py-3 ${backgroundClassName}`}
      >
        <div className="flex items-start justify-between gap-3">
          <p className="text-sm font-semibold text-zinc-700">
            {label}
          </p>

          {trend && (
              <span className="text-xs font-medium text-zinc-500">
            {trend} ↗
          </span>
          )}
        </div>

        <p className="mt-3 text-2xl font-semibold leading-none tracking-tight text-zinc-900">
          {value}
        </p>
      </article>
  )
}

function DashboardPanel({ title, children, className = "" }) {
  return (
      <section
          className={`rounded-[10px] border border-[#EEF0F3] bg-[#FBFCFD] px-4 py-4 ${className}`}
      >
        <h2 className="text-sm font-semibold text-zinc-800">
          {title}
        </h2>

        {children}
      </section>
  )
}

function TopicReviewRow({ topic, index }) {
  const title = getTopicTitle(topic, `Topic ${index + 1}`)
  const mastery = getTopicScore(topic)

  return (
      <div>
        <div className="flex items-center justify-between gap-3">
          <p className="truncate text-sm font-medium text-zinc-600">
            {title}
          </p>

          <span className="shrink-0 text-xs font-medium text-zinc-400">
          {mastery}%
        </span>
        </div>

        <div className="mt-2 h-[3px] overflow-hidden rounded-full bg-[#E5E7EB]">
          <div
              className="h-full rounded-full bg-[#252525]"
              style={{
                width: `${mastery}%`,
              }}
          />
        </div>
      </div>
  )
}

function ChartLegend() {
  return (
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[#A8DDF9]" />
          <span className="text-xs text-zinc-500">Quiz</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[#202020]" />
          <span className="text-xs text-zinc-500">Exam</span>
        </div>
      </div>
  )
}

function ContinueLearningSection({ nextLesson, certification }) {
  if (!nextLesson) {
    return (
        <section className="rounded-[10px] border border-[#EEF0F3] bg-[#FBFCFD] px-4 py-4">
          <h2 className="text-sm font-semibold text-zinc-800">
            Continue Learning
          </h2>

          <div className="mt-4 rounded-lg border border-dashed border-zinc-200 bg-white px-4 py-5 text-center">
            <p className="text-sm font-medium text-zinc-700">
              No unfinished lessons available.
            </p>

            <p className="mt-1 text-xs text-zinc-500">
              Complete an assessment or review previous lessons to continue learning.
            </p>
          </div>
        </section>
    )
  }

  const lessonProgress =
      toPercent(
          nextLesson.progress ??
          nextLesson.progressPercentage ??
          nextLesson.completionPercentage
      ) ?? 0

  return (
      <section className="rounded-[10px] border border-[#EEF0F3] bg-[#FBFCFD] px-4 py-4">
        <h2 className="text-sm font-semibold text-zinc-800">
          Continue Learning
        </h2>

        <div className="mt-4 flex flex-col gap-4 rounded-lg bg-white px-4 py-4 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
              {certification?.title ?? "Certification"}
            </p>

            <p className="mt-1 truncate text-base font-semibold text-zinc-800">
              {nextLesson.name ?? nextLesson.title ?? "Untitled Lesson"}
            </p>

            <p className="mt-1 text-sm text-zinc-500">
              Continue studying to improve your topic mastery.
            </p>
          </div>

          <div className="w-full md:w-44">
            <div className="mb-2 flex items-center justify-between">
            <span className="text-xs text-zinc-500">
              Lesson Progress
            </span>

              <span className="text-xs font-semibold text-zinc-700">
              {lessonProgress}%
            </span>
            </div>

            <div className="h-1.5 overflow-hidden rounded-full bg-zinc-100">
              <div
                  className="h-full rounded-full bg-zinc-900"
                  style={{
                    width: `${lessonProgress}%`,
                  }}
              />
            </div>
          </div>
        </div>
      </section>
  )
}

export default function LearnerProgressPage() {
  const navigate = useNavigate()
  const outletContext = useOutletContext()
  const data = outletContext?.data ?? {}

  const publishedCertifications = data.certifications ?? []
  const allLessons = data.lessons ?? []
  const allWeakAreas = data.weakAreas ?? []
  const performancePoints = data.performancePoints ?? []
  const recentExamResults = data.recentExamResults ?? []
  const stats = data.stats ?? {}

  const [selectedCertificationId, setSelectedCertificationId] = useState(
      publishedCertifications[0]?.certificationId
          ? String(publishedCertifications[0].certificationId)
          : ""
  )

  useEffect(() => {
    if (publishedCertifications.length === 0) {
      if (selectedCertificationId) {
        setSelectedCertificationId("")
      }

      return
    }

    const selectedStillExists = publishedCertifications.some(
        (certification) =>
            String(certification.certificationId) === selectedCertificationId
    )

    if (!selectedStillExists) {
      setSelectedCertificationId(
          String(publishedCertifications[0].certificationId)
      )
    }
  }, [publishedCertifications, selectedCertificationId])

  const selectedCertification = useMemo(() => {
    return publishedCertifications.find(
        (certification) =>
            String(certification.certificationId) === selectedCertificationId
    )
  }, [publishedCertifications, selectedCertificationId])

  const lessons = useMemo(() => {
    if (!selectedCertificationId) {
      return allLessons
    }

    return allLessons.filter(
        (lesson) =>
            String(lesson.certificationId) === selectedCertificationId
    )
  }, [allLessons, selectedCertificationId])

  const completedLessons = lessons.filter(
      (lesson) => lesson.completed
  ).length

  const totalLessons = lessons.length

  const overallProgress =
      totalLessons > 0
          ? Math.round((completedLessons / totalLessons) * 100)
          : 0

  const certificationWeakAreas = useMemo(() => {
    return allWeakAreas
        .filter((area) => {
          if (!area.lessonId) {
            return true
          }

          return lessons.some(
              (lesson) =>
                  String(lesson.lessonId) === String(area.lessonId)
          )
        })
        .sort((firstTopic, secondTopic) => {
          return getTopicScore(firstTopic) - getTopicScore(secondTopic)
        })
  }, [allWeakAreas, lessons])

  const nextLesson = useMemo(() => {
    return lessons.find((lesson) => !lesson.completed) ?? null
  }, [lessons])

  const lineChartData = useMemo(() => {
    const labels = performancePoints.map(
        (point, index) =>
            point.label ??
            point.month ??
            point.date ??
            point.name ??
            `Attempt ${index + 1}`
    )

    const quizScores = performancePoints.map((point) => {
      return toPercent(
          point.quiz ??
          point.quizScore ??
          point.quizAverage ??
          point.score ??
          point.value
      )
    })

    const examScores = performancePoints.map((point) => {
      return toPercent(
          point.exam ??
          point.examScore ??
          point.mockExam ??
          point.mockExamScore
      )
    })

    return {
      labels,
      datasets: [
        {
          label: "Quiz",
          data: quizScores,
          borderColor: "#A8DDF9",
          backgroundColor: "rgba(168, 221, 249, 0.16)",
          borderWidth: 2,
          tension: 0.45,
          pointRadius: 0,
          pointHoverRadius: 4,
          pointHoverBackgroundColor: "#A8DDF9",
          fill: false,
        },
        {
          label: "Exam",
          data: examScores,
          borderColor: "#202020",
          backgroundColor: "rgba(32, 32, 32, 0.10)",
          borderWidth: 2,
          borderDash: [5, 4],
          tension: 0.45,
          pointRadius: 0,
          pointHoverRadius: 4,
          pointHoverBackgroundColor: "#202020",
          fill: false,
        },
      ],
    }
  }, [performancePoints])

  const lineChartOptions = useMemo(() => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: "index",
        intersect: false,
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor: "#27272A",
          titleColor: "#FFFFFF",
          bodyColor: "#F4F4F5",
          padding: 10,
          cornerRadius: 7,
          displayColors: true,
          callbacks: {
            label(context) {
              return `${context.dataset.label}: ${Math.round(
                  context.parsed.y
              )}%`
            },
          },
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
          border: {
            display: false,
          },
          ticks: {
            color: "#A1A1AA",
            font: {
              size: 11,
            },
          },
        },
        y: {
          min: 0,
          max: 100,
          border: {
            display: false,
          },
          grid: {
            color: "#EEF0F3",
            borderDash: [3, 3],
          },
          ticks: {
            color: "#A1A1AA",
            font: {
              size: 11,
            },
            stepSize: 20,
            callback(value) {
              return `${value}%`
            },
          },
        },
      },
    }
  }, [])

  const barChartData = useMemo(() => {
    const chartTopics = certificationWeakAreas.slice(0, 6)

    return {
      labels: chartTopics.map((topic, index) => {
        const title = getTopicTitle(topic, `Topic ${index + 1}`)

        return title.length > 8
            ? `${title.slice(0, 7)}…`
            : title
      }),
      datasets: [
        {
          data: chartTopics.map((topic) => getTopicScore(topic)),
          backgroundColor: chartTopics.map(
              (_, index) => BAR_COLORS[index % BAR_COLORS.length]
          ),
          borderRadius: 3,
          borderSkipped: false,
          maxBarThickness: 18,
        },
      ],
    }
  }, [certificationWeakAreas])

  const barChartOptions = useMemo(() => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor: "#27272A",
          titleColor: "#FFFFFF",
          bodyColor: "#F4F4F5",
          padding: 10,
          cornerRadius: 7,
          callbacks: {
            label(context) {
              return `Mastery: ${Math.round(context.parsed.y)}%`
            },
          },
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
          border: {
            display: false,
          },
          ticks: {
            color: "#A1A1AA",
            font: {
              size: 10,
            },
          },
        },
        y: {
          min: 0,
          max: 100,
          border: {
            display: false,
          },
          grid: {
            color: "#EEF0F3",
            borderDash: [3, 3],
          },
          ticks: {
            color: "#A1A1AA",
            font: {
              size: 10,
            },
            stepSize: 20,
            callback(value) {
              return `${value}%`
            },
          },
        },
      },
    }
  }, [])

  const recentExamResult = recentExamResults[0]

  const mockExamSegments = useMemo(() => {
    const breakdown =
        recentExamResult?.topicBreakdown ??
        recentExamResult?.categoryBreakdown ??
        recentExamResult?.breakdown ??
        recentExamResult?.categories ??
        recentExamResult?.results

    if (Array.isArray(breakdown) && breakdown.length > 0) {
      return breakdown.slice(0, 4).map((item, index) => ({
        label:
            item.name ??
            item.title ??
            item.topic ??
            `Category ${index + 1}`,
        value:
            toPercent(
                item.score ??
                item.percentage ??
                item.value ??
                item.correctRate
            ) ?? 0,
        color: BAR_COLORS[index % BAR_COLORS.length],
      }))
    }

    const latestMockScore = toPercent(
        recentExamResult?.score ??
        recentExamResult?.percentage ??
        recentExamResult?.resultPercentage
    )

    if (latestMockScore !== null) {
      return [
        {
          label: "Correct Answers",
          value: latestMockScore,
          color: "#A9DEFA",
        },
        {
          label: "Incorrect Answers",
          value: Math.max(0, 100 - latestMockScore),
          color: "#242424",
        },
      ]
    }

    return []
  }, [recentExamResult])

  const doughnutChartData = useMemo(() => {
    return {
      labels: mockExamSegments.map((segment) => segment.label),
      datasets: [
        {
          data: mockExamSegments.map((segment) => segment.value),
          backgroundColor: mockExamSegments.map(
              (segment) => segment.color
          ),
          borderWidth: 0,
          spacing: 3,
          hoverOffset: 3,
        },
      ],
    }
  }, [mockExamSegments])

  const doughnutChartOptions = useMemo(() => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "70%",
      rotation: -90,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor: "#27272A",
          titleColor: "#FFFFFF",
          bodyColor: "#F4F4F5",
          padding: 10,
          cornerRadius: 7,
          callbacks: {
            label(context) {
              return `${context.label}: ${Math.round(context.parsed)}%`
            },
          },
        },
      },
    }
  }, [])

  const topicMastery = toPercent(stats.topicMastery)
  const confidenceLevel = toPercent(stats.confidenceLevel)
  const studyStreak = getNumber(stats.studyStreak, 0)

  return (
      <LearnerPremiumGuard
          feature={FEATURES.PROGRESS_ANALYTICS}
          title="Progress analytics require REBYU Pro"
          description="Upgrade to REBYU Pro to view detailed learning progress, performance trends, mastery, and weak areas."
          benefits={[
            "Certification progress tracking",
            "Quiz and exam performance trends",
            "Topic mastery and weak-area insights",
          ]}
          returnTo="/learner/learning"
      >
        <div className="space-y-6 font-sans">
        <div className="flex items-center">
          <Select
              value={selectedCertificationId}
              onValueChange={setSelectedCertificationId}
              disabled={publishedCertifications.length === 0}
          >
            <SelectTrigger className="h-8 w-auto min-w-[190px] border-0 bg-transparent px-0 pr-2 text-sm font-semibold uppercase text-zinc-700 shadow-none focus:ring-0 focus:ring-offset-0">
              <SelectValue placeholder="Select certification" />
            </SelectTrigger>

            <SelectContent align="start">
              {publishedCertifications.map((certification) => (
                  <SelectItem
                      key={certification.certificationId}
                      value={String(certification.certificationId)}
                      className="text-sm"
                  >
                    {certification.title}
                  </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {publishedCertifications.length === 0 ? (
            <LearnerEmptyState
                icon={BookOpen}
                title="No published certifications yet"
                description="Published certifications will appear here with your learning analytics and assessment progress."
                action={
                  <Button onClick={() => navigate("/learner/learning")}>
                    Go to My Learning
                  </Button>
                }
            />
        ) : (
            <>
              <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <ProgressStatCard
                    label="Overall Progress"
                    value={`${overallProgress}%`}
                    trend={getTrendText(
                        stats.overallProgressChange ?? stats.progressChange
                    )}
                    backgroundClassName="bg-[#E2F5FF]"
                />

                <ProgressStatCard
                    label="Topic Mastery"
                    value={
                      topicMastery === null
                          ? "—"
                          : `${topicMastery}%`
                    }
                    trend={getTrendText(
                        stats.topicMasteryChange ?? stats.masteryChange
                    )}
                    backgroundClassName="bg-[#E8EFF9]"
                />

                <ProgressStatCard
                    label="Confidence Level"
                    value={
                      confidenceLevel === null
                          ? "—"
                          : `${confidenceLevel}%`
                    }
                    trend={getTrendText(
                        stats.confidenceLevelChange ?? stats.confidenceChange
                    )}
                    backgroundClassName="bg-[#E2F5FF]"
                />

                <ProgressStatCard
                    label="Study Streak"
                    value={`${studyStreak} days`}
                    trend={getTrendText(
                        stats.studyStreakChange ?? stats.streakChange
                    )}
                    backgroundClassName="bg-[#E8EFF9]"
                />
              </section>

              <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_250px]">
                <DashboardPanel title="Learning Performance">
                  <div className="mt-1 flex items-center justify-end">
                    <ChartLegend />
                  </div>

                  <div className="mt-1 h-[215px]">
                    {performancePoints.length === 0 ? (
                        <div className="flex h-full flex-col items-center justify-center">
                          <Target className="h-7 w-7 text-zinc-300" />

                          <p className="mt-3 text-sm font-medium text-zinc-600">
                            No performance data yet
                          </p>

                          <p className="mt-1 text-xs text-zinc-400">
                            Complete quizzes or mock exams to see your progress.
                          </p>
                        </div>
                    ) : (
                        <Line
                            data={lineChartData}
                            options={lineChartOptions}
                        />
                    )}
                  </div>
                </DashboardPanel>

                <DashboardPanel title="Topics to Review">
                  {certificationWeakAreas.length === 0 ? (
                      <div className="flex min-h-[215px] flex-col items-center justify-center text-center">
                        <Target className="h-6 w-6 text-zinc-300" />

                        <p className="mt-3 text-sm font-medium text-zinc-600">
                          No review topics yet
                        </p>

                        <p className="mt-1 text-xs leading-4 text-zinc-400">
                          Complete assessments to identify weak areas.
                        </p>
                      </div>
                  ) : (
                      <div className="mt-5 space-y-4">
                        {certificationWeakAreas.slice(0, 6).map((topic, index) => (
                            <TopicReviewRow
                                key={
                                    topic.lessonId ??
                                    topic.topicId ??
                                    topic.id ??
                                    `${getTopicTitle(topic)}-${index}`
                                }
                                topic={topic}
                                index={index}
                            />
                        ))}
                      </div>
                  )}
                </DashboardPanel>
              </section>

              <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(310px,0.78fr)]">
                <DashboardPanel title="Weak Areas">
                  <div className="mt-4 h-[195px]">
                    {certificationWeakAreas.length === 0 ? (
                        <div className="flex h-full flex-col items-center justify-center">
                          <p className="text-sm font-medium text-zinc-600">
                            No weak-area data yet
                          </p>

                          <p className="mt-1 text-xs text-zinc-400">
                            Assessment results will appear here.
                          </p>
                        </div>
                    ) : (
                        <Bar
                            data={barChartData}
                            options={barChartOptions}
                        />
                    )}
                  </div>
                </DashboardPanel>

                <DashboardPanel title="Recent Mock Exam Results">
                  {mockExamSegments.length === 0 ? (
                      <div className="flex h-[195px] flex-col items-center justify-center">
                        <p className="text-sm font-medium text-zinc-600">
                          No mock exam result yet
                        </p>

                        <p className="mt-1 text-xs text-zinc-400">
                          Take a mock exam to view your category results.
                        </p>
                      </div>
                  ) : (
                      <div className="mt-2 grid min-h-[195px] items-center gap-3 sm:grid-cols-[115px_minmax(0,1fr)]">
                        <div className="h-[120px]">
                          <Doughnut
                              data={doughnutChartData}
                              options={doughnutChartOptions}
                          />
                        </div>

                        <div className="space-y-2.5">
                          {mockExamSegments.map((segment) => (
                              <div
                                  key={segment.label}
                                  className="flex items-center justify-between gap-3"
                              >
                                <div className="flex min-w-0 items-center gap-1.5">
                          <span
                              className="h-1.5 w-1.5 shrink-0 rounded-full"
                              style={{
                                backgroundColor: segment.color,
                              }}
                          />

                                  <span className="truncate text-xs text-zinc-600">
                            {segment.label}
                          </span>
                                </div>

                                <span className="shrink-0 text-xs font-semibold text-zinc-700">
                          {segment.value}%
                        </span>
                              </div>
                          ))}
                        </div>
                      </div>
                  )}
                </DashboardPanel>
              </section>

              <ContinueLearningSection
                  nextLesson={nextLesson}
                  certification={selectedCertification}
              />
            </>
        )}
        </div>
      </LearnerPremiumGuard>
  )
}
