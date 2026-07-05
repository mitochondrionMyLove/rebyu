import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useMutation, useQuery } from "@tanstack/react-query"
import {
  ArrowLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  FlagIcon,
  ListIcon,
} from "lucide-react"
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
import { Label } from "@/components/ui/label"
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import DiagramArea from "@/components/challenges/diagram-area.jsx"
import CodeMirrorProgrammingWorkspace from "@/components/assessments/attempt/code-mirror-programming-workspace.jsx"
import QuestionNavigator from "@/components/assessments/attempt/question-navigator.jsx"
import SubQuestionTabs from "@/components/assessments/attempt/sub-question-tabs.jsx"
import { getFileViewUrl } from "@/services/fileService.js"
import { getCurrentLearnerIdentity } from "@/services/learnerService.js"
import { getQuestions } from "@/services/questionService.js"
import { extractDiagramData } from "@/utils/diagram-graph.js"
import {
  createDiagramAnswer,
  createExamResult,
  createLearnerExamDetail,
  createMcqAnswer,
  createProgrammingAnswer,
  createTextAnswer,
  getAssessmentTypeLabel,
  getDiagramQuestionConfig,
  getExamById,
  getExamQuestions,
  getExamResults,
  getExamTypes,
  getProgrammingQuestionConfig,
} from "@/services/assessmentService.js"
import { base } from "@/services/base"

function isChoiceCorrect(choice) {
  return Boolean(choice?.correct ?? choice?.isCorrect)
}

function toLocalDateTime(date) {
  return date.toISOString().slice(0, 19)
}

function formatClock(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
}

function isAnswered(question, answer) {
  if (!answer) return false
  switch (question.questionType) {
    case "MULTIPLE_CHOICE":
      return answer.choiceId != null
    case "SHORT_ANSWER":
    case "DESCRIPTIVE":
      return Boolean(answer.answerText?.trim())
    case "CRITICAL_THINKING":
      return (
        Boolean(answer.code?.trim()) ||
        Boolean(answer.diagramXml?.trim()) ||
        Object.values(answer.subAnswers ?? {}).some((text) => text?.trim())
      )
    default:
      return Boolean(answer.answerText?.trim())
  }
}

// ---------------------------------------------------------------------------
// Normal question layout (MCQ / short answer / descriptive)
// ---------------------------------------------------------------------------
function NormalQuestionPanel({ question, index, answer, onAnswer }) {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-semibold text-muted-foreground">
          Question {index + 1}
        </span>
        <Badge variant="outline">{question.difficultyLevel}</Badge>
        {question.totalPoints != null ? (
          <Badge variant="secondary">
            {Number(question.totalPoints)} pt(s)
          </Badge>
        ) : null}
      </div>

      <p className="text-base leading-7">{question.questionText}</p>

      {question.imageKey ? (
        <img
          src={getFileViewUrl(question.imageKey)}
          alt="Question reference"
          className="max-h-80 w-auto rounded-xl border"
        />
      ) : null}

      {question.questionType === "MULTIPLE_CHOICE" ? (
        <RadioGroup
          value={answer?.choiceId != null ? String(answer.choiceId) : ""}
          onValueChange={(value) => onAnswer({ choiceId: Number(value) })}
          className="gap-2"
        >
          {(question.choices ?? []).map((choice, choiceIndex) => (
            <label
              key={choice.choiceId ?? choiceIndex}
              className={cn(
                "flex cursor-pointer items-start gap-3 rounded-xl border p-3.5 transition hover:bg-muted/40",
                answer?.choiceId === choice.choiceId &&
                  "border-primary bg-primary/5"
              )}
            >
              <RadioGroupItem
                value={String(choice.choiceId)}
                className="mt-0.5"
                aria-label={`Choice ${String.fromCharCode(65 + choiceIndex)}`}
              />
              <div className="min-w-0">
                <span className="text-sm leading-6">
                  <span className="mr-1.5 font-semibold">
                    {String.fromCharCode(65 + choiceIndex)}.
                  </span>
                  {choice.choiceText}
                </span>
                {choice.imageKey ? (
                  <img
                    src={getFileViewUrl(choice.imageKey)}
                    alt=""
                    className="mt-2 max-h-40 w-auto rounded-lg border"
                  />
                ) : null}
              </div>
            </label>
          ))}
        </RadioGroup>
      ) : question.questionType === "SHORT_ANSWER" ? (
        <div className="space-y-2">
          <Label htmlFor="short-answer">Your answer</Label>
          <Input
            id="short-answer"
            value={answer?.answerText ?? ""}
            onChange={(event) => onAnswer({ answerText: event.target.value })}
            placeholder="Type your answer"
          />
        </div>
      ) : (
        <div className="space-y-2">
          <Label htmlFor="descriptive-answer">Your answer</Label>
          <Textarea
            id="descriptive-answer"
            value={answer?.answerText ?? ""}
            onChange={(event) => onAnswer({ answerText: event.target.value })}
            placeholder="Write your answer..."
            className="min-h-48"
          />
          <p className="text-right text-xs text-muted-foreground">
            {(answer?.answerText ?? "").length} characters
          </p>
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Critical thinking / diagram / programming workspace (three-panel)
// ---------------------------------------------------------------------------
function WorkspaceQuestionPanel({
  question,
  index,
  subQuestions,
  answer,
  onAnswer,
}) {
  const programmingConfigQuery = useQuery({
    queryKey: ["programming-config", question.questionId],
    queryFn: () =>
      getProgrammingQuestionConfig(question.questionId).catch(() => null),
    staleTime: Infinity,
  })
  const diagramConfigQuery = useQuery({
    queryKey: ["diagram-config", question.questionId],
    queryFn: () =>
      getDiagramQuestionConfig(question.questionId).catch(() => null),
    staleTime: Infinity,
  })

  const programmingConfig = programmingConfigQuery.data ?? null
  const diagramConfig = diagramConfigQuery.data ?? null
  const loadingConfigs =
    programmingConfigQuery.isLoading || diagramConfigQuery.isLoading

  const format = programmingConfig
    ? "CODING"
    : diagramConfig
      ? "DIAGRAM"
      : "TEXT"

  // Seed starter code once the config arrives, unless the learner typed already.
  useEffect(() => {
    if (
      format === "CODING" &&
      programmingConfig?.starterCode &&
      answer?.code == null
    ) {
      onAnswer({ code: programmingConfig.starterCode })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [format, programmingConfig])

  const problemPanel = (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-semibold text-muted-foreground">
          Item {index + 1}
        </span>
        <Badge variant="outline">{question.difficultyLevel}</Badge>
        {question.totalPoints != null ? (
          <Badge variant="secondary">
            {Number(question.totalPoints)} pt(s)
          </Badge>
        ) : null}
      </div>
      <p className="whitespace-pre-wrap text-sm leading-7">
        {question.questionText}
      </p>
      {diagramConfig?.instructions ? (
        <p className="whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
          {diagramConfig.instructions}
        </p>
      ) : null}
      {question.imageKey ? (
        <img
          src={getFileViewUrl(question.imageKey)}
          alt="Problem reference"
          className="w-full rounded-xl border"
        />
      ) : null}
    </div>
  )

  const workspace = loadingConfigs ? (
    <div className="space-y-3 p-4">
      <Skeleton className="h-8 w-1/3" />
      <Skeleton className="h-64 w-full" />
    </div>
  ) : format === "CODING" ? (
    <CodeMirrorProgrammingWorkspace
      value={answer?.code ?? programmingConfig?.starterCode ?? ""}
      language={answer?.language ?? "Java"}
      starterCode={programmingConfig?.starterCode ?? ""}
      onChange={(code) => onAnswer({ code })}
      onLanguageChange={(language) => onAnswer({ language })}
    />
  ) : format === "DIAGRAM" ? (
    <div className="h-full min-h-[420px] overflow-hidden rounded-xl border">
      <DiagramArea
        initialXml={answer?.diagramXml}
        onChange={(diagramXml) => onAnswer({ diagramXml })}
      />
    </div>
  ) : (
    <SubQuestionTabs
      subQuestions={
        subQuestions.length > 0
          ? subQuestions
          : [question] /* fall back to a single structured response */
      }
      answers={answer?.subAnswers ?? {}}
      onAnswerChange={(subQuestionId, text) =>
        onAnswer({
          subAnswers: { ...(answer?.subAnswers ?? {}), [subQuestionId]: text },
        })
      }
    />
  )

  return (
    <div className="grid h-full min-h-0 gap-4 lg:grid-cols-[320px_1fr]">
      <ScrollArea className="max-h-full rounded-xl border bg-card p-4">
        {problemPanel}
      </ScrollArea>
      <div className="flex min-h-0 flex-col">
        {format === "CODING" && subQuestions.length > 0 ? (
          <div className="mb-3 rounded-xl border bg-card p-3">
            <SubQuestionTabs
              subQuestions={subQuestions}
              answers={answer?.subAnswers ?? {}}
              onAnswerChange={(subQuestionId, text) =>
                onAnswer({
                  subAnswers: {
                    ...(answer?.subAnswers ?? {}),
                    [subQuestionId]: text,
                  },
                })
              }
            />
          </div>
        ) : null}
        <div className="min-h-0 flex-1">{workspace}</div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function LearnerAssessmentAttemptPage() {
  const { examId } = useParams()
  const navigate = useNavigate()

  const examQuery = useQuery({
    queryKey: ["exam", examId],
    queryFn: () => getExamById(examId),
  })
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
  const learnersQuery = useQuery({
    queryKey: ["learners"],
    queryFn: () => base("learners"),
    retry: 1,
  })
  const resultsQuery = useQuery({
    queryKey: ["exam-results"],
    queryFn: getExamResults,
    retry: 1,
  })

  const exam = examQuery.data ?? null

  const { orderedQuestions, subQuestionsByParent, examQuestionByQuestionId } =
    useMemo(() => {
      const allQuestions = Array.isArray(questionsQuery.data)
        ? questionsQuery.data
        : []
      const questionById = new Map(
        allQuestions.map((question) => [question.questionId, question])
      )
      const subsByParent = new Map()
      allQuestions.forEach((question) => {
        if (question.parentQuestionId != null) {
          const list = subsByParent.get(question.parentQuestionId) ?? []
          list.push(question)
          subsByParent.set(question.parentQuestionId, list)
        }
      })
      const links = (
        Array.isArray(examQuestionsQuery.data) ? examQuestionsQuery.data : []
      )
        .filter((link) => String(link.examId) === String(examId))
        .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
      const ordered = links
        .map((link) => questionById.get(link.questionId))
        .filter(Boolean)
      const linkByQuestion = new Map(
        links.map((link) => [link.questionId, link])
      )
      return {
        orderedQuestions: ordered,
        subQuestionsByParent: subsByParent,
        examQuestionByQuestionId: linkByQuestion,
      }
    }, [questionsQuery.data, examQuestionsQuery.data, examId])

  const [answers, setAnswers] = useState({})
  const [flagged, setFlagged] = useState(() => new Set())
  const [currentIndex, setCurrentIndex] = useState(0)
  const [leaveOpen, setLeaveOpen] = useState(false)
  const [finishOpen, setFinishOpen] = useState(false)
  const [timeUp, setTimeUp] = useState(false)
  const [remainingSeconds, setRemainingSeconds] = useState(null)
  const startedAtRef = useRef(Date.now())
  const warnedRef = useRef({ ten: false, one: false })

  // Countdown timer (only when the exam has a duration).
  useEffect(() => {
    if (!exam?.durationMinutes) return
    const endAt = startedAtRef.current + exam.durationMinutes * 60 * 1000
    const tick = () => {
      const left = Math.max(0, Math.round((endAt - Date.now()) / 1000))
      setRemainingSeconds(left)
      if (left <= 600 && !warnedRef.current.ten) {
        warnedRef.current.ten = true
        toast.warning("10 minutes remaining.")
      }
      if (left <= 60 && !warnedRef.current.one) {
        warnedRef.current.one = true
        toast.warning("1 minute remaining.")
      }
      if (left === 0) {
        setTimeUp(true)
      }
    }
    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [exam?.durationMinutes])

  // Warn before closing the tab during an active attempt.
  useEffect(() => {
    const handler = (event) => {
      event.preventDefault()
      event.returnValue = ""
    }
    window.addEventListener("beforeunload", handler)
    return () => window.removeEventListener("beforeunload", handler)
  }, [])

  const setAnswer = useCallback((questionId, patch) => {
    setAnswers((current) => ({
      ...current,
      [questionId]: { ...(current[questionId] ?? {}), ...patch },
    }))
  }, [])

  const answeredIds = useMemo(() => {
    const set = new Set()
    orderedQuestions.forEach((question) => {
      if (isAnswered(question, answers[question.questionId])) {
        set.add(question.questionId)
      }
    })
    return set
  }, [orderedQuestions, answers])

  const identity = getCurrentLearnerIdentity()
  const learners = Array.isArray(learnersQuery.data) ? learnersQuery.data : []
  const learnerId =
    identity.learnerId ??
    // Preview mode: scope the attempt to the first learner on record.
    learners[0]?.learnerId ??
    null

  const submitMutation = useMutation({
    mutationFn: async () => {
      if (learnerId == null) {
        throw new Error("no-learner")
      }
      const existingResults = (
        Array.isArray(resultsQuery.data) ? resultsQuery.data : []
      ).filter(
        (result) =>
          String(result.examId) === String(examId) &&
          Number(result.learnerId) === Number(learnerId)
      )
      const attemptNo =
        existingResults.reduce(
          (max, result) => Math.max(max, result.attemptNo ?? 0),
          0
        ) + 1

      // Auto-grade what can be graded honestly: multiple choice. Other types
      // are stored for review without a fabricated score.
      let correctCount = 0
      const gradedQuestions = orderedQuestions.map((question) => {
        const answer = answers[question.questionId] ?? {}
        let isCorrect = false
        let earnedScore = null
        if (question.questionType === "MULTIPLE_CHOICE") {
          const chosen = (question.choices ?? []).find(
            (choice) => choice.choiceId === answer.choiceId
          )
          isCorrect = isChoiceCorrect(chosen)
          earnedScore = isCorrect ? Number(question.totalPoints ?? 1) : 0
          if (isCorrect) correctCount += 1
        }
        return { question, answer, isCorrect, earnedScore }
      })

      const mcqCount = orderedQuestions.filter(
        (question) => question.questionType === "MULTIPLE_CHOICE"
      ).length
      const score =
        orderedQuestions.length > 0
          ? (correctCount / orderedQuestions.length) * 100
          : 0
      const passing = exam?.passingScore != null ? Number(exam.passingScore) : 0
      const now = new Date()

      await createExamResult({
        learnerId,
        examId: Number(examId),
        attemptNo,
        takenAt: toLocalDateTime(now),
        score: Number(score.toFixed(2)),
        durationSeconds: Math.round(
          (Date.now() - startedAtRef.current) / 1000
        ),
        isPassed: score >= passing,
      })

      for (const { question, answer, isCorrect, earnedScore } of gradedQuestions) {
        const link = examQuestionByQuestionId.get(question.questionId)
        if (!link) continue

        const detail = await createLearnerExamDetail({
          learnerId,
          examId: Number(examId),
          attemptNo,
          examQuestionId: link.examQuestionId,
          questionId: question.questionId,
          lessonId: question.lessonId,
          isCorrect,
          answeredAt: toLocalDateTime(now),
          earnedScore,
        })
        const detailId = detail.learnerExamDetailId

        if (
          question.questionType === "MULTIPLE_CHOICE" &&
          answer.choiceId != null
        ) {
          await createMcqAnswer({
            learnerExamDetailId: detailId,
            examQuestionId: link.examQuestionId,
            choiceId: answer.choiceId,
          })
        } else if (answer.answerText?.trim()) {
          await createTextAnswer({
            learnerExamDetailId: detailId,
            answerText: answer.answerText,
          })
        } else if (answer.code?.trim()) {
          await createProgrammingAnswer({
            learnerExamDetailId: detailId,
            programmingLanguage: answer.language ?? "Java",
            submittedCode: answer.code,
          })
        } else if (answer.diagramXml?.trim()) {
          let diagramJson = "{}"
          try {
            diagramJson = JSON.stringify(
              extractDiagramData(answer.diagramXml) ?? {}
            )
          } catch {
            diagramJson = "{}"
          }
          await createDiagramAnswer({
            learnerExamDetailId: detailId,
            diagramXml: answer.diagramXml,
            diagramJson,
          })
        }

        // Sub-question responses are stored as text answers on details that
        // reference the sub-question id.
        const subAnswers = answer.subAnswers ?? {}
        for (const [subQuestionId, text] of Object.entries(subAnswers)) {
          if (!text?.trim()) continue
          if (Number(subQuestionId) === question.questionId) {
            // Structured response stored against the parent above.
            const subDetail = await createLearnerExamDetail({
              learnerId,
              examId: Number(examId),
              attemptNo,
              examQuestionId: link.examQuestionId,
              questionId: question.questionId,
              lessonId: question.lessonId,
              isCorrect: false,
              answeredAt: toLocalDateTime(now),
              earnedScore: null,
            })
            await createTextAnswer({
              learnerExamDetailId: subDetail.learnerExamDetailId,
              answerText: text,
            })
            continue
          }
          const sub = (
            subQuestionsByParent.get(question.questionId) ?? []
          ).find((item) => item.questionId === Number(subQuestionId))
          const subDetail = await createLearnerExamDetail({
            learnerId,
            examId: Number(examId),
            attemptNo,
            examQuestionId: link.examQuestionId,
            questionId: Number(subQuestionId),
            lessonId: sub?.lessonId ?? question.lessonId,
            isCorrect: false,
            answeredAt: toLocalDateTime(now),
            earnedScore: null,
          })
          await createTextAnswer({
            learnerExamDetailId: subDetail.learnerExamDetailId,
            answerText: text,
          })
        }
      }

      return { attemptNo, mcqCount }
    },
    onSuccess: ({ attemptNo }) => {
      toast.success("Assessment submitted.")
      navigate(`/learner/results/${learnerId}-${examId}-${attemptNo}`, {
        replace: true,
      })
    },
    onError: (error) => {
      if (error?.message === "no-learner") {
        toast.error(
          "No learner profile is available, so this attempt cannot be recorded."
        )
      } else {
        toast.error("Unable to submit the assessment. Please try again.")
      }
    },
  })

  const isLoading =
    examQuery.isLoading ||
    examQuestionsQuery.isLoading ||
    questionsQuery.isLoading ||
    examTypesQuery.isLoading

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl space-y-4 p-6">
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    )
  }

  if (examQuery.isError || !exam) {
    return (
      <div className="flex min-h-dvh items-center justify-center p-6">
        <div className="max-w-md rounded-2xl border bg-card p-8 text-center">
          <p className="font-medium">Assessment not found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            This assessment may have been removed, or the backend is
            unavailable.
          </p>
          <Button
            className="mt-4"
            variant="outline"
            onClick={() => navigate("/learner/progress")}
          >
            Back to Progress
          </Button>
        </div>
      </div>
    )
  }

  const examTypeText = (
    Array.isArray(examTypesQuery.data) ? examTypesQuery.data : []
  ).find((type) => type.examTypeId === exam.examTypeId)?.examTypeText

  if (orderedQuestions.length === 0) {
    return (
      <div className="flex min-h-dvh items-center justify-center p-6">
        <div className="max-w-md rounded-2xl border bg-card p-8 text-center">
          <p className="font-medium">{exam.title}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            This assessment has no questions yet. Check back later.
          </p>
          <Button
            className="mt-4"
            variant="outline"
            onClick={() => navigate(-1)}
          >
            Go back
          </Button>
        </div>
      </div>
    )
  }

  const currentQuestion = orderedQuestions[currentIndex]
  const isWorkspace = currentQuestion.questionType === "CRITICAL_THINKING"
  const currentAnswer = answers[currentQuestion.questionId]
  const editingLocked = timeUp || submitMutation.isPending

  const navigatorPanel = (
    <QuestionNavigator
      questions={orderedQuestions}
      currentIndex={currentIndex}
      answeredIds={answeredIds}
      flaggedIds={flagged}
      onJump={setCurrentIndex}
      onFinish={() => setFinishOpen(true)}
      finishDisabled={submitMutation.isPending}
    />
  )

  return (
    <div className="flex h-dvh flex-col bg-muted/30">
      {/* Header */}
      <header className="flex h-14 shrink-0 items-center justify-between gap-2 border-b bg-background px-3 sm:px-4">
        <div className="flex min-w-0 items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLeaveOpen(true)}
            aria-label="Exit attempt"
          >
            <ArrowLeftIcon aria-hidden="true" />
            <span className="hidden sm:inline">Exit</span>
          </Button>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{exam.title}</p>
            <p className="truncate text-xs text-muted-foreground">
              Question {currentIndex + 1} of {orderedQuestions.length}
            </p>
          </div>
          <Badge variant="secondary" className="hidden sm:inline-flex">
            {getAssessmentTypeLabel(examTypeText)}
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          {identity.learnerId == null && learnerId != null ? (
            <Badge variant="outline" className="hidden md:inline-flex">
              Preview learner
            </Badge>
          ) : null}
          {remainingSeconds != null ? (
            <span
              className={cn(
                "flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-sm tabular-nums",
                remainingSeconds <= 60
                  ? "border-destructive text-destructive"
                  : remainingSeconds <= 600
                    ? "border-amber-400 text-amber-600"
                    : "text-muted-foreground"
              )}
              role="timer"
              aria-label="Time remaining"
            >
              <ClockIcon className="size-4" aria-hidden="true" />
              {formatClock(remainingSeconds)}
            </span>
          ) : null}

          {/* Mobile navigator */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="lg:hidden"
                aria-label="Open item navigation"
              >
                <ListIcon />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] p-4">
              <SheetHeader className="p-0 pb-3">
                <SheetTitle>Item Navigation</SheetTitle>
              </SheetHeader>
              {navigatorPanel}
            </SheetContent>
          </Sheet>

          <Button
            size="sm"
            className="hidden lg:inline-flex"
            onClick={() => setFinishOpen(true)}
            disabled={submitMutation.isPending}
          >
            Finish Attempt
          </Button>
        </div>
      </header>

      {/* Body */}
      <div className="flex min-h-0 flex-1 gap-4 p-4">
        <main
          className={cn(
            "min-h-0 flex-1 overflow-y-auto rounded-2xl border bg-background p-4 sm:p-6",
            editingLocked && "pointer-events-none opacity-70"
          )}
          aria-live="polite"
        >
          {isWorkspace ? (
            <WorkspaceQuestionPanel
              key={currentQuestion.questionId}
              question={currentQuestion}
              index={currentIndex}
              subQuestions={
                subQuestionsByParent.get(currentQuestion.questionId) ?? []
              }
              answer={currentAnswer}
              onAnswer={(patch) =>
                setAnswer(currentQuestion.questionId, patch)
              }
            />
          ) : (
            <NormalQuestionPanel
              key={currentQuestion.questionId}
              question={currentQuestion}
              index={currentIndex}
              answer={currentAnswer}
              onAnswer={(patch) =>
                setAnswer(currentQuestion.questionId, patch)
              }
            />
          )}
        </main>

        <aside className="hidden w-64 shrink-0 rounded-2xl border bg-background p-4 lg:block">
          {navigatorPanel}
        </aside>
      </div>

      {/* Bottom navigation */}
      <footer className="flex h-16 shrink-0 items-center justify-between gap-2 border-t bg-background px-4">
        <Button
          variant="outline"
          onClick={() => setCurrentIndex((index) => Math.max(0, index - 1))}
          disabled={currentIndex === 0}
        >
          <ChevronLeftIcon aria-hidden="true" />
          Previous
        </Button>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              setFlagged((current) => {
                const next = new Set(current)
                if (next.has(currentQuestion.questionId)) {
                  next.delete(currentQuestion.questionId)
                } else {
                  next.add(currentQuestion.questionId)
                }
                return next
              })
            }
            aria-pressed={flagged.has(currentQuestion.questionId)}
          >
            <FlagIcon
              className={cn(
                flagged.has(currentQuestion.questionId) &&
                  "fill-amber-400 text-amber-500"
              )}
              aria-hidden="true"
            />
            {flagged.has(currentQuestion.questionId)
              ? "Flagged"
              : "Flag for review"}
          </Button>
          <span className="hidden text-sm text-muted-foreground sm:block">
            Question {currentIndex + 1} of {orderedQuestions.length}
          </span>
        </div>

        {currentIndex === orderedQuestions.length - 1 ? (
          <Button
            onClick={() => setFinishOpen(true)}
            disabled={submitMutation.isPending}
          >
            Finish Attempt
          </Button>
        ) : (
          <Button
            variant="outline"
            onClick={() =>
              setCurrentIndex((index) =>
                Math.min(orderedQuestions.length - 1, index + 1)
              )
            }
          >
            Next
            <ChevronRightIcon aria-hidden="true" />
          </Button>
        )}
      </footer>

      {/* Leave attempt */}
      <AlertDialog open={leaveOpen} onOpenChange={setLeaveOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Leave this attempt?</AlertDialogTitle>
            <AlertDialogDescription>
              You have answered {answeredIds.size} of{" "}
              {orderedQuestions.length} question(s)
              {flagged.size > 0 ? `, with ${flagged.size} flagged` : ""}. Your
              answers are not submitted and will be lost if you leave now.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Taking Assessment</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => navigate(-1)}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              Leave Attempt
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Finish / submit */}
      <AlertDialog open={finishOpen} onOpenChange={setFinishOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Submit assessment?</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-2 text-sm">
                <dl className="grid grid-cols-2 gap-x-4 gap-y-1">
                  <dt className="text-muted-foreground">Total items</dt>
                  <dd className="text-right tabular-nums">
                    {orderedQuestions.length}
                  </dd>
                  <dt className="text-muted-foreground">Answered</dt>
                  <dd className="text-right tabular-nums">
                    {answeredIds.size}
                  </dd>
                  <dt className="text-muted-foreground">Unanswered</dt>
                  <dd className="text-right tabular-nums">
                    {orderedQuestions.length - answeredIds.size}
                  </dd>
                  <dt className="text-muted-foreground">Flagged</dt>
                  <dd className="text-right tabular-nums">{flagged.size}</dd>
                  {remainingSeconds != null ? (
                    <>
                      <dt className="text-muted-foreground">Time remaining</dt>
                      <dd className="text-right tabular-nums">
                        {formatClock(remainingSeconds)}
                      </dd>
                    </>
                  ) : null}
                </dl>
                {orderedQuestions.length - answeredIds.size > 0 ? (
                  <p className="text-destructive">
                    Unanswered items may receive no score.
                  </p>
                ) : null}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={submitMutation.isPending}>
              Review Answers
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(event) => {
                event.preventDefault()
                submitMutation.mutate()
              }}
              disabled={submitMutation.isPending}
            >
              {submitMutation.isPending
                ? "Submitting..."
                : "Submit Assessment"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Time up */}
      <AlertDialog open={timeUp && !submitMutation.isPending}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Time is up</AlertDialogTitle>
            <AlertDialogDescription>
              The time limit for this assessment has been reached. Editing is
              locked — submit your answers now.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={(event) => {
                event.preventDefault()
                submitMutation.mutate()
              }}
            >
              Submit Assessment
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
