import { useMemo, useState } from "react"
import {
  BookOpenIcon,
  FileCheck2Icon,
  Layers3Icon,
  ListPlusIcon,
  PlusIcon,
  TargetIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { mapCertificationToModuleStructure } from "@/utils/certification-structure.js"
import { useAssessmentData } from "./assessments-tab.jsx"
import QuestionSelectionDialog from "./question-selection-dialog.jsx"

function examTypeText(exam, examTypeByIdText) {
  return examTypeByIdText?.get(exam?.examTypeId) ?? ""
}

function questionCount(exam) {
  return exam?.questionIds?.length ?? exam?.totalQuestions ?? 0
}

// One assessment slot at a curriculum scope: shows status + the right action
// (Create when missing, Add Questions when it exists).
function AssessmentSlot({ label, exam, missingType, scopePreset, onCreate, onAddQuestions }) {
  const published = exam?.status === "PUBLISHED"
  const count = questionCount(exam)

  let status
  if (published) status = { label: "Published", variant: "default" }
  else if (!exam) status = { label: "Missing", variant: "outline" }
  else if (count === 0) status = { label: "Incomplete", variant: "secondary" }
  else status = { label: "Ready", variant: "default" }

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border bg-card px-3 py-2">
      <div className="flex min-w-0 items-center gap-2">
        <FileCheck2Icon className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">
            {exam?.title ?? label}
          </p>
          {exam ? (
            <p className="text-xs text-muted-foreground">
              {count} question{count === 1 ? "" : "s"}
            </p>
          ) : null}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <Badge variant={status.variant}>{status.label}</Badge>
        {exam ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onAddQuestions(exam)}
            disabled={published}
          >
            <ListPlusIcon aria-hidden="true" />
            Add Questions
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onCreate({ type: missingType, ...scopePreset, lockPreset: true })}
          >
            <PlusIcon aria-hidden="true" />
            Create
          </Button>
        )}
      </div>
    </div>
  )
}

// The full certification assessment structure on one page (spec §2).
export default function AssessmentStructureView({ certification, onCreateAssessment }) {
  const certificationId = certification?.certificationId
  const data = useAssessmentData(certificationId)
  const [pickerExam, setPickerExam] = useState(null)

  const majors = useMemo(
    () => mapCertificationToModuleStructure(certification),
    [certification]
  )

  const maps = useMemo(() => {
    const exams = data.exams ?? []
    const byMajor = new Map()
    const byMiddle = new Map()
    const byLesson = new Map()
    let diagnostic = null
    let mock = null
    for (const exam of exams) {
      const type = examTypeText(exam, data.examTypeByIdText)
      if (type === "DIAGNOSTIC") diagnostic = exam
      else if (type === "MOCK_EXAM") mock = exam
      if (exam.majorCategoryId != null) byMajor.set(exam.majorCategoryId, exam)
      if (exam.middleCategoryId != null) byMiddle.set(exam.middleCategoryId, exam)
      if (exam.lessonId != null) byLesson.set(exam.lessonId, exam)
    }
    return { byMajor, byMiddle, byLesson, diagnostic, mock }
  }, [data.exams, data.examTypeByIdText])

  return (
    <div className="space-y-6">
      {/* Diagnostic */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <TargetIcon className="size-4 text-primary" aria-hidden="true" />
          Diagnostic Exam
        </div>
        <AssessmentSlot
          label={`${certification?.title ?? "Certification"} Diagnostic Exam`}
          exam={maps.diagnostic}
          missingType="DIAGNOSTIC"
          scopePreset={{}}
          onCreate={onCreateAssessment}
          onAddQuestions={setPickerExam}
        />
      </div>

      {/* Major categories */}
      {majors.map((major) => {
        const middles = major.middleCategories ?? []
        return (
          <Card key={major.majorCategoryId}>
            <CardContent className="space-y-3 pt-5">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Layers3Icon className="size-4 text-primary" aria-hidden="true" />
                {major.title}
              </div>

              <AssessmentSlot
                label={`${major.title} Major Exam`}
                exam={maps.byMajor.get(major.majorCategoryId)}
                missingType="MAJOR_EXAM"
                scopePreset={{ majorCategoryId: major.majorCategoryId }}
                onCreate={onCreateAssessment}
                onAddQuestions={setPickerExam}
              />

              {middles.map((middle) => {
                const lessons = middle.lessons ?? []
                return (
                  <div
                    key={middle.middleCategoryId}
                    className={cn("space-y-2 rounded-xl border border-dashed p-3")}
                  >
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <BookOpenIcon className="size-4 text-muted-foreground" aria-hidden="true" />
                      {middle.title}
                    </div>

                    <AssessmentSlot
                      label={`${middle.title} Middle Exam`}
                      exam={maps.byMiddle.get(middle.middleCategoryId)}
                      missingType="MIDDLE_EXAM"
                      scopePreset={{ middleCategoryId: middle.middleCategoryId }}
                      onCreate={onCreateAssessment}
                      onAddQuestions={setPickerExam}
                    />

                    {lessons.map((lesson) => (
                      <div key={lesson.lessonId} className="pl-4">
                        <AssessmentSlot
                          label={`${lesson.name} Quiz`}
                          exam={maps.byLesson.get(lesson.lessonId)}
                          missingType="LESSON_QUIZ"
                          scopePreset={{ lessonId: lesson.lessonId }}
                          onCreate={onCreateAssessment}
                          onAddQuestions={setPickerExam}
                        />
                      </div>
                    ))}
                  </div>
                )
              })}
            </CardContent>
          </Card>
        )
      })}

      {/* Mock */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <TargetIcon className="size-4 text-primary" aria-hidden="true" />
          Mock Exam
        </div>
        <AssessmentSlot
          label={`${certification?.title ?? "Certification"} Mock Exam`}
          exam={maps.mock}
          missingType="MOCK_EXAM"
          scopePreset={{}}
          onCreate={onCreateAssessment}
          onAddQuestions={setPickerExam}
        />
      </div>

      <QuestionSelectionDialog
        open={pickerExam != null}
        onOpenChange={(open) => !open && setPickerExam(null)}
        exam={pickerExam}
        onQuestionsAdded={() => {
          data.refetch?.()
          setPickerExam(null)
        }}
      />
    </div>
  )
}
