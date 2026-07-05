import { useMemo } from "react"
import { Link, useOutletContext, useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { ArrowLeft, TargetIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  EnterpriseEmptyState,
  EnterpriseErrorState,
  EnterpriseLoadingSkeleton,
  EnterprisePageHeader,
  EnterpriseStatusBadge,
  formatDate,
} from "@/components/enterprise/enterprise-ui.jsx"
import {
  getLearnerDisplayName,
  useEnterpriseData,
} from "@/hooks/use-enterprise-data.js"
import { base } from "@/services/base"

function useLearnerInsights(learnerId, enabled) {
  const weakAreasQuery = useQuery({
    queryKey: ["weak-areas"],
    queryFn: () => base("weak-areas"),
    enabled,
    retry: 1,
  })
  const masteryQuery = useQuery({
    queryKey: ["learner-lesson-mastery"],
    queryFn: () => base("learner-lesson-mastery"),
    enabled,
    retry: 1,
  })
  const resultsQuery = useQuery({
    queryKey: ["exam-results"],
    queryFn: () => base("exam-results"),
    enabled,
    retry: 1,
  })

  return useMemo(() => {
    const idNum = Number(learnerId)
    const filterByLearner = (list) =>
      (Array.isArray(list) ? list : []).filter(
        (item) => Number(item.learnerId) === idNum
      )
    return {
      weakAreas: filterByLearner(weakAreasQuery.data),
      mastery: filterByLearner(masteryQuery.data),
      results: filterByLearner(resultsQuery.data),
      isLoading:
        weakAreasQuery.isLoading ||
        masteryQuery.isLoading ||
        resultsQuery.isLoading,
    }
  }, [learnerId, weakAreasQuery, masteryQuery, resultsQuery])
}

export default function EnterpriseLearnerDetailPage() {
  const { learnerId } = useParams()
  const { enterprise, enterpriseLoading, enterpriseError, refetchEnterprise } =
    useOutletContext()
  const data = useEnterpriseData(enterprise?.enterpriseId)
  const insights = useLearnerInsights(learnerId, enterprise != null)

  const learner = data.learnerById.get(Number(learnerId))
  const assignments = data.assignments.filter(
    (assignment) => Number(assignment.learnerId) === Number(learnerId)
  )

  if (enterpriseLoading || (enterprise && data.isLoading)) {
    return <EnterpriseLoadingSkeleton />
  }
  if (enterpriseError) {
    return <EnterpriseErrorState onRetry={refetchEnterprise} />
  }
  if (!enterprise) {
    return (
      <EnterpriseEmptyState
        title="No organization found"
        description="Learner details appear here once your organization is registered."
      />
    )
  }
  if (data.isError) {
    return <EnterpriseErrorState onRetry={data.refetchAll} />
  }

  if (assignments.length === 0) {
    return (
      <div className="space-y-4">
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link to="/enterprise/learners">
            <ArrowLeft aria-hidden="true" />
            Back to learners
          </Link>
        </Button>
        <EnterpriseEmptyState
          title="Learner not found in your organization"
          description="This learner has no active assignment under your organization's certifications."
        />
      </div>
    )
  }

  const name = getLearnerDisplayName(learner)

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" size="sm" className="-ml-2 w-fit">
        <Link to="/enterprise/learners">
          <ArrowLeft aria-hidden="true" />
          Back to learners
        </Link>
      </Button>

      <EnterprisePageHeader
        title={name}
        subtitle={
          learner?.username ? `@${learner.username}` : `Learner #${learnerId}`
        }
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Assigned certifications</CardTitle>
            <CardDescription>
              Progress in certifications assigned by {enterprise.enterpriseName}.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {assignments.map((assignment) => {
              const orgCert = data.orgCertById.get(assignment.orgCertId)
              const certification = orgCert
                ? data.certificationById.get(orgCert.certificationId)
                : null
              const progress = Number(assignment.progressPercentage ?? 0)
              return (
                <div key={assignment.orgCertLearnerId} className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2 text-sm">
                    <span className="truncate font-medium">
                      {certification?.title ?? "Certification"}
                    </span>
                    <EnterpriseStatusBadge status={assignment.status} />
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={progress} aria-label="Progress" />
                    <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                      {progress.toFixed(0)}%
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Assigned {formatDate(assignment.assignedAt)}
                    {assignment.completedAt
                      ? ` · Completed ${formatDate(assignment.completedAt)}`
                      : ""}
                  </p>
                </div>
              )
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Readiness</CardTitle>
            <CardDescription>
              Readiness and confidence recorded for this learner.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {learner ? (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Readiness score</span>
                  <span className="font-medium tabular-nums">
                    {learner.readinessScore != null
                      ? Number(learner.readinessScore).toFixed(0)
                      : "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Confidence level</span>
                  <span className="font-medium tabular-nums">
                    {learner.confidenceLevel != null
                      ? Number(learner.confidenceLevel).toFixed(0)
                      : "—"}
                  </span>
                </div>
              </>
            ) : (
              <p className="py-4 text-center text-muted-foreground">
                Learner profile details are unavailable.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Weak areas</CardTitle>
            <CardDescription>
              Topics where this learner shows the lowest accuracy.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {insights.weakAreas.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                <TargetIcon
                  className="mx-auto mb-2 size-5"
                  aria-hidden="true"
                />
                No weak-area data recorded yet.
              </div>
            ) : (
              <ul className="space-y-3">
                {insights.weakAreas.slice(0, 6).map((area) => (
                  <li
                    key={`${area.learnerId}-${area.lessonId}`}
                    className="space-y-1"
                  >
                    <div className="flex items-center justify-between text-sm">
                      <span>Lesson #{area.lessonId}</span>
                      <span className="text-muted-foreground">
                        {Math.round((area.accuracyRate ?? 0) * 100)}% accuracy
                      </span>
                    </div>
                    <Progress
                      value={(area.accuracyRate ?? 0) * 100}
                      aria-label="Accuracy"
                    />
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Assessment attempts</CardTitle>
            <CardDescription>Latest recorded exam results.</CardDescription>
          </CardHeader>
          <CardContent>
            {insights.results.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No assessment attempts recorded yet.
              </p>
            ) : (
              <ul className="divide-y">
                {insights.results
                  .slice()
                  .sort((a, b) => new Date(b.takenAt ?? 0) - new Date(a.takenAt ?? 0))
                  .slice(0, 6)
                  .map((result) => (
                    <li
                      key={`${result.learnerId}-${result.examId}-${result.attemptNo}`}
                      className="flex items-center justify-between gap-2 py-2.5 text-sm"
                    >
                      <div>
                        <p className="font-medium">
                          Exam #{result.examId} · Attempt {result.attemptNo}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(result.takenAt)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium tabular-nums">
                          {Number(result.score ?? 0).toFixed(0)}%
                        </p>
                        <p
                          className={
                            result.isPassed
                              ? "text-xs text-primary"
                              : "text-xs text-destructive"
                          }
                        >
                          {result.isPassed ? "Passed" : "Not passed"}
                        </p>
                      </div>
                    </li>
                  ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
