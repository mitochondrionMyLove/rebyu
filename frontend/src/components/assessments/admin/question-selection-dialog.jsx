import { useMemo, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Loader2Icon, SearchIcon } from "lucide-react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import QuestionPointsConfiguration from "./question-points-configuration.jsx"
import { addExamQuestions } from "@/services/assessmentService.js"
import { getEligibleQuestions } from "@/services/questionService.js"

// Selects scope-filtered eligible questions (excluding already-assigned) and
// configures their points, then adds them to the assessment in one transaction.
// `exam` carries the scope: { examId, title, certificationId, majorCategoryId,
// middleCategoryId, lessonId, passingScore }.
export default function QuestionSelectionDialog({
  open,
  onOpenChange,
  exam,
  onQuestionsAdded,
}) {
  const queryClient = useQueryClient()
  const [selectedIds, setSelectedIds] = useState(() => new Set())
  const [pointsMap, setPointsMap] = useState({})
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("ALL")

  const eligibleQuery = useQuery({
    queryKey: ["eligible-questions", exam?.examId, exam?.certificationId],
    queryFn: () =>
      getEligibleQuestions({
        certificationId: exam?.certificationId,
        majorId: exam?.majorCategoryId,
        middleId: exam?.middleCategoryId,
        lessonId: exam?.lessonId,
        examId: exam?.examId,
      }),
    enabled: open && exam?.examId != null,
    retry: 1,
  })

  const eligible = Array.isArray(eligibleQuery.data) ? eligibleQuery.data : []

  const questionTypes = useMemo(
    () => Array.from(new Set(eligible.map((question) => question.questionType))).sort(),
    [eligible]
  )

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    return eligible.filter((question) => {
      if (typeFilter !== "ALL" && question.questionType !== typeFilter) return false
      if (term && !(question.questionText ?? "").toLowerCase().includes(term)) return false
      return true
    })
  }, [eligible, search, typeFilter])

  const selectedQuestions = useMemo(
    () => eligible.filter((question) => selectedIds.has(question.questionId)),
    [eligible, selectedIds]
  )

  function toggle(questionId) {
    setSelectedIds((current) => {
      const next = new Set(current)
      if (next.has(questionId)) next.delete(questionId)
      else next.add(questionId)
      return next
    })
  }

  const addMutation = useMutation({
    mutationFn: () => {
      const payload = selectedQuestions.map((question, index) => ({
        questionId: question.questionId,
        points: Number(pointsMap[question.questionId]),
        displayOrder: index + 1,
      }))
      return addExamQuestions(exam.examId, payload)
    },
    onSuccess: () => {
      toast.success(`Added ${selectedQuestions.length} question(s).`)
      queryClient.invalidateQueries({ queryKey: ["eligible-questions"] })
      queryClient.invalidateQueries({ queryKey: ["certification-publishing-requirements"] })
      setSelectedIds(new Set())
      setPointsMap({})
      onQuestionsAdded?.()
      onOpenChange(false)
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message ?? "Could not add the selected questions."
      )
    },
  })

  const hasInvalidPoints = selectedQuestions.some((question) => {
    const value = Number(pointsMap[question.questionId])
    return !Number.isFinite(value) || value <= 0
  })

  function handleClose(next) {
    if (!next && !addMutation.isPending) {
      setSearch("")
      setTypeFilter("ALL")
    }
    onOpenChange(next)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="flex max-h-[calc(100dvh-2rem)] flex-col gap-3 sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Add Questions</DialogTitle>
          <DialogDescription>
            {exam?.title
              ? `Only questions in scope for "${exam.title}" are shown. Already-assigned questions are excluded.`
              : "Select questions and configure their points."}
          </DialogDescription>
        </DialogHeader>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-52 flex-1">
            <SearchIcon
              className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search question text"
              className="h-9 pl-8"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="h-9 w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All types</SelectItem>
              {questionTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Badge variant="secondary" className="tabular-nums">
            {selectedIds.size} selected
          </Badge>
        </div>

        <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-2">
          {/* Eligible list */}
          <ScrollArea className="max-h-[46vh] rounded-xl border">
            <div className="space-y-1.5 p-2">
              {eligibleQuery.isLoading ? (
                <p className="flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground">
                  <Loader2Icon className="size-4 animate-spin" aria-hidden="true" />
                  Loading eligible questions…
                </p>
              ) : filtered.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  {eligible.length === 0
                    ? "No eligible questions in this scope. Add questions to the question bank first."
                    : "No questions match your filters."}
                </p>
              ) : (
                filtered.map((question) => {
                  const checked = selectedIds.has(question.questionId)
                  const source = [
                    question.majorTitle,
                    question.middleTitle,
                    question.lessonTitle,
                  ]
                    .filter(Boolean)
                    .join(" → ")
                  return (
                    <label
                      key={question.questionId}
                      className={cn(
                        "flex cursor-pointer items-start gap-2.5 rounded-lg border p-2.5 text-sm transition hover:bg-muted/40",
                        checked && "border-primary bg-primary/5"
                      )}
                    >
                      <Checkbox
                        checked={checked}
                        onCheckedChange={() => toggle(question.questionId)}
                        className="mt-0.5"
                      />
                      <div className="min-w-0">
                        <p className="line-clamp-2 font-medium">
                          {question.questionText}
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {question.questionType}
                          {question.difficultyLevel
                            ? ` · ${question.difficultyLevel}`
                            : ""}
                          {source ? ` · ${source}` : ""}
                        </p>
                      </div>
                    </label>
                  )
                })
              )}
            </div>
          </ScrollArea>

          {/* Points configuration for the selection */}
          <ScrollArea className="max-h-[46vh] rounded-xl border p-3">
            {selectedQuestions.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Select questions to configure their points.
              </p>
            ) : (
              <QuestionPointsConfiguration
                questions={selectedQuestions}
                value={pointsMap}
                onChange={setPointsMap}
                passingPercentage={
                  exam?.passingScore != null ? Number(exam.passingScore) : 70
                }
                onRemove={(questionId) => toggle(questionId)}
              />
            )}
          </ScrollArea>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleClose(false)}
            disabled={addMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={() => addMutation.mutate()}
            disabled={
              selectedQuestions.length === 0 ||
              hasInvalidPoints ||
              addMutation.isPending
            }
          >
            {addMutation.isPending ? (
              <>
                <Loader2Icon className="animate-spin" aria-hidden="true" />
                Adding…
              </>
            ) : (
              `Add Selected Questions (${selectedQuestions.length})`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
