import { useMemo, useState } from "react"
import { useNavigate, useOutletContext, useParams } from "react-router-dom"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Clock3,
  Languages,
  Layers3,
  LockKeyhole,
  Target,
  PlayCircle
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

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"

import { LearnerEmptyState } from "@/components/learner/learner-ui.jsx"

import { getFileViewUrl } from "@/services/fileService.js"
import { getCertificationModules } from "@/services/learnerService.js"

import {
  confirmPurchase,
  getExamTypes,
  getExams,
  getLearnerEnrollments,
  purchaseCertification,
} from "@/services/assessmentService.js"

const DEFAULT_IMAGE =
    "https://www.eclosio.ong/wp-content/uploads/2018/08/default.png"

function formatCurrency(value) {
  const amount = Number(value ?? 0)

  if (!Number.isFinite(amount) || amount <= 0) {
    return "Free"
  }

  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

function getCertificationImageUrl(certification) {
  if (!certification?.imageKey) {
    return DEFAULT_IMAGE
  }

  try {
    return getFileViewUrl(certification.imageKey) || DEFAULT_IMAGE
  } catch {
    return DEFAULT_IMAGE
  }
}

function getLessonDurationMinutes(lesson) {
  const possibleValues = [
    lesson?.durationMinutes,
    lesson?.estimatedMinutes,
    lesson?.minutes,
    lesson?.duration,
  ]

  for (const value of possibleValues) {
    const parsedValue = Number(value)

    if (Number.isFinite(parsedValue) && parsedValue > 0) {
      return parsedValue
    }
  }

  return 0
}

function formatDuration(minutes) {
  const safeMinutes = Number(minutes ?? 0)

  if (!Number.isFinite(safeMinutes) || safeMinutes <= 0) {
    return "Self-paced"
  }

  const hours = Math.floor(safeMinutes / 60)
  const remainingMinutes = safeMinutes % 60

  if (hours <= 0) {
    return `${remainingMinutes} min`
  }

  if (remainingMinutes === 0) {
    return `${hours} hr`
  }

  return `${hours} hr ${remainingMinutes} min`
}

function buildChapters(modules) {
  return modules.flatMap((major, majorIndex) =>
      (major.middleCategory ?? []).map((middle, middleIndex) => ({
        id:
            middle.middleCategoryId ??
            `${major.majorCategoryId ?? majorIndex}-${middleIndex}`,
        majorTitle: major.title ?? "Module",
        title: middle.title ?? "Untitled Chapter",
        lessons: middle.lessons ?? [],
      }))
  )
}

function ProductMetaItem({ icon: Icon, children }) {
  return (
      <div className="flex min-w-0 items-center gap-3 text-sm text-foreground">
        <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
        <span className="min-w-0 font-medium break-words [overflow-wrap:anywhere]">
        {children}
      </span>
      </div>
  )
}

function ProductFeature({ children }) {
  return (
      <div className="flex min-w-0 items-start gap-3">
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
        <p className="min-w-0 break-words text-sm leading-6 text-foreground [overflow-wrap:anywhere]">
          {children}
        </p>
      </div>
  )
}

export default function LearnerCertificationDetailPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { certificationId } = useParams()

  const outletContext = useOutletContext()
  const data = outletContext?.data ?? {}

  const learnerId = data.learnerId ?? null
  const certifications = data.certifications ?? []
  const enrolledCertifications = data.enrolledCertifications ?? []
  const completedLessonItems = data.completedLessons ?? []
  const learnerLessons = data.lessons ?? []

  const [pendingPurchase, setPendingPurchase] = useState(null)

  const enrollmentsQuery = useQuery({
    queryKey: ["learner-enrollments", learnerId],
    queryFn: () => getLearnerEnrollments(learnerId),
    enabled: learnerId != null,
    retry: 1,
  })

  const enrollment = useMemo(() => {
    const enrollmentList = Array.isArray(enrollmentsQuery.data)
        ? enrollmentsQuery.data
        : []

    return (
        enrollmentList.find(
            (item) =>
                String(item.certificationId) === String(certificationId) &&
                item.status === "ACTIVE"
        ) ?? null
    )
  }, [enrollmentsQuery.data, certificationId])

  const examsQuery = useQuery({
    queryKey: ["exams"],
    queryFn: getExams,
  })

  const examTypesQuery = useQuery({
    queryKey: ["exam-types"],
    queryFn: getExamTypes,
  })

  const publishedDiagnostic = useMemo(() => {
    const typeById = new Map(
        (Array.isArray(examTypesQuery.data) ? examTypesQuery.data : []).map(
            (type) => [type.examTypeId, type.examTypeText]
        )
    )

    return (
        (Array.isArray(examsQuery.data) ? examsQuery.data : []).find(
            (exam) =>
                String(exam.certificationId) === String(certificationId) &&
                exam.status === "PUBLISHED" &&
                typeById.get(exam.examTypeId) === "DIAGNOSTIC"
        ) ?? null
    )
  }, [certificationId, examsQuery.data, examTypesQuery.data])

  const purchaseMutation = useMutation({
    mutationFn: () =>
        purchaseCertification(certificationId, learnerId, crypto.randomUUID()),

    onSuccess: (transaction) => {
      if (transaction.requiresPayment) {
        setPendingPurchase(transaction)
        return
      }

      queryClient.invalidateQueries({
        queryKey: ["learner-enrollments"],
      })
      queryClient.invalidateQueries({
        queryKey: ["learner-portal-data"],
      })

      toast.success("You are now enrolled in this certification.")
    },

    onError: (error) => {
      toast.error(
          error?.response?.data?.message ??
          "The enrollment could not be completed. Please try again."
      )
    },
  })

  const confirmMutation = useMutation({
    mutationFn: () =>
        confirmPurchase(
            pendingPurchase.transactionId,
            learnerId,
            `SIM-${pendingPurchase.transactionReference}`
        ),

    onSuccess: () => {
      setPendingPurchase(null)

      queryClient.invalidateQueries({
        queryKey: ["learner-enrollments"],
      })
      queryClient.invalidateQueries({
        queryKey: ["learner-portal-data"],
      })

      toast.success("Payment verified. You are now enrolled.")
    },

    onError: (error) => {
      toast.error(
          error?.response?.data?.message ??
          "The payment could not be verified. Please try again."
      )
    },
  })

  const certification =
      certifications.find(
          (item) => String(item.certificationId) === String(certificationId)
      ) ??
      enrolledCertifications.find(
          (item) => String(item.certificationId) === String(certificationId)
      )

  if (!certification) {
    return (
        <LearnerEmptyState
            icon={BookOpen}
            title="Certification not found"
            description="The requested certification is not available from the backend."
            action={
              <Button onClick={() => navigate("/learner/learning")}>
                Go to My Learning
              </Button>
            }
        />
    )
  }

  const enrolled =
      enrollment != null ||
      enrolledCertifications.some(
          (item) => String(item.certificationId) === String(certificationId)
      )

  const diagnosticRequired =
      enrolled &&
      publishedDiagnostic != null &&
      !enrollment?.diagnosticCompletedAt

  const modules = getCertificationModules(certification) ?? []

  const lessons = learnerLessons.filter(
      (lesson) => String(lesson.certificationId) === String(certificationId)
  )

  const allLessons = modules.flatMap((major) =>
      (major.middleCategory ?? []).flatMap((middle) => middle.lessons ?? [])
  )

  const chapters = buildChapters(modules)

  function isLessonCompleted(lesson) {
    return (
        Boolean(lesson.completed) ||
        completedLessonItems.some(
            (item) => String(item.lessonId) === String(lesson.lessonId)
        )
    )
  }

  const completedLessonCount = lessons.filter(isLessonCompleted).length

  const progress =
      lessons.length > 0
          ? Math.round((completedLessonCount / lessons.length) * 100)
          : 0

  const imageUrl = getCertificationImageUrl(certification)

  const sectionCount = chapters.length
  const lessonCount = allLessons.length

  const totalMinutes = allLessons.reduce(
      (total, lesson) => total + getLessonDurationMinutes(lesson),
      0
  )

  const primaryButtonLabel = enrolled
      ? diagnosticRequired
          ? "Start Diagnostic"
          : "Continue Learning"
      : learnerId == null
          ? "Sign In to Start"
          : purchaseMutation.isPending
              ? "Processing..."
              : "Start Learning"

  const primaryActionDisabled = purchaseMutation.isPending

  function handlePrimaryAction() {
    if (enrolled) {
      if (diagnosticRequired && publishedDiagnostic) {
        navigate(`/learner/assessments/${publishedDiagnostic.examId}`)
        return
      }

      navigate(`/learner/learning/${certificationId}`)
      return
    }

    if (learnerId == null) {
      toast.info("Sign in to enroll in this certification.")
      navigate("/login")
      return
    }

    purchaseMutation.mutate()
  }

  return (
      <div className="w-full min-w-0 pb-16">
        <div className="mx-auto w-full max-w-[1280px]">

          {/* Breadcrumb / Back Navigation */}
          <div className="py-6">
            <Button
                type="button"
                variant="link"
                className="h-auto p-0 text-muted-foreground hover:text-primary"
                onClick={() => navigate("/learner/learning")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to My Learning
            </Button>
          </div>

          <main className="grid min-w-0 items-start gap-10 lg:grid-cols-[minmax(0,1.8fr)_minmax(380px,1fr)]">

            {/* LEFT COLUMN - Product Showcase */}
            <div className="flex flex-col space-y-10 min-w-0">

              {/* Product Header */}
              <div className="space-y-4">
                <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                  {certification.industry || "Certification Program"}
                </Badge>
                <h1 className="max-w-full break-words text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl [overflow-wrap:anywhere]">
                  {certification.title}
                </h1>
                <p className="max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                  {certification.description || "A comprehensive certification review designed to build your expertise, prepare you for the examination, and accelerate your career."}
                </p>
              </div>

              {/* Hero Image */}
              <div className="overflow-hidden rounded-2xl border bg-muted shadow-sm">
                <img
                    src={imageUrl}
                    alt={certification.title}
                    className="aspect-video w-full object-cover"
                    onError={(event) => {
                      event.currentTarget.onerror = null
                      event.currentTarget.src = DEFAULT_IMAGE
                    }}
                />
              </div>

              {/* What You'll Learn (Features) */}
              <div className="rounded-xl border bg-card p-6 sm:p-8 shadow-sm">
                <h2 className="mb-6 text-xl font-bold">What you'll learn</h2>
                <div className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
                  <ProductFeature>
                    A structured diagnostic assessment to pinpoint your learning gaps immediately.
                  </ProductFeature>
                  <ProductFeature>
                    Step-by-step organized lessons grouped by highly relevant modules.
                  </ProductFeature>
                  <ProductFeature>
                    Self-paced study materials letting you review complex course materials on your schedule.
                  </ProductFeature>
                  <ProductFeature>
                    Comprehensive progress tracking tailored to your personal learner dashboard.
                  </ProductFeature>
                </div>
              </div>

              {/* Course Curriculum */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold">Course Content</h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {sectionCount} sections • {lessonCount} lessons • {formatDuration(totalMinutes)} total length
                  </p>
                </div>

                {chapters.length === 0 ? (
                    <LearnerEmptyState
                        icon={BookOpen}
                        title="No curriculum available"
                        description="This certification does not have modules or lessons yet."
                    />
                ) : (
                    <Accordion
                        type="multiple"
                        defaultValue={chapters[0] ? [String(chapters[0].id)] : []}
                        className="space-y-4"
                    >
                      {chapters.map((chapter, index) => {
                        const chapterMinutes = chapter.lessons.reduce(
                            (total, lesson) => total + getLessonDurationMinutes(lesson), 0
                        )

                        return (
                            <AccordionItem
                                key={chapter.id}
                                value={String(chapter.id)}
                                className="overflow-hidden rounded-xl border bg-card px-2"
                            >
                              <AccordionTrigger className="px-4 py-5 hover:no-underline hover:bg-muted/50 rounded-lg transition-colors">
                                <div className="flex flex-col items-start text-left">
                                  <span className="font-semibold text-foreground">
                                    Section {index + 1}: {chapter.title}
                                  </span>
                                  <span className="mt-1 text-sm font-normal text-muted-foreground">
                                    {chapter.lessons.length} lessons • {formatDuration(chapterMinutes)}
                                  </span>
                                </div>
                              </AccordionTrigger>
                              <AccordionContent className="pt-2 pb-4">
                                <div className="space-y-1">
                                  {chapter.lessons.map((lesson) => {
                                    const unlocked = enrolled && !diagnosticRequired
                                    const completed = isLessonCompleted(lesson)

                                    return (
                                        <div
                                            key={lesson.lessonId}
                                            className="flex items-center justify-between gap-4 rounded-md px-4 py-3 hover:bg-muted/50"
                                        >
                                          <div className="flex items-start gap-3 min-w-0">
                                            <PlayCircle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                                            <div className="min-w-0 flex flex-col">
                                              <span className="truncate text-sm font-medium text-foreground">
                                                {lesson.name}
                                              </span>
                                              {completed && (
                                                  <span className="text-xs text-green-600 font-medium">Completed</span>
                                              )}
                                            </div>
                                          </div>
                                          <span className="shrink-0 text-xs text-muted-foreground">
                                            {getLessonDurationMinutes(lesson) > 0
                                                ? formatDuration(getLessonDurationMinutes(lesson))
                                                : "Self-paced"}
                                          </span>
                                        </div>
                                    )
                                  })}
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                        )
                      })}
                    </Accordion>
                )}
              </div>
            </div>

            {/* RIGHT COLUMN - Sticky Buy Box */}
            <aside className="min-w-0 self-start lg:sticky lg:top-6 lg:h-fit">
              <Card className="overflow-hidden border shadow-lg">
                <CardHeader className="bg-muted/30 pb-4">
                  <div className="flex flex-col space-y-1">
                    <span className="text-sm font-medium text-muted-foreground">
                      {enrolled ? "Enrollment Status" : "Total Price"}
                    </span>
                    <span className="text-4xl font-extrabold tracking-tight text-foreground">
                      {enrolled ? "Enrolled" : formatCurrency(price)}
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6 pt-6">

                  {enrolled && (
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm font-medium">
                          <span>Your Progress</span>
                          <span>{progress}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                        <p className="text-xs text-muted-foreground">
                          {completedLessonCount} of {lessons.length} lessons completed
                        </p>
                      </div>
                  )}

                  <div className="space-y-3">
                    <Button
                        type="button"
                        size="lg"
                        className="w-full text-base font-bold h-14"
                        onClick={handlePrimaryAction}
                        disabled={primaryActionDisabled}
                    >
                      {primaryButtonLabel}
                    </Button>
                    {!enrolled && price > 0 && (
                        <p className="text-center text-xs text-muted-foreground">
                          30-Day Money-Back Guarantee
                        </p>
                    )}
                  </div>

                  {diagnosticRequired && (
                      <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-950/30">
                        <Target className="h-4 w-4 text-amber-600" />
                        <AlertTitle className="text-amber-800 dark:text-amber-300">Diagnostic Required</AlertTitle>
                        <AlertDescription className="text-amber-700 dark:text-amber-400">
                          Complete the diagnostic assessment to unlock your personalized learning path.
                        </AlertDescription>
                      </Alert>
                  )}

                  {publishedDiagnostic && !enrolled && (
                      <Alert>
                        <LockKeyhole className="h-4 w-4" />
                        <AlertTitle>Diagnostic Assessment</AlertTitle>
                        <AlertDescription>
                          A mandatory diagnostic test is required post-enrollment.
                        </AlertDescription>
                      </Alert>
                  )}

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-semibold text-foreground">This course includes:</h4>
                    <ProductMetaItem icon={Clock3}>
                      {formatDuration(totalMinutes)} on-demand video
                    </ProductMetaItem>
                    <ProductMetaItem icon={Layers3}>
                      {sectionCount} distinct learning modules
                    </ProductMetaItem>
                    <ProductMetaItem icon={BookOpen}>
                      {lessonCount} comprehensive lessons
                    </ProductMetaItem>
                    <ProductMetaItem icon={Languages}>
                      English language support
                    </ProductMetaItem>
                  </div>
                </CardContent>
              </Card>

              {/* Auxiliary Info Card */}
              <Card className="mt-6 border shadow-sm">
                <CardContent className="p-6 space-y-4">
                  <h4 className="font-semibold text-foreground">Course Requirements</h4>
                  <ul className="list-inside list-disc text-sm text-muted-foreground space-y-2">
                    <li>No prior experience required.</li>
                    <li>A stable internet connection.</li>
                    <li>Willingness to learn and complete the diagnostic.</li>
                  </ul>
                </CardContent>
              </Card>
            </aside>
          </main>

          {/* Checkout Simulation Dialog */}
          <AlertDialog
              open={pendingPurchase != null}
              onOpenChange={(open) => {
                if (!open) setPendingPurchase(null)
              }}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Simulated Checkout</AlertDialogTitle>
                <AlertDialogDescription>
                  This is a development-mode payment simulation. No actual payment
                  will be charged. Order{" "}
                  <span className="font-mono text-foreground">{pendingPurchase?.transactionReference}</span> totals{" "}
                  <span className="font-bold text-foreground">{formatCurrency(pendingPurchase?.amount ?? 0)}</span>.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={confirmMutation.isPending}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                    onClick={(event) => {
                      event.preventDefault()
                      confirmMutation.mutate()
                    }}
                    disabled={confirmMutation.isPending}
                >
                  {confirmMutation.isPending
                      ? "Verifying..."
                      : "Pay with Simulated Checkout"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

        </div>
      </div>
  )
}
