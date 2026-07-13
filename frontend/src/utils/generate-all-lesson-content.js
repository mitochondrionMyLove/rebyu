import { generateLessonFromFiles, setLessonComponent } from "@/services/lessonService"
import {
  getGeneratedLessonWarnings,
  mapGeneratedLessonDraftsToSections,
} from "@/utils/generated-lesson-draft-mapper"

// Paces requests so the AI provider is never hit back-to-back across many
// lessons — the same rate-limit concern that made per-lesson generation a
// separate step from structure generation in the first place.
const DELAY_BETWEEN_LESSONS_MS = 4000

function collectLessons(certification) {
  const majorCategories =
      certification?.majorCategory ?? certification?.majorCategories ?? []
  const lessons = []

  for (const major of majorCategories) {
    const middleCategories = major?.middleCategory ?? major?.middleCategories ?? []

    for (const middle of middleCategories) {
      for (const lesson of middle?.lessons ?? []) {
        const lessonId = lesson?.lessonId ?? lesson?.id
        if (lessonId != null) {
          lessons.push({
            lessonId,
            lessonName: lesson?.name ?? lesson?.title ?? "Lesson",
          })
        }
      }
    }
  }

  return lessons
}

/**
 * Generates and saves AI content for every lesson in a freshly-created
 * certification structure. Runs one lesson at a time (never all at once) so
 * no single request risks a timeout and the AI provider is never hammered —
 * the same constraint that made per-lesson generation a separate step from
 * structure generation. A failure on one lesson is recorded and skipped
 * rather than aborting the rest.
 *
 * @param {object} certification - CertificationDto with a full major/middle/lesson tree.
 * @param {{ onProgress?: (state: { index: number, total: number, lessonName: string }) => void }} [options]
 * @returns {Promise<{ total: number, succeeded: number, failed: number, failedLessons: string[], skippedToolCount: number }>}
 */
export async function generateContentForAllLessons(certification, { onProgress } = {}) {
  const lessons = collectLessons(certification)
  const summary = {
    total: lessons.length,
    succeeded: 0,
    failed: 0,
    failedLessons: [],
    // Tools the parser had to discard (e.g. malformed shape) across every
    // lesson — surfaced so a pattern of dropped tools is visible instead of
    // silently producing thinner lessons than the AI actually attempted.
    skippedToolCount: 0,
  }

  for (let index = 0; index < lessons.length; index += 1) {
    const { lessonId, lessonName } = lessons[index]
    onProgress?.({ index, total: lessons.length, lessonName })

    try {
      const response = await generateLessonFromFiles(lessonId, [])
      const sections = mapGeneratedLessonDraftsToSections(response)

      if (sections.length === 0) {
        throw new Error("No sections were generated")
      }

      await setLessonComponent(lessonId, sections)
      summary.succeeded += 1
      summary.skippedToolCount += getGeneratedLessonWarnings(response).length
    } catch {
      summary.failed += 1
      summary.failedLessons.push(lessonName)
    }

    if (index < lessons.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, DELAY_BETWEEN_LESSONS_MS))
    }
  }

  return summary
}
