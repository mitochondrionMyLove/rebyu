import { useEffect, useMemo, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { ClipboardPlus, PencilIcon, Search, Trash2Icon, EyeIcon } from "lucide-react"
import { toast } from "sonner"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import {
  ASSESSMENT_TYPES,
  archiveExam,
  deleteExam,
  deleteExamQuestion,
  getAssessmentTypeLabel,
  getExamQuestions,
  getExamTypes,
  getExams,
  publishExam,
} from "@/services/assessmentService.js"
import { getQuestions } from "@/services/questionService.js"
import AssessmentDialog from "./assessment-dialog.jsx"
import AssessmentPreviewDialog from "./assessment-preview-dialog.jsx"

export function useAssessmentData(certificationId) {
  const examsQuery = useQuery({ queryKey: ["exams"], queryFn: getExams })
  const examTypesQuery = useQuery({
    queryKey: ["exam-types"],
    queryFn: getExamTypes,
  })
  const examQuestionsQuery = useQuery({
    queryKey: ["exam-questions"],
    queryFn: getExamQuestions,
  })
  const questionsQuery = useQuery({
    queryKey: ["questions"],
    queryFn: () => getQuestions(),
  })

  return useMemo(() => {
    const exams = (Array.isArray(examsQuery.data) ? examsQuery.data : []).filter(
      (exam) => exam.certificationId === certificationId
    )
    const examTypeByIdText = new Map(
      (Array.isArray(examTypesQuery.data) ? examTypesQuery.data : []).map(
        (type) => [type.examTypeId, type.examTypeText]
      )
    )
    const examQuestions = Array.isArray(examQuestionsQuery.data)
      ? examQuestionsQuery.data
      : []
    const persistedExamQuestions = exams.flatMap((exam) =>
      Array.isArray(exam.questionIds)
        ? exam.questionIds.map((questionId, index) => ({
            examQuestionId: `${exam.examId}-${questionId}`,
            examId: exam.examId,
            questionId,
            displayOrder: index + 1,
          }))
        : []
    )
    const existingExamQuestionKeys = new Set(
      examQuestions.map(
        (examQuestion) => `${examQuestion.examId}-${examQuestion.questionId}`
      )
    )
    const displayedExamQuestions = [
      ...examQuestions,
      ...persistedExamQuestions.filter(
        (examQuestion) =>
          !existingExamQuestionKeys.has(
            `${examQuestion.examId}-${examQuestion.questionId}`
          )
      ),
    ]
    const questionById = new Map(
      (Array.isArray(questionsQuery.data) ? questionsQuery.data : []).map(
        (question) => [question.questionId, question]
      )
    )
    return {
      exams,
      examTypeByIdText,
      examQuestions: displayedExamQuestions,
      questionById,
      isLoading:
        examsQuery.isLoading ||
        examTypesQuery.isLoading ||
        examQuestionsQuery.isLoading ||
        questionsQuery.isLoading,
      isError: examsQuery.isError,
      refetch: () => {
        examsQuery.refetch()
        examTypesQuery.refetch()
        examQuestionsQuery.refetch()
        questionsQuery.refetch()
      },
    }
  }, [
    certificationId,
    examsQuery.data,
    examsQuery.isLoading,
    examsQuery.isError,
    examTypesQuery.data,
    examTypesQuery.isLoading,
    examQuestionsQuery.data,
    examQuestionsQuery.isLoading,
    questionsQuery.data,
    questionsQuery.isLoading,
  ])
}

export default function AssessmentsTab({
  certification,
  createRequest,
  onCreateRequestHandled,
}) {
  const queryClient = useQueryClient()
  const data = useAssessmentData(certification.certificationId)

  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [createOpen, setCreateOpen] = useState(false)
  const [createPreset, setCreatePreset] = useState({
    type: "MOCK_EXAM",
    middleCategoryId: null,
  })
  const [editTarget, setEditTarget] = useState(null)
  const [previewTarget, setPreviewTarget] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  // External "Create quiz/mock exam" buttons elsewhere on the page can request
  // that this tab open the create dialog with a preset.
  useEffect(() => {
    if (createRequest) {
      setCreatePreset(createRequest)
      setCreateOpen(true)
      onCreateRequestHandled?.()
    }
  }, [createRequest, onCreateRequestHandled])

  const publishMutation = useMutation({
    mutationFn: ({ exam, publish }) =>
      publish ? publishExam(exam.examId) : archiveExam(exam.examId),
    onSuccess: (_, { publish }) => {
      queryClient.invalidateQueries({ queryKey: ["exams"] })
      toast.success(
        publish
          ? "Assessment published successfully."
          : "Assessment unpublished."
      )
    },
    onError: (error, { publish }) => {
      toast.error(
        error?.response?.data?.message ??
          (publish
            ? "The assessment could not be published."
            : "The assessment could not be unpublished.")
      )
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (exam) => {
      const related = data.examQuestions.filter(
        (examQuestion) => examQuestion.examId === exam.examId
      )
      await Promise.all(
        related.map((examQuestion) =>
          deleteExamQuestion(examQuestion.examQuestionId)
        )
      )
      await deleteExam(exam.examId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exams"] })
      queryClient.invalidateQueries({ queryKey: ["exam-questions"] })
      toast.success("Assessment deleted.")
      setDeleteTarget(null)
    },
    onError: () => {
      toast.error("Unable to delete the assessment. Please try again.")
    },
  })

  const rows = useMemo(() => {
    return data.exams
      .map((exam) => ({
        exam,
        typeText: data.examTypeByIdText.get(exam.examTypeId),
        questionCount: data.examQuestions.filter(
          (examQuestion) => examQuestion.examId === exam.examId
        ).length,
      }))
      .filter((row) => {
        if (typeFilter !== "all" && row.typeText !== typeFilter) return false
        if (
          search.trim() &&
          !row.exam.title.toLowerCase().includes(search.trim().toLowerCase())
        ) {
          return false
        }
        return true
      })
  }, [data, search, typeFilter])

  const existingQuestionsFor = (exam) =>
    data.examQuestions.filter(
      (examQuestion) => examQuestion.examId === exam.examId
    )

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground">
            Assessments
          </h2>
          <p className="mt-1 max-w-xl text-sm leading-6 text-muted-foreground">
            Create and manage diagnostics, quizzes, module exams, and mock
            exams for this certification.
          </p>
        </div>
        <Button
          type="button"
          onClick={() => {
            setCreatePreset({ type: "MOCK_EXAM", middleCategoryId: null })
            setCreateOpen(true)
          }}
        >
          <ClipboardPlus aria-hidden="true" />
          Create Assessment
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <label className="relative w-full max-w-xs">
          <span className="sr-only">Search assessments</span>
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search assessments"
            className="pl-9"
          />
        </label>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[180px]" aria-label="Type filter">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            {ASSESSMENT_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {data.isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-12 rounded-lg" />
          ))}
        </div>
      ) : data.isError ? (
        <div className="rounded-2xl border border-dashed p-10 text-center">
          <p className="text-sm text-muted-foreground">
            Unable to load assessments.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-3"
            onClick={data.refetch}
          >
            Try again
          </Button>
        </div>
      ) : rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-10 text-center">
          <p className="font-medium">
            {data.exams.length === 0
              ? "No assessments yet"
              : "No assessments match your filters"}
          </p>
          <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
            {data.exams.length === 0
              ? "Create a diagnostic, quiz, module exam, or mock exam for this certification."
              : "Try adjusting your search or type filter."}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Questions</TableHead>
                <TableHead className="text-right">Duration</TableHead>
                <TableHead className="text-right">Passing</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map(({ exam, typeText, questionCount }) => (
                <TableRow key={exam.examId}>
                  <TableCell className="max-w-[280px] truncate font-medium">
                    {exam.title}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {getAssessmentTypeLabel(typeText)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        exam.status === "PUBLISHED"
                          ? "default"
                          : exam.status === "ARCHIVED"
                            ? "outline"
                            : "secondary"
                      }
                      className="capitalize"
                    >
                      {(exam.status ?? "DRAFT").toLowerCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {questionCount}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {exam.durationMinutes ? `${exam.durationMinutes}m` : "—"}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {exam.passingScore != null
                      ? `${Number(exam.passingScore).toFixed(0)}%`
                      : "—"}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      {exam.status === "PUBLISHED" ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={publishMutation.isPending}
                          onClick={() =>
                            publishMutation.mutate({ exam, publish: false })
                          }
                        >
                          Unpublish
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={
                            publishMutation.isPending || questionCount === 0
                          }
                          onClick={() =>
                            publishMutation.mutate({ exam, publish: true })
                          }
                        >
                          Publish
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Preview ${exam.title}`}
                        onClick={() => setPreviewTarget(exam)}
                      >
                        <EyeIcon />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Edit ${exam.title}`}
                        onClick={() => setEditTarget(exam)}
                      >
                        <PencilIcon />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Delete ${exam.title}`}
                        onClick={() => setDeleteTarget(exam)}
                      >
                        <Trash2Icon />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <AssessmentDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        mode="create"
        certification={certification}
        initialType={createPreset.type}
        initialMiddleCategoryId={createPreset.middleCategoryId}
      />

      <AssessmentDialog
        open={editTarget != null}
        onOpenChange={(open) => {
          if (!open) setEditTarget(null)
        }}
        mode="edit"
        certification={certification}
        exam={editTarget}
        examTypeByIdText={data.examTypeByIdText}
        existingExamQuestions={
          editTarget ? existingQuestionsFor(editTarget) : []
        }
        questionById={data.questionById}
      />

      <AssessmentPreviewDialog
        open={previewTarget != null}
        onOpenChange={(open) => {
          if (!open) setPreviewTarget(null)
        }}
        exam={previewTarget}
        examTypeByIdText={data.examTypeByIdText}
        examQuestions={data.examQuestions}
        questionById={data.questionById}
      />

      <AlertDialog
        open={deleteTarget != null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this assessment?</AlertDialogTitle>
            <AlertDialogDescription>
              "{deleteTarget?.title}" and its question list will be permanently
              removed. Learner results already recorded are not affected. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(event) => {
                event.preventDefault()
                deleteMutation.mutate(deleteTarget)
              }}
              disabled={deleteMutation.isPending}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete Assessment"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
