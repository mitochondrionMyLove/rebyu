import { useMemo } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import {
  ArrowLeftIcon,
  CheckCircle2Icon,
  ClockIcon,
  XCircleIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import CodeMirrorProgrammingWorkspace from "@/components/assessments/attempt/code-mirror-programming-workspace.jsx"
import {
  getAssessmentTypeLabel,
  getExamById,
  getExamResult,
  getExamTypes,
  getLearnerExamDetailsByAttempt,
} from "@/services/assessmentService.js"
import { getQuestions } from "@/services/questionService.js"
import { base } from "@/services/base"

function isChoiceCorrect(choice) {
  return Boolean(choice?.correct ?? choice?.isCorrect)
}

function formatDuration(totalSeconds) {
  if (totalSeconds == null) return "—"
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}m ${seconds}s`
}

function useAttemptAnswers(details) {
  return useQuery({
    queryKey: [
      "attempt-answers",
      details.map((detail) => detail.learnerExamDetailId).join(","),
    ],
    enabled: details.length > 0,
    queryFn: async () => {
      const byDetail = {}
      await Promise.all(
        details.map(async (detail) => {
          const id = detail.learnerExamDetailId
          const [mcq, text, diagram, programming] = await Promise.all([
            base(`learner-mcq-answers/by-detail/${id}`).catch(() => null),
            base(`learner-text-answers/by-detail/${id}`).catch(() => null),
            base(`learner-diagram-answers/by-detail/${id}`).catch(() => null),
            base(`learner-programming-answers/by-detail/${id}`).catch(
              () => null
            ),
          ])
          byDetail[id] = { mcq, text, diagram, programming }
        })
      )
      return byDetail
    },
  })
}

export default function LearnerAssessmentResultPage() {
  const { examResultId } = useParams()
  const navigate = useNavigate()

  // Route param encodes the composite key: learnerId-examId-attemptNo
  const [learnerId, examId, attemptNo] = (examResultId ?? "").split("-")
  const validParams = learnerId && examId && attemptNo

  const resultQuery = useQuery({
    queryKey: ["exam-result", learnerId, examId, attemptNo],
    queryFn: () => getExamResult(learnerId, examId, attemptNo),
    enabled: Boolean(validParams),
    retry: 1,
  })
  const examQuery = useQuery({
    queryKey: ["exam", examId],
    queryFn: () => getExamById(examId),
    enabled: Boolean(examId),
  })
  const examTypesQuery = useQuery({
    queryKey: ["exam-types"],
    queryFn: getExamTypes,
  })
  const detailsQuery = useQuery({
    queryKey: ["attempt-details", learnerId, examId, attemptNo],
    queryFn: () => getLearnerExamDetailsByAttempt(learnerId, examId, attemptNo),
    enabled: Boolean(validParams),
    retry: 1,
  })
  const questionsQuery = useQuery({
    queryKey: ["questions"],
    queryFn: () => getQuestions(),
  })

  const details = Array.isArray(detailsQuery.data) ? detailsQuery.data : []
  const answersQuery = useAttemptAnswers(details)

  const questionById = useMemo(
    () =>
      new Map(
        (Array.isArray(questionsQuery.data) ? questionsQuery.data : []).map(
          (question) => [question.questionId, question]
        )
      ),
    [questionsQuery.data]
  )

  const result = resultQuery.data ?? null
  const exam = examQuery.data ?? null

  if (!validParams) {
    return (
      <div className="flex min-h-dvh items-center justify-center p-6">
        <div className="max-w-md rounded-2xl border bg-card p-8 text-center">
          <p className="font-medium">Result not found</p>
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

  if (resultQuery.isLoading || examQuery.isLoading) {
    return (
      <div className="mx-auto max-w-4xl space-y-4 p-6">
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (resultQuery.isError || !result) {
    return (
      <div className="flex min-h-dvh items-center justify-center p-6">
        <div className="max-w-md rounded-2xl border bg-card p-8 text-center">
          <p className="font-medium">Unable to load this result</p>
          <p className="mt-1 text-sm text-muted-foreground">
            The result may not exist, or the backend is unavailable.
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
  ).find((type) => type.examTypeId === exam?.examTypeId)?.examTypeText

  const score = Number(result.score ?? 0)
  const correctCount = details.filter((detail) => detail.isCorrect).length
  const incorrectCount = details.filter(
    (detail) => detail.isCorrect === false
  ).length

  return (
    <div className="min-h-dvh bg-muted/30">
      <header className="border-b bg-background px-4 py-3">
        <div className="mx-auto flex max-w-4xl items-center gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link to="/learner/progress">
              <ArrowLeftIcon aria-hidden="true" />
              Back to Progress
            </Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl space-y-6 px-4 py-6">
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">
                {getAssessmentTypeLabel(examTypeText)}
              </Badge>
              <Badge variant="outline">Attempt {result.attemptNo}</Badge>
            </div>
            <CardTitle className="text-2xl">
              {exam?.title ?? `Exam #${examId}`}
            </CardTitle>
            <CardDescription className="flex items-center gap-1.5">
              <ClockIcon className="size-3.5" aria-hidden="true" />
              Time used: {formatDuration(result.durationSeconds)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center gap-6">
              <div>
                <p className="text-5xl font-bold tabular-nums">
                  {score.toFixed(0)}%
                </p>
                <p
                  className={cn(
                    "mt-1 flex items-center gap-1.5 text-sm font-medium",
                    result.isPassed ? "text-primary" : "text-destructive"
                  )}
                >
                  {result.isPassed ? (
                    <>
                      <CheckCircle2Icon className="size-4" aria-hidden="true" />
                      Passed
                    </>
                  ) : (
                    <>
                      <XCircleIcon className="size-4" aria-hidden="true" />
                      Not passed
                    </>
                  )}
                </p>
              </div>
              <dl className="grid flex-1 grid-cols-2 gap-x-6 gap-y-1.5 text-sm sm:grid-cols-4">
                <div>
                  <dt className="text-muted-foreground">Passing score</dt>
                  <dd className="font-medium tabular-nums">
                    {exam?.passingScore != null
                      ? `${Number(exam.passingScore).toFixed(0)}%`
                      : "Not set"}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Correct</dt>
                  <dd className="font-medium tabular-nums">{correctCount}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">
                    Incorrect / ungraded
                  </dt>
                  <dd className="font-medium tabular-nums">
                    {incorrectCount}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Items recorded</dt>
                  <dd className="font-medium tabular-nums">
                    {details.length}
                  </dd>
                </div>
              </dl>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Multiple-choice items are scored automatically. Written, diagram,
              and code responses are stored for review and are not
              auto-scored.
            </p>
          </CardContent>
        </Card>

        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <Link to={`/learner/assessments/${examId}`}>Retake Assessment</Link>
          </Button>
          <Button asChild>
            <Link to="/learner/learning">Continue Learning</Link>
          </Button>
        </div>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Answer review</h2>
          {detailsQuery.isLoading || answersQuery.isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} className="h-24 rounded-xl" />
              ))}
            </div>
          ) : details.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center text-sm text-muted-foreground">
                No per-question details were recorded for this attempt.
              </CardContent>
            </Card>
          ) : (
            <ol className="space-y-3">
              {details.map((detail, index) => {
                const question = questionById.get(detail.questionId)
                const answerSet =
                  answersQuery.data?.[detail.learnerExamDetailId] ?? {}
                const chosenChoice =
                  answerSet.mcq && question
                    ? (question.choices ?? []).find(
                        (choice) => choice.choiceId === answerSet.mcq.choiceId
                      )
                    : null
                const correctChoice = question
                  ? (question.choices ?? []).find(isChoiceCorrect)
                  : null
                return (
                  <li key={detail.learnerExamDetailId}>
                    <Card>
                      <CardContent className="space-y-3 pt-5">
                        <div className="flex items-start justify-between gap-3">
                          <p className="text-sm font-medium leading-6">
                            <span className="mr-1.5 text-muted-foreground">
                              {index + 1}.
                            </span>
                            {question?.questionText ??
                              `Question #${detail.questionId}`}
                          </p>
                          {question?.questionType === "MULTIPLE_CHOICE" ? (
                            detail.isCorrect ? (
                              <Badge className="shrink-0">Correct</Badge>
                            ) : (
                              <Badge
                                variant="destructive"
                                className="shrink-0"
                              >
                                Incorrect
                              </Badge>
                            )
                          ) : (
                            <Badge variant="secondary" className="shrink-0">
                              For review
                            </Badge>
                          )}
                        </div>

                        {chosenChoice ? (
                          <div className="space-y-1 text-sm">
                            <p>
                              <span className="text-muted-foreground">
                                Your answer:{" "}
                              </span>
                              {chosenChoice.choiceText}
                            </p>
                            {!detail.isCorrect && correctChoice ? (
                              <p>
                                <span className="text-muted-foreground">
                                  Correct answer:{" "}
                                </span>
                                {correctChoice.choiceText}
                              </p>
                            ) : null}
                            {(detail.isCorrect
                              ? chosenChoice
                              : correctChoice
                            )?.explanation ? (
                              <p className="rounded-lg bg-muted/50 p-2.5 text-muted-foreground">
                                {
                                  (detail.isCorrect
                                    ? chosenChoice
                                    : correctChoice
                                  ).explanation
                                }
                              </p>
                            ) : null}
                          </div>
                        ) : null}

                        {answerSet.text ? (
                          <div className="text-sm">
                            <p className="text-muted-foreground">
                              Your answer:
                            </p>
                            <p className="mt-1 whitespace-pre-wrap rounded-lg bg-muted/50 p-2.5">
                              {answerSet.text.answerText}
                            </p>
                          </div>
                        ) : null}

                        {answerSet.programming ? (
                          <div className="text-sm">
                            <p className="mb-2 text-muted-foreground">
                              Your code (
                              {answerSet.programming.programmingLanguage}):
                            </p>
                            <div className="h-64">
                              <CodeMirrorProgrammingWorkspace
                                value={answerSet.programming.submittedCode}
                                language={
                                  answerSet.programming.programmingLanguage
                                }
                                readOnly
                              />
                            </div>
                          </div>
                        ) : null}

                        {answerSet.diagram ? (
                          <p className="text-sm text-muted-foreground">
                            A diagram answer was submitted and stored for
                            review.
                          </p>
                        ) : null}

                        {!chosenChoice &&
                        !answerSet.text &&
                        !answerSet.programming &&
                        !answerSet.diagram ? (
                          <p className="text-sm text-muted-foreground">
                            No answer was recorded for this item.
                          </p>
                        ) : null}
                      </CardContent>
                    </Card>
                  </li>
                )
              })}
            </ol>
          )}
        </section>
      </main>
    </div>
  )
}
