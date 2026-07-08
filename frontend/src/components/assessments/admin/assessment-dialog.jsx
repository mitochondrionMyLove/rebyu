import { useEffect, useMemo, useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ASSESSMENT_TYPES,
  createExam,
  ensureExamType,
  updateExam,
} from "@/services/assessmentService.js"
import AssessmentQuestionPickerDialog from "./assessment-question-picker-dialog.jsx"

export default function AssessmentDialog({
  open,
  onOpenChange,
  mode = "create",
  certification,
  exam = null,
  examTypeByIdText = new Map(),
  existingExamQuestions = [],
  questionById = new Map(),
  initialType = "MOCK_EXAM",
  initialMiddleCategoryId = null,
}) {
  const queryClient = useQueryClient()
  const isEdit = mode === "edit"

  const [title, setTitle] = useState("")
  const [type, setType] = useState(initialType)
  const [durationMinutes, setDurationMinutes] = useState("")
  const [passingScore, setPassingScore] = useState("")
  const [selectedQuestions, setSelectedQuestions] = useState([])
  const [pickerOpen, setPickerOpen] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!open) return

    if (isEdit && exam) {
      setTitle(exam.title ?? "")
      setType(examTypeByIdText.get(exam.examTypeId) ?? initialType)
      setDurationMinutes(
        exam.durationMinutes != null ? String(exam.durationMinutes) : ""
      )
      setPassingScore(
        exam.passingScore != null ? String(exam.passingScore) : ""
      )

      const ordered = [...existingExamQuestions]
        .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
        .map((examQuestion) => questionById.get(examQuestion.questionId))
        .filter(Boolean)

      setSelectedQuestions(ordered)
    } else {
      setTitle("")
      setType(initialType)
      setDurationMinutes("")
      setPassingScore("")
      setSelectedQuestions([])
    }

    setError("")
    setPickerOpen(false)

    // Keep dependencies limited to dialog lifecycle.
    // This prevents selected questions from resetting while the picker is closing.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, exam?.examId, mode])

  const alreadySelectedIds = useMemo(
    () => new Set(selectedQuestions.map((question) => question.questionId)),
    [selectedQuestions]
  )

  const saveMutation = useMutation({
    mutationFn: async () => {
      const examType = await ensureExamType(type)

      const questionIds = selectedQuestions.map(
        (question) => question.questionId
      )

      const payload = {
        certificationId: certification.certificationId,
        examTypeId: examType.examTypeId,
        title: title.trim(),
        isGenerated: exam?.isGenerated ?? false,
        durationMinutes: durationMinutes ? Number(durationMinutes) : null,
        totalQuestions: questionIds.length,
        passingScore: passingScore ? Number(passingScore) : null,
        questionIds,
      }

      const savedExam = isEdit
        ? await updateExam(exam.examId, {
            ...payload,
            examId: exam.examId,
          })
        : await createExam(payload)

      return {
        savedExam,
        questionIds,
      }
    },

    onSuccess: async ({ savedExam, questionIds }) => {
      queryClient.setQueryData(["exams"], (current) => {
        const list = Array.isArray(current) ? [...current] : []
        const next = list.filter((item) => item.examId !== savedExam.examId)

        next.unshift({
          ...savedExam,
          questionIds,
          totalQuestions: questionIds.length,
        })

        return next
      })

      queryClient.setQueryData(["exam-questions"], (current) => {
        const list = Array.isArray(current) ? [...current] : []

        const filtered = list.filter((item) => item.examId !== savedExam.examId)

        const restored = questionIds.map((questionId, index) => ({
          examQuestionId: `${savedExam.examId}-${questionId}`,
          examId: savedExam.examId,
          questionId,
          displayOrder: index + 1,
        }))

        return [...filtered, ...restored]
      })

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["exams"] }),
        queryClient.invalidateQueries({ queryKey: ["exam-questions"] }),
        queryClient.invalidateQueries({ queryKey: ["exam-types"] }),
      ])

      await Promise.all([
        queryClient.refetchQueries({
          queryKey: ["exams"],
          type: "active",
        }),
        queryClient.refetchQueries({
          queryKey: ["exam-questions"],
          type: "active",
        }),
        queryClient.refetchQueries({
          queryKey: ["exam-types"],
          type: "active",
        }),
      ])

      toast.success(
        isEdit
          ? "Assessment updated successfully."
          : "Assessment created successfully."
      )

      onOpenChange(false)
    },

    onError: (error) => {
      const message =
        error?.response?.data?.message ??
        (isEdit
          ? "Unable to save changes. Please try again."
          : "Assessment could not be created.")

      setError(message)
      toast.error(message)
    },
  })

  const handleAssessmentDialogOpenChange = (nextOpen) => {
    if (!nextOpen && pickerOpen) {
      return
    }

    if (!nextOpen && saveMutation.isPending) {
      return
    }

    onOpenChange(nextOpen)
  }

  const handleAddQuestions = (questions) => {
    setSelectedQuestions((current) => {
      const existingIds = new Set(
        current.map((question) => question.questionId)
      )

      const newQuestions = questions.filter(
        (question) => !existingIds.has(question.questionId)
      )

      return [...current, ...newQuestions]
    })

    setError("")
    setPickerOpen(false)
  }

  const handleSubmit = () => {
    if (!title.trim()) {
      setError("Enter a title for this assessment.")
      return
    }

    if (selectedQuestions.length === 0) {
      setError("Add at least one question.")
      return
    }

    if (
      passingScore &&
      (Number(passingScore) < 0 || Number(passingScore) > 100)
    ) {
      setError("Passing score must be between 0 and 100.")
      return
    }

    setError("")
    saveMutation.mutate()
  }

  const moveQuestion = (index, delta) => {
    setSelectedQuestions((current) => {
      const next = [...current]
      const target = index + delta

      if (target < 0 || target >= next.length) {
        return current
      }

      ;[next[index], next[target]] = [next[target], next[index]]

      return next
    })
  }

  const removeQuestion = (questionId) => {
    setSelectedQuestions((current) =>
      current.filter((item) => item.questionId !== questionId)
    )
  }

  const typeLabel =
    ASSESSMENT_TYPES.find((option) => option.value === type)?.label ?? type

  return (
    <Dialog open={open} onOpenChange={handleAssessmentDialogOpenChange}>
      <DialogContent
        onInteractOutside={(event) => {
          if (pickerOpen || saveMutation.isPending) {
            event.preventDefault()
          }
        }}
        onEscapeKeyDown={(event) => {
          if (pickerOpen || saveMutation.isPending) {
            event.preventDefault()
          }
        }}
        className="h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] max-w-none overflow-hidden rounded-2xl p-0 sm:h-[calc(100dvh-4rem)] sm:w-[80vw] sm:max-w-[80vw] md:w-[65vw] md:max-w-[65vw] lg:h-[min(700px,calc(100dvh-4rem))] lg:w-[55vw] lg:max-w-[55vw]"
      >
        <div className="flex h-full min-h-0 flex-col">
          <DialogHeader className="border-b px-6 py-5">
            <DialogTitle className="text-xl font-semibold">
              {isEdit ? "Edit Assessment" : `Create ${typeLabel}`}
            </DialogTitle>

            <DialogDescription className="text-sm text-muted-foreground">
              Certification: {certification?.title}
            </DialogDescription>
          </DialogHeader>

          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
            <div className="space-y-6">
              <section className="space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground">
                  Assessment details
                </h3>

                <div className="grid gap-5 md:grid-cols-2">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="assessment-title">Title</Label>

                    <Input
                      id="assessment-title"
                      value={title}
                      onChange={(event) => setTitle(event.target.value)}
                      placeholder="e.g. IT Passport Mock Exam 1"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Assessment type</Label>

                    <Select value={type} onValueChange={setType}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>

                      <SelectContent>
                        {ASSESSMENT_TYPES.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="assessment-duration">
                      Duration (minutes)
                      <span className="ml-1 text-xs font-normal text-muted-foreground">
                        (optional)
                      </span>
                    </Label>

                    <Input
                      id="assessment-duration"
                      type="number"
                      min="1"
                      value={durationMinutes}
                      onChange={(event) =>
                        setDurationMinutes(event.target.value)
                      }
                      placeholder="60"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="assessment-passing">
                      Passing score (%)
                      <span className="ml-1 text-xs font-normal text-muted-foreground">
                        (optional)
                      </span>
                    </Label>

                    <Input
                      id="assessment-passing"
                      type="number"
                      min="0"
                      max="100"
                      value={passingScore}
                      onChange={(event) => setPassingScore(event.target.value)}
                      placeholder="70"
                    />
                  </div>
                </div>
              </section>

              <section className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-muted-foreground">
                    Questions ({selectedQuestions.length} selected)
                  </h3>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setPickerOpen(true)}
                  >
                    <Plus aria-hidden="true" />
                    Add Questions
                  </Button>
                </div>

                {selectedQuestions.length === 0 ? (
                  <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
                    No questions selected yet. Use Add Questions to pick from
                    this certification&apos;s question bank.
                  </div>
                ) : (
                  <ul className="space-y-2">
                    {selectedQuestions.map((question, index) => (
                      <li
                        key={question.questionId}
                        className="flex items-center gap-3 rounded-xl border p-3"
                      >
                        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold">
                          {index + 1}
                        </span>

                        <div className="min-w-0 flex-1">
                          <p className="line-clamp-1 text-sm font-medium">
                            {question.questionText}
                          </p>

                          <div className="mt-1 flex items-center gap-1.5">
                            <Badge variant="secondary" className="text-[10px]">
                              {question.questionType}
                            </Badge>

                            <Badge variant="outline" className="text-[10px]">
                              {question.difficultyLevel}
                            </Badge>
                          </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            aria-label="Move question up"
                            disabled={index === 0}
                            onClick={() => moveQuestion(index, -1)}
                          >
                            <ArrowUp />
                          </Button>

                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            aria-label="Move question down"
                            disabled={index === selectedQuestions.length - 1}
                            onClick={() => moveQuestion(index, 1)}
                          >
                            <ArrowDown />
                          </Button>

                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            aria-label="Remove question"
                            onClick={() => removeQuestion(question.questionId)}
                          >
                            <Trash2 />
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              <section className="space-y-2 rounded-xl bg-muted/40 p-4 text-sm">
                <h3 className="font-semibold text-muted-foreground">Summary</h3>

                <dl className="grid gap-x-6 gap-y-1 sm:grid-cols-2">
                  <div className="flex justify-between gap-2">
                    <dt className="text-muted-foreground">Certification</dt>

                    <dd className="truncate font-medium">
                      {certification?.title}
                    </dd>
                  </div>

                  <div className="flex justify-between gap-2">
                    <dt className="text-muted-foreground">Type</dt>

                    <dd className="font-medium">{typeLabel}</dd>
                  </div>

                  <div className="flex justify-between gap-2">
                    <dt className="text-muted-foreground">Questions</dt>

                    <dd className="font-medium">{selectedQuestions.length}</dd>
                  </div>

                  <div className="flex justify-between gap-2">
                    <dt className="text-muted-foreground">Duration</dt>

                    <dd className="font-medium">
                      {durationMinutes ? `${durationMinutes} min` : "No limit"}
                    </dd>
                  </div>

                  <div className="flex justify-between gap-2">
                    <dt className="text-muted-foreground">Passing score</dt>

                    <dd className="font-medium">
                      {passingScore ? `${passingScore}%` : "Not set"}
                    </dd>
                  </div>
                </dl>
              </section>

              {error ? (
                <p className="text-sm text-destructive" role="alert">
                  {error}
                </p>
              ) : null}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 border-t px-6 py-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={saveMutation.isPending}
            >
              Cancel
            </Button>

            <Button
              type="button"
              onClick={handleSubmit}
              disabled={saveMutation.isPending}
            >
              {saveMutation.isPending
                ? "Saving..."
                : isEdit
                  ? "Save Changes"
                  : `Create ${typeLabel}`}
            </Button>
          </div>
        </div>

        <AssessmentQuestionPickerDialog
          open={pickerOpen}
          onOpenChange={setPickerOpen}
          certification={certification}
          alreadySelectedIds={alreadySelectedIds}
          initialMiddleCategoryId={initialMiddleCategoryId}
          onAddQuestions={handleAddQuestions}
        />
      </DialogContent>
    </Dialog>
  )
}
