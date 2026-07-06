import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useMutation, useQuery } from "@tanstack/react-query"
import {
  ArrowLeftIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloudOffIcon,
  ClockIcon,
  FlagIcon,
  ListIcon,
  Loader2Icon,
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
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
import {
  autosaveAttemptAnswers,
  getAssessmentTypeLabel,
  startAssessmentAttempt,
  submitAssessmentAttempt,
} from "@/services/assessmentService.js"
import { base } from "@/services/base"

function formatClock(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
}

// Serializes one local answer into the backend AttemptAnswerDraftDto shape.
function toDraftDto(attemptQuestionId, answer) {
  const subAnswers = answer.subAnswers ?? {}
  const hasSubs = Object.values(subAnswers).some((text) => text?.trim())
  return {
    attemptQuestionId,
    learnerAnswer: hasSubs
      ? JSON.stringify(subAnswers)
      : (answer.learnerAnswer ?? null),
    selectedChoiceId: answer.selectedChoiceId ?? null,
    submittedCode: answer.submittedCode ?? null,
    programmingLanguage: answer.programmingLanguage ?? null,
    diagramSubmissionData: answer.diagramSubmissionData ?? null,
  }
}

function isAnswered(question, answer) {
  if (!answer) return false
  if (question.questionType === "MULTIPLE_CHOICE") {
    return answer.selectedChoiceId != null
  }
  if (question.questionType === "CRITICAL_THINKING") {
    return (
      Boolean(answer.submittedCode?.trim()) ||
      Boolean(answer.diagramSubmissionData?.trim()) ||
      Object.values(answer.subAnswers ?? {}).some((text) => text?.trim())
    )
  }
  return Boolean(answer.learnerAnswer?.trim())
}

function SaveStatusIndicator({ status }) {
  if (status === "saving") {
    return (
      <span className="flex items-center gap-1 text-xs text-muted-foreground">
        <Loader2Icon className="size-3 animate-spin" aria-hidden="true" />
        Saving…
      </span>
    )
  }
  if (status === "saved") {
    return (
      <span className="flex items-center gap-1 text-xs text-muted-foreground">
        <CheckIcon className="size-3" aria-hidden="true" />
        Saved
      </span>
    )
  }
  if (status === "error") {
    return (
      <span className="flex items-center gap-1 text-xs text-destructive">
        <CloudOffIcon className="size-3" aria-hidden="true" />
        Unable to save draft
      </span>
    )
  }
  return null
}

function NormalQuestionPanel({ question, index, answer, onAnswer }) {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-semibold text-muted-foreground">
          Question {index + 1}
        </span>
        {question.points != null ? (
          <Badge variant="secondary">{Number(question.points)} pt(s)</Badge>
        ) : null}
      </div>

      <p className="text-base leading-7">{question.question}</p>

      {question.questionImageKey ? (
        <img
          src={getFileViewUrl(question.questionImageKey)}
          alt="Question reference"
          className="max-h-80 w-auto rounded-xl border"
        />
      ) : null}

      {question.questionType === "MULTIPLE_CHOICE" ? (
        <RadioGroup
          value={
            answer?.selectedChoiceId != null
              ? String(answer.selectedChoiceId)
              : ""
          }
          onValueChange={(value) =>
            onAnswer({ selectedChoiceId: Number(value) })
          }
          className="gap-2"
        >
          {(question.choices ?? []).map((choice, choiceIndex) => (
            <label
              key={choice.choiceId ?? choiceIndex}
              className={cn(
                "flex cursor-pointer items-start gap-3 rounded-xl border p-3.5 transition hover:bg-muted/40",
                answer?.selectedChoiceId === choice.choiceId &&
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
            value={answer?.learnerAnswer ?? ""}
            onChange={(event) =>
              onAnswer({ learnerAnswer: event.target.value })
            }
            placeholder="Type your answer"
          />
        </div>
      ) : (
        <div className="space-y-2">
          <Label htmlFor="descriptive-answer">Your answer</Label>
          <Textarea
            id="descriptive-answer"
            value={answer?.learnerAnswer ?? ""}
            onChange={(event) =>
              onAnswer({ learnerAnswer: event.target.value })
            }
            placeholder="Write your answer..."
            className="min-h-48"
          />
          <p className="text-right text-xs text-muted-foreground">
            {(answer?.learnerAnswer ?? "").length} characters
          </p>
        </div>
      )}
    </div>
  )
}

function WorkspaceQuestionPanel({ question, index, answer, onAnswer }) {
  const format = question.criticalThinkingType ?? "TEXT"

  // Seed starter code once, unless the learner already typed something.
  useEffect(() => {
    if (
      format === "PROGRAMMING" &&
      question.starterCode &&
      answer?.submittedCode == null
    ) {
      onAnswer({ submittedCode: question.starterCode })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [format, question.starterCode])

  const problemPanel = (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-semibold text-muted-foreground">
          Item {index + 1}
        </span>
        {question.points != null ? (
          <Badge variant="secondary">{Number(question.points)} pt(s)</Badge>
        ) : null}
      </div>
      <p className="whitespace-pre-wrap text-sm leading-7">
        {question.question}
      </p>
      {question.instructions ? (
        <p className="whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
          {question.instructions}
        </p>
      ) : null}
      {question.diagramType ? (
        <Badge variant="outline">{question.diagramType}</Badge>
      ) : null}
      {question.questionImageKey ? (
        <img
          src={getFileViewUrl(question.questionImageKey)}
          alt="Problem reference"
          className="w-full rounded-xl border"
        />
      ) : null}
    </div>
  )

  const subQuestionTabs =
    (question.subQuestions ?? []).length > 0 ? (
      <SubQuestionTabs
        subQuestions={question.subQuestions.map((sub) => ({
          questionId: sub.subQuestionId,
          questionText: sub.questionText,
        }))}
        answers={answer?.subAnswers ?? {}}
        onAnswerChange={(subQuestionId, text) =>
          onAnswer({
            subAnswers: { ...(answer?.subAnswers ?? {}), [subQuestionId]: text },
          })
        }
      />
    ) : null

  const workspace =
    format === "PROGRAMMING" ? (
      <CodeMirrorProgrammingWorkspace
        value={answer?.submittedCode ?? question.starterCode ?? ""}
        language={answer?.programmingLanguage ?? "Java"}
        starterCode={question.starterCode ?? ""}
        onChange={(code) => onAnswer({ submittedCode: code })}
        onLanguageChange={(language) =>
          onAnswer({ programmingLanguage: language })
        }
      />
    ) : format === "DIAGRAM" ? (
      <div className="h-full min-h-[420px] overflow-hidden rounded-xl border">
        <DiagramArea
          initialXml={answer?.diagramSubmissionData}
          onChange={(diagramXml) =>
            onAnswer({ diagramSubmissionData: diagramXml })
          }
        />
      </div>
    ) : (
      subQuestionTabs ?? (
        <div className="space-y-2">
          <Label htmlFor="workspace-answer">Your answer</Label>
          <Textarea
            id="workspace-answer"
            value={answer?.learnerAnswer ?? ""}
            onChange={(event) =>
              onAnswer({ learnerAnswer: event.target.value })
            }
            className="min-h-64"
          />
        </div>
      )
    )

  return (
    <div className="grid h-full min-h-0 gap-4 lg:grid-cols-[320px_1fr]">
      <ScrollArea className="max-h-full rounded-xl border bg-card p-4">
        {problemPanel}
      </ScrollArea>
      <div className="flex min-h-0 flex-col gap-3">
        {format !== "TEXT" && subQuestionTabs ? (
          <div className="rounded-xl border bg-card p-3">{subQuestionTabs}</div>
        ) : null}
        <div className="min-h-0 flex-1">{workspace}</div>
      </div>
    </div>
  )
}

export default function LearnerAssessmentAttemptPage() {
  const { examId } = useParams()
  const navigate = useNavigate()

  const identity = getCurrentLearnerIdentity()
  const learnersQuery = useQuery({
    queryKey: ["learners"],
    queryFn: () => base("learners"),
    retry: 1,
    enabled: identity.learnerId == null,
  })
  const learnerId =
    identity.learnerId ??
    (Array.isArray(learnersQuery.data) ? learnersQuery.data[0]?.learnerId : null) ??
    null

  // Server-driven attempt state
  const [attempt, setAttempt] = useState(null)
  const [startError, setStartError] = useState(null)
  const startedRef = useRef(false)

  const [answers, setAnswers] = useState({})
  const answersRef = useRef(answers)
  answersRef.current = answers
  const dirtyRef = useRef(new Set())
  const [saveStatus, setSaveStatus] = useState("idle")

  const [flagged, setFlagged] = useState(() => new Set())
  const [currentIndex, setCurrentIndex] = useState(0)
  const [leaveOpen, setLeaveOpen] = useState(false)
  const [finishOpen, setFinishOpen] = useState(false)
  const [timeUp, setTimeUp] = useState(false)
  const [remainingSeconds, setRemainingSeconds] = useState(null)
  const warnedRef = useRef({ ten: false, one: false })

  // ---------------------------------------------------------------
  // Start / resume the attempt on the server
  // ---------------------------------------------------------------
  useEffect(() => {
    if (learnerId == null || startedRef.current) return
    startedRef.current = true
    const keyName = `rebyu-attempt-key-${examId}-${learnerId}`
    let idempotencyKey = sessionStorage.getItem(keyName)
    if (!idempotencyKey) {
      idempotencyKey = crypto.randomUUID()
      sessionStorage.setItem(keyName, idempotencyKey)
    }
    startAssessmentAttempt(examId, learnerId, idempotencyKey)
      .then((response) => {
        setAttempt(response)
        // Rehydrate saved draft answers when resuming.
        const rehydrated = {}
        Object.values(response.savedAnswers ?? {}).forEach((draft) => {
          let subAnswers
          if (draft.learnerAnswer?.startsWith("{")) {
            try {
              subAnswers = JSON.parse(draft.learnerAnswer)
            } catch {
              subAnswers = undefined
            }
          }
          rehydrated[draft.attemptQuestionId] = {
            learnerAnswer: subAnswers ? undefined : draft.learnerAnswer,
            selectedChoiceId: draft.selectedChoiceId,
            submittedCode: draft.submittedCode,
            programmingLanguage: draft.programmingLanguage,
            diagramSubmissionData: draft.diagramSubmissionData,
            subAnswers,
          }
        })
        setAnswers(rehydrated)
        if (response.resumed) {
          toast.info("Resumed your attempt in progress.")
        }
      })
      .catch((error) => {
        sessionStorage.removeItem(keyName)
        setStartError(
          error?.response?.data?.message ??
            "This assessment could not be started."
        )
      })
  }, [examId, learnerId])

  const questions = attempt?.questions ?? []

  // ---------------------------------------------------------------
  // Debounced autosave of dirty answers
  // ---------------------------------------------------------------
  useEffect(() => {
    if (!attempt) return
    const interval = setInterval(() => {
      if (dirtyRef.current.size === 0) return
      const dirtyIds = [...dirtyRef.current]
      dirtyRef.current = new Set()
      const payload = dirtyIds
        .map((id) => {
          const answer = answersRef.current[id]
          return answer ? toDraftDto(Number(id), answer) : null
        })
        .filter(Boolean)
      if (payload.length === 0) return
      setSaveStatus("saving")
      autosaveAttemptAnswers(attempt.assessmentAttemptId, learnerId, payload)
        .then(() => setSaveStatus("saved"))
        .catch(() => {
          // Keep local answers; retry on the next tick.
          dirtyIds.forEach((id) => dirtyRef.current.add(id))
          setSaveStatus("error")
        })
    }, 1500)
    return () => clearInterval(interval)
  }, [attempt, learnerId])

  const setAnswer = useCallback((attemptQuestionId, patch) => {
    setAnswers((current) => ({
      ...current,
      [attemptQuestionId]: { ...(current[attemptQuestionId] ?? {}), ...patch },
    }))
    dirtyRef.current.add(attemptQuestionId)
  }, [])

  // ---------------------------------------------------------------
  // Timer from the server-issued expiry
  // ---------------------------------------------------------------
  useEffect(() => {
    if (!attempt?.expiresAt) return
    const endAt = new Date(attempt.expiresAt).getTime()
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
      if (left === 0) setTimeUp(true)
    }
    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [attempt?.expiresAt])

  useEffect(() => {
    const handler = (event) => {
      event.preventDefault()
      event.returnValue = ""
    }
    window.addEventListener("beforeunload", handler)
    return () => window.removeEventListener("beforeunload", handler)
  }, [])

  const answeredIds = useMemo(() => {
    const set = new Set()
    questions.forEach((question) => {
      if (isAnswered(question, answers[question.attemptQuestionId])) {
        set.add(question.attemptQuestionId)
      }
    })
    return set
  }, [questions, answers])

  const submitMutation = useMutation({
    mutationFn: () => {
      const payload = questions
        .map((question) => {
          const answer = answers[question.attemptQuestionId]
          return answer
            ? toDraftDto(question.attemptQuestionId, answer)
            : null
        })
        .filter(Boolean)
      return submitAssessmentAttempt(
        attempt.assessmentAttemptId,
        learnerId,
        payload
      )
    },
    onSuccess: (result) => {
      sessionStorage.removeItem(`rebyu-attempt-key-${examId}-${learnerId}`)
      toast.success("Assessment submitted.")
      navigate(`/learner/results/${result.assessmentAttemptId}`, {
        replace: true,
      })
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message ??
          "Unable to submit the assessment. Please try again."
      )
    },
  })

  // ---------------------------------------------------------------
  // Render states
  // ---------------------------------------------------------------
  if (startError) {
    return (
      <div className="flex min-h-dvh items-center justify-center p-6">
        <div className="max-w-md rounded-2xl border bg-card p-8 text-center">
          <p className="font-medium">Assessment unavailable</p>
          <p className="mt-1 text-sm text-muted-foreground">{startError}</p>
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

  if (!attempt) {
    return (
      <div className="mx-auto max-w-4xl space-y-4 p-6">
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    )
  }

  const currentQuestion = questions[currentIndex]
  const isWorkspace = currentQuestion?.questionType === "CRITICAL_THINKING"
  const currentAnswer = currentQuestion
    ? answers[currentQuestion.attemptQuestionId]
    : null
  const editingLocked = timeUp || submitMutation.isPending

  const navigatorPanel = (
    <QuestionNavigator
      questions={questions.map((question) => ({
        questionId: question.attemptQuestionId,
      }))}
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
            <p className="truncate text-sm font-semibold">
              {attempt.assessmentTitle}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              Question {currentIndex + 1} of {questions.length} · Attempt{" "}
              {attempt.attemptNumber}
            </p>
          </div>
          <Badge variant="secondary" className="hidden sm:inline-flex">
            {getAssessmentTypeLabel(attempt.assessmentType)}
          </Badge>
        </div>

        <div className="flex items-center gap-3">
          <SaveStatusIndicator status={saveStatus} />
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

      <div className="flex min-h-0 flex-1 gap-4 p-4">
        <main
          className={cn(
            "min-h-0 flex-1 overflow-y-auto rounded-2xl border bg-background p-4 sm:p-6",
            editingLocked && "pointer-events-none opacity-70"
          )}
          aria-live="polite"
        >
          {currentQuestion ? (
            isWorkspace ? (
              <WorkspaceQuestionPanel
                key={currentQuestion.attemptQuestionId}
                question={currentQuestion}
                index={currentIndex}
                answer={currentAnswer}
                onAnswer={(patch) =>
                  setAnswer(currentQuestion.attemptQuestionId, patch)
                }
              />
            ) : (
              <NormalQuestionPanel
                key={currentQuestion.attemptQuestionId}
                question={currentQuestion}
                index={currentIndex}
                answer={currentAnswer}
                onAnswer={(patch) =>
                  setAnswer(currentQuestion.attemptQuestionId, patch)
                }
              />
            )
          ) : null}
        </main>

        <aside className="hidden w-64 shrink-0 rounded-2xl border bg-background p-4 lg:block">
          {navigatorPanel}
        </aside>
      </div>

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
          {currentQuestion ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                setFlagged((current) => {
                  const next = new Set(current)
                  if (next.has(currentQuestion.attemptQuestionId)) {
                    next.delete(currentQuestion.attemptQuestionId)
                  } else {
                    next.add(currentQuestion.attemptQuestionId)
                  }
                  return next
                })
              }
              aria-pressed={flagged.has(currentQuestion.attemptQuestionId)}
            >
              <FlagIcon
                className={cn(
                  flagged.has(currentQuestion.attemptQuestionId) &&
                    "fill-amber-400 text-amber-500"
                )}
                aria-hidden="true"
              />
              {flagged.has(currentQuestion.attemptQuestionId)
                ? "Flagged"
                : "Flag for review"}
            </Button>
          ) : null}
          <span className="hidden text-sm text-muted-foreground sm:block">
            {currentIndex + 1} / {questions.length}
          </span>
        </div>

        {currentIndex === questions.length - 1 ? (
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
                Math.min(questions.length - 1, index + 1)
              )
            }
          >
            Next
            <ChevronRightIcon aria-hidden="true" />
          </Button>
        )}
      </footer>

      <AlertDialog open={leaveOpen} onOpenChange={setLeaveOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Leave this attempt?</AlertDialogTitle>
            <AlertDialogDescription>
              You have answered {answeredIds.size} of {questions.length}{" "}
              question(s)
              {flagged.size > 0 ? `, with ${flagged.size} flagged` : ""}. Your
              saved drafts stay on the server — you can resume this attempt
              later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Taking Assessment</AlertDialogCancel>
            <AlertDialogAction onClick={() => navigate(-1)}>
              Leave Attempt
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={finishOpen} onOpenChange={setFinishOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Submit assessment?</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-2 text-sm">
                <dl className="grid grid-cols-2 gap-x-4 gap-y-1">
                  <dt className="text-muted-foreground">Total items</dt>
                  <dd className="text-right tabular-nums">
                    {questions.length}
                  </dd>
                  <dt className="text-muted-foreground">Answered</dt>
                  <dd className="text-right tabular-nums">
                    {answeredIds.size}
                  </dd>
                  <dt className="text-muted-foreground">Unanswered</dt>
                  <dd className="text-right tabular-nums">
                    {questions.length - answeredIds.size}
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
                {questions.length - answeredIds.size > 0 ? (
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
              {submitMutation.isPending ? "Submitting..." : "Submit Assessment"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
