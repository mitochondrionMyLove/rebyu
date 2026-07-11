import { Link, useNavigate, useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import {
  ArrowLeftIcon,
  CheckCircle2Icon,
  ClockIcon,
  HourglassIcon,
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
import PerformanceBreakdown from "@/components/assessments/attempt/performance-breakdown.jsx"
import { getCurrentLearnerIdentity } from "@/services/learnerService.js"
import {
  getAssessmentTypeLabel,
  getAttemptResult,
} from "@/services/assessmentService.js"
import { base } from "@/services/base"

function formatDuration(totalSeconds) {
  if (totalSeconds == null) return "—"
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}m ${seconds}s`
}

export default function LearnerAssessmentResultPage() {
  // Route param carries the server attempt id.
  const { examResultId: attemptId } = useParams()
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
    (Array.isArray(learnersQuery.data)
      ? learnersQuery.data[0]?.learnerId
      : null) ??
    null

  const resultQuery = useQuery({
    queryKey: ["attempt-result", attemptId, learnerId],
    queryFn: () => getAttemptResult(attemptId, learnerId),
    enabled: attemptId != null && learnerId != null,
    retry: 1,
  })

  if (resultQuery.isLoading || (learnerId == null && learnersQuery.isLoading)) {
    return (
      <div className="mx-auto max-w-4xl space-y-4 p-6">
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  const result = resultQuery.data
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

  const percentage = Number(result.percentage ?? 0)

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
                {getAssessmentTypeLabel(result.assessmentType)}
              </Badge>
              <Badge variant="outline">Attempt {result.attemptNumber}</Badge>
            </div>
            <CardTitle className="text-2xl">{result.assessmentTitle}</CardTitle>
            <CardDescription className="flex items-center gap-1.5">
              <ClockIcon className="size-3.5" aria-hidden="true" />
              Time used: {formatDuration(result.durationSeconds)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center gap-6">
              <div>
                <p className="text-5xl font-bold tabular-nums">
                  {percentage.toFixed(0)}%
                </p>
                <p
                  className={cn(
                    "mt-1 flex items-center gap-1.5 text-sm font-medium",
                    result.passed ? "text-primary" : "text-destructive"
                  )}
                >
                  {result.passed ? (
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
                    {result.passingScore != null
                      ? `${Number(result.passingScore).toFixed(0)}%`
                      : "Not set"}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Correct</dt>
                  <dd className="font-medium tabular-nums">
                    {result.correctCount}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Incorrect</dt>
                  <dd className="font-medium tabular-nums">
                    {result.incorrectCount}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Pending review</dt>
                  <dd className="font-medium tabular-nums">
                    {result.pendingCount}
                  </dd>
                </div>
              </dl>
            </div>
            {result.pendingCount > 0 ? (
              <p className="mt-4 flex items-center gap-1.5 rounded-lg bg-muted/60 p-3 text-xs text-muted-foreground">
                <HourglassIcon className="size-3.5 shrink-0" aria-hidden="true" />
                {result.pendingCount} written, code, or diagram response(s)
                await manual evaluation and are not included in the automatic
                score yet.
              </p>
            ) : null}
          </CardContent>
        </Card>

        {result.assessmentType === "DIAGNOSTIC" ? (
          <div className="flex items-start gap-2 rounded-xl border border-primary/40 bg-primary/5 p-3 text-sm">
            <CheckCircle2Icon
              className="mt-0.5 size-4 shrink-0 text-primary"
              aria-hidden="true"
            />
            <p>
              You've completed the diagnostic — your lesson content is now
              unlocked. Focus first on the recommended review topics below.
            </p>
          </div>
        ) : null}

        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <Link to={`/learner/assessments/${result.assessmentId}`}>
              Retake Assessment
            </Link>
          </Button>
          <Button asChild>
            <Link to="/learner/learning">Continue Learning</Link>
          </Button>
        </div>

        <PerformanceBreakdown
          lessonBreakdown={result.lessonBreakdown}
          assessmentType={result.assessmentType}
        />

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Answer review</h2>
          <ol className="space-y-3">
            {(result.answers ?? []).map((answer) => (
              <li key={answer.attemptQuestionId}>
                <Card>
                  <CardContent className="space-y-3 pt-5">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm font-medium leading-6">
                        <span className="mr-1.5 text-muted-foreground">
                          {answer.displayOrder}.
                        </span>
                        {answer.question}
                      </p>
                      {answer.pendingManualEvaluation ? (
                        <Badge variant="secondary" className="shrink-0">
                          Pending review
                        </Badge>
                      ) : answer.isCorrect == null ? (
                        <Badge variant="outline" className="shrink-0">
                          Unanswered
                        </Badge>
                      ) : answer.isCorrect ? (
                        <Badge className="shrink-0">Correct</Badge>
                      ) : (
                        <Badge variant="destructive" className="shrink-0">
                          Incorrect
                        </Badge>
                      )}
                    </div>

                    {answer.selectedChoiceText ? (
                      <div className="space-y-1 text-sm">
                        <p>
                          <span className="text-muted-foreground">
                            Your answer:{" "}
                          </span>
                          {answer.selectedChoiceText}
                        </p>
                        {answer.isCorrect === false && answer.correctChoiceText ? (
                          <p>
                            <span className="text-muted-foreground">
                              Correct answer:{" "}
                            </span>
                            {answer.correctChoiceText}
                          </p>
                        ) : null}
                        {answer.explanation ? (
                          <p className="rounded-lg bg-muted/50 p-2.5 text-muted-foreground">
                            {answer.explanation}
                          </p>
                        ) : null}
                      </div>
                    ) : null}

                    {answer.learnerAnswer && !answer.selectedChoiceText ? (
                      <div className="text-sm">
                        <p className="text-muted-foreground">Your answer:</p>
                        <p className="mt-1 whitespace-pre-wrap rounded-lg bg-muted/50 p-2.5">
                          {answer.learnerAnswer}
                        </p>
                      </div>
                    ) : null}

                    {answer.submittedCode ? (
                      <div className="text-sm">
                        <p className="mb-2 text-muted-foreground">
                          Your code ({answer.programmingLanguage ?? "code"}):
                        </p>
                        <div className="h-64">
                          <CodeMirrorProgrammingWorkspace
                            value={answer.submittedCode}
                            language={answer.programmingLanguage ?? "Java"}
                            readOnly
                          />
                        </div>
                      </div>
                    ) : null}

                    {answer.diagramSubmitted ? (
                      <p className="text-sm text-muted-foreground">
                        A diagram answer was submitted and stored for review.
                      </p>
                    ) : null}
                  </CardContent>
                </Card>
              </li>
            ))}
          </ol>
        </section>
      </main>
    </div>
  )
}
