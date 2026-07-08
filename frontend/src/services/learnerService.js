import { API, base } from "./base.js"
import { getFileViewUrl } from "./fileService.js"

export function getCurrentLearnerIdentity() {
  const read = (...keys) => {
    for (const key of keys) {
      const value = localStorage.getItem(key)
      if (value !== null && value !== undefined && value !== "") {
        return value
      }
    }
    return null
  }

  const learnerId = Number(read("learnerId", "learner_id"))
  const userId = Number(read("userId", "user_id"))

  return {
    learnerId: Number.isFinite(learnerId) ? learnerId : null,
    userId: Number.isFinite(userId) ? userId : null,
    role: read("role") ?? "",
    name: read("name", "fullName", "username") ?? "",
    email: read("email") ?? "",
  }
}

export function getFileDownloadUrl(key) {
  return `${API}/files/download?key=${encodeURIComponent(key)}`
}

export function getAllLearners() {
  return base("learners")
}

export function getAllUsers() {
  return base("users")
}

export function updateLearner(id, data) {
  return base(`learners/${id}`, {
    method: "PUT",
    data,
  })
}

export function updateUser(id, data) {
  return base(`users/${id}`, {
    method: "PUT",
    data,
  })
}

export function getAllLearnerCertifications() {
  return base("learner-certifications")
}

export function getAllCompletedLessons() {
  return base("learner-completed-lessons")
}

export function markLessonComplete(data) {
  return base("learner-completed-lessons", {
    method: "POST",
    data,
  })
}

export function getAllLessonMastery() {
  return base("learner-lesson-mastery")
}

export function getAllWeakAreas() {
  return base("weak-areas")
}

export function getAllActivityLogs() {
  return base("activity-logs")
}

export function getAllExams() {
  return base("exams")
}

export function getAllExamResults() {
  return base("exam-results")
}

export function getLessonById(id) {
  return base(`lessons/${id}`)
}

function asArray(value) {
  return Array.isArray(value) ? value : []
}

function getCertificationLessons(certification) {
  return asArray(certification?.majorCategory).flatMap((major) =>
    asArray(major.middleCategory).flatMap((middle) =>
      asArray(middle.lessons).map((lesson) => ({
        ...lesson,
        certificationId: certification.certificationId,
        certificationTitle: certification.title,
        majorCategoryId: major.majorCategoryId,
        majorCategoryTitle: major.title,
        middleCategoryId: middle.middleCategoryId,
        middleCategoryTitle: middle.title,
      }))
    )
  )
}

export function flattenCertificationLessons(certifications = []) {
  return certifications.flatMap(getCertificationLessons)
}

export function getCertificationModules(certification) {
  return asArray(certification?.majorCategory).map((major) => ({
    ...major,
    middleCategory: asArray(major.middleCategory).map((middle) => ({
      ...middle,
      lessons: asArray(middle.lessons).map((lesson) => ({
        ...lesson,
        certificationId: certification.certificationId,
        certificationTitle: certification.title,
        majorCategoryId: major.majorCategoryId,
        majorCategoryTitle: major.title,
        middleCategoryId: middle.middleCategoryId,
        middleCategoryTitle: middle.title,
      })),
    })),
  }))
}

function isSameId(a, b) {
  return String(a ?? "") === String(b ?? "")
}

function uniqueBy(items, keyFn) {
  const map = new Map()
  for (const item of items) {
    const key = keyFn(item)
    if (key !== null && key !== undefined && !map.has(key)) {
      map.set(key, item)
    }
  }
  return [...map.values()]
}

function completionKey(item) {
  return `${item.learnerId}:${item.lessonId}`
}

function getScoreNumber(value) {
  const number = Number(value)
  return Number.isFinite(number) ? number : null
}

function computeStudyStreak(activityLogs) {
  const days = new Set(
    activityLogs
      .map((log) => log.dateTime)
      .filter(Boolean)
      .map((date) => new Date(date).toISOString().slice(0, 10))
  )

  if (days.size === 0) {
    return null
  }

  let streak = 0
  const cursor = new Date()
  cursor.setHours(0, 0, 0, 0)

  while (days.has(cursor.toISOString().slice(0, 10))) {
    streak += 1
    cursor.setDate(cursor.getDate() - 1)
  }

  return streak
}

export async function getLearnerPortalData() {
  const identity = getCurrentLearnerIdentity()

  const [
    learners,
    users,
    certifications,
    learnerCertifications,
    completedLessons,
    mastery,
    weakAreas,
    activityLogs,
    exams,
    examResults,
    orgCertLearners,
    orgCertificates,
  ] = await Promise.all([
    getAllLearners(),
    getAllUsers(),
    base("certifications"),
    getAllLearnerCertifications(),
    getAllCompletedLessons(),
    getAllLessonMastery(),
    getAllWeakAreas(),
    getAllActivityLogs(),
    getAllExams(),
    getAllExamResults(),
    // Enterprise-assigned enrollments (created when a learner accepts an
    // organization invitation) plus the org allocations that map an
    // orgCertId to a certificationId.
    base("organization-certification-learners").catch(() => []),
    base("organization-certificates").catch(() => []),
  ])

  const learner =
    asArray(learners).find((item) => isSameId(item.learnerId, identity.learnerId)) ??
    asArray(learners).find((item) => isSameId(item.userId, identity.userId)) ??
    null

  const learnerId = learner?.learnerId ?? identity.learnerId
  const userId = learner?.userId ?? identity.userId
  const user =
    asArray(users).find((item) => isSameId(item.userId, userId)) ?? null

  const purchaseEnrollments = asArray(learnerCertifications).filter((item) =>
    isSameId(item.learnerId, learnerId)
  )

  // Enterprise-assigned access: map this learner's active
  // organization_certification_learners rows to their certificationId via the
  // organization_certificates allocation, then treat them as enrollments.
  const orgCertIdToCertificationId = new Map(
    asArray(orgCertificates).map((orgCert) => [
      String(orgCert.orgCertId),
      orgCert.certificationId,
    ])
  )
  const enterpriseEnrollments = asArray(orgCertLearners)
    .filter(
      (item) =>
        isSameId(item.learnerId, learnerId) && item.status === "active"
    )
    .map((item) => ({
      certificationId: orgCertIdToCertificationId.get(String(item.orgCertId)),
      learnerId,
      status: "active",
      source: "enterprise",
      assignedAt: item.assignedAt,
    }))
    .filter((item) => item.certificationId != null)

  const enrollments = [...purchaseEnrollments, ...enterpriseEnrollments]

  const enrolledCertificationIds = new Set(
    enrollments.map((item) => String(item.certificationId))
  )

  const enrolledCertifications = asArray(certifications).filter((certification) =>
    enrolledCertificationIds.has(String(certification.certificationId))
  )

  const lessonList = flattenCertificationLessons(enrolledCertifications)
  const allLessons = flattenCertificationLessons(asArray(certifications))

  const completedForLearner = asArray(completedLessons).filter((item) =>
    isSameId(item.learnerId, learnerId)
  )
  const completedSet = new Set(completedForLearner.map(completionKey))

  const masteryForLearner = asArray(mastery).filter((item) =>
    isSameId(item.learnerId, learnerId)
  )

  const weakAreasForLearner = asArray(weakAreas).filter((item) =>
    isSameId(item.learnerId, learnerId)
  )

  const activityLogsForUser = asArray(activityLogs).filter((item) =>
    isSameId(item.userId, userId)
  )

  const examResultsForLearner = asArray(examResults).filter((item) =>
    isSameId(item.learnerId, learnerId)
  )

  const examById = new Map(asArray(exams).map((exam) => [String(exam.examId), exam]))
  const lessonById = new Map(allLessons.map((lesson) => [String(lesson.lessonId), lesson]))

  const lessonsWithProgress = lessonList.map((lesson) => {
    const complete = completedSet.has(`${learnerId}:${lesson.lessonId}`)
    const masteryItem = masteryForLearner.find((item) =>
      isSameId(item.lessonId, lesson.lessonId)
    )

    return {
      ...lesson,
      completed: complete,
      status: complete ? "Completed" : "Not Started",
      masteryProbability: masteryItem?.masteryProbability ?? null,
      masteryLevel: masteryItem?.masteryLevel ?? null,
    }
  })

  const completedCount = lessonsWithProgress.filter((lesson) => lesson.completed).length
  const totalLessons = lessonsWithProgress.length
  const overallProgress =
    totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : null

  const masteryValues = masteryForLearner
    .map((item) => getScoreNumber(item.masteryProbability))
    .filter((value) => value !== null)

  const topicMastery =
    masteryValues.length > 0
      ? Math.round(
          (masteryValues.reduce((sum, value) => sum + value, 0) /
            masteryValues.length) *
            100
        )
      : null

  const performancePoints = examResultsForLearner
    .map((result) => {
      const exam = examById.get(String(result.examId))
      return {
        id: `${result.examId}-${result.attemptNo}`,
        label: result.takenAt
          ? new Date(result.takenAt).toLocaleDateString()
          : `Attempt ${result.attemptNo}`,
        score: getScoreNumber(result.score),
        kind: exam?.title?.toLowerCase().includes("quiz") ? "Quiz" : "Exam",
        title: exam?.title ?? `Exam ${result.examId}`,
        takenAt: result.takenAt,
      }
    })
    .filter((point) => point.score !== null)
    .sort((a, b) => new Date(a.takenAt ?? 0) - new Date(b.takenAt ?? 0))

  const weakTopics = uniqueBy(
    weakAreasForLearner
      .map((area) => {
        const lesson = lessonById.get(String(area.lessonId))
        const accuracy = getScoreNumber(area.accuracyRate)
        const masteryValue = getScoreNumber(area.masteryProbability)
        return {
          ...area,
          title: lesson?.name ?? `Lesson ${area.lessonId}`,
          category: lesson?.middleCategoryTitle ?? lesson?.majorCategoryTitle ?? "Topic",
          percent:
            masteryValue !== null
              ? Math.round(masteryValue * 100)
              : accuracy !== null
                ? Math.round(accuracy * 100)
                : 0,
          recommendation: area.weaknessLevel ?? "Review recommended",
        }
      })
      .sort((a, b) => a.percent - b.percent),
    (item) => item.lessonId
  )

  const recentExamResults = performancePoints.slice(-5).reverse()

  const resources = []
  for (const certification of asArray(certifications)) {
    if (certification.imageKey) {
      resources.push({
        id: `cert-${certification.certificationId}`,
        name: `${certification.title} cover image`,
        key: certification.imageKey,
        type: "Image",
        certificationId: certification.certificationId,
        certificationTitle: certification.title,
        lessonTitle: "",
        viewUrl: getFileViewUrl(certification.imageKey),
        downloadUrl: getFileDownloadUrl(certification.imageKey),
      })
    }
  }

  for (const lesson of allLessons) {
    const parsed = parseLessonStructure(lesson.lessonComponentStructure)
    for (const section of parsed) {
      for (const tool of asArray(section.content)) {
        const key = tool?.data?.imageKey ?? tool?.data?.videoKey
        if (key) {
          resources.push({
            id: `${lesson.lessonId}-${tool.id}`,
            name: tool?.data?.title || tool?.type || key.split("/").pop(),
            key,
            type: tool?.data?.videoKey ? "Video" : "Image",
            certificationId: lesson.certificationId,
            certificationTitle: lesson.certificationTitle,
            lessonId: lesson.lessonId,
            lessonTitle: lesson.name,
            viewUrl: getFileViewUrl(key),
            downloadUrl: getFileDownloadUrl(key),
          })
        }
      }
    }
  }

  return {
    identity,
    learnerId,
    userId,
    learner,
    user,
    certifications: asArray(certifications),
    enrollments,
    enrolledCertifications,
    lessons: lessonsWithProgress,
    completedLessons: completedForLearner,
    mastery: masteryForLearner,
    weakAreas: weakTopics,
    activityLogs: activityLogsForUser,
    exams: asArray(exams),
    examResults: examResultsForLearner,
    performancePoints,
    recentExamResults,
    resources,
    stats: {
      totalLessons,
      completedCount,
      overallProgress,
      topicMastery,
      confidenceLevel: learner?.confidenceLevel ?? null,
      readinessScore: learner?.readinessScore ?? null,
      studyStreak: computeStudyStreak(activityLogsForUser),
    },
  }
}

export function parseLessonStructure(value) {
  if (!value) {
    return []
  }

  if (Array.isArray(value)) {
    return value
  }

  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}
