import { useState } from "react"
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CircleAlert,
  CircleChevronLeft,
  Plus,
  X,
} from "lucide-react"
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"
import { toast } from "sonner"

import CertificationCard from "../../components/certifications/certification-card"
import {
  addCertification,
  getAllCertifications,
} from "../../services/certificationService"
import {
  savePhotoCertification,
} from "../../services/fileService"

import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { CertificationSkeletonCard } from "../../components/certifications/certification-skeleton-card"
import CertificationDetails from "../../components/certifications/certification-details"
import CertificationModules from "../../components/certifications/certification-modules"
import { industries } from "@/constants/industries.js"
import {useEffect} from "react"


const TOTAL_STEPS = 2

const emptyCertificationDetails = {
  title: "",
  price: "",
  industry: "",
  description: "",
  imageFile: null,
}

const emptySubmissionDialog = {
  open: false,
  title: "",
  description: "",
}

function validateCertificationDetails(details) {
  const errors = {}

  if (!details.title.trim()) {
    errors.title = "Certification name is required."
  }

  if (
      details.price === "" ||
      Number.isNaN(Number(details.price)) ||
      Number(details.price) < 0
  ) {
    errors.price = "Enter a valid price."
  }

  if (!details.industry.trim()) {
    errors.industry = "Industry is required."
  }

  if (!details.description.trim()) {
    errors.description = "Description is required."
  }

  if (!details.imageFile) {
    errors.imageFile = "Certification cover image is required."
  }

  return errors
}

function isModuleStructureValid(categories) {
  if (!Array.isArray(categories) || categories.length === 0) {
    return false
  }

  return categories.every((majorCategory) => {
    const hasMajorTitle = majorCategory.title.trim().length > 0
    const hasMiddleCategories = majorCategory.middleCategories.length > 0

    const hasValidMiddleCategories = majorCategory.middleCategories.every(
        (middleCategory) => {
          const hasMiddleTitle = middleCategory.title.trim().length > 0
          const hasLessons = middleCategory.lessons.length > 0

          const hasValidLessons = middleCategory.lessons.every(
              (lesson) => lesson.name.trim().length > 0
          )

          return hasMiddleTitle && hasLessons && hasValidLessons
        }
    )

    return hasMajorTitle && hasMiddleCategories && hasValidMiddleCategories
  })
}

function removeModuleUiFields(categories) {
  return categories.map((majorCategory) => ({
    title: majorCategory.title.trim(),

    middleCategory: majorCategory.middleCategories.map((middleCategory) => ({
      title: middleCategory.title.trim(),

      lessons: middleCategory.lessons.map((lesson) => ({
        name: lesson.name.trim(),
        lessonComponentStructure: "[]",
      })),
    })),
  }))
}

function formatLocalDateTime(date = new Date()) {
  const pad = (value) => String(value).padStart(2, "0")

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
      date.getDate()
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
      date.getSeconds()
  )}`
}

function buildImageKey(imageFile) {
  if (!imageFile) {
    return ""
  }

  const safeFileName = imageFile.name
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9._-]/g, "")

  return `certifications/${safeFileName}`
}

function Certifications() {
  const queryClient = useQueryClient()

  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false)
  const [page, setPage] = useState(1)

  const [certificationDetails, setCertificationDetails] = useState(
      emptyCertificationDetails
  )

  const [moduleCategories, setModuleCategories] = useState([])
  const [detailsErrors, setDetailsErrors] = useState({})
  const [submissionError, setSubmissionError] = useState("")

  const [submissionDialog, setSubmissionDialog] = useState(
      emptySubmissionDialog
  )
  const [chosenIndustry, setChosenIndustry] = useState("all")
  const [filteredCertifications, setFilteredCertifications] = useState([])

  useEffect(() => {
    const filter = items.filter((item) => item.industry == chosenIndustry)
    setFilteredCertifications(filter)
  }, [chosenIndustry]);

  const {
    data: items = [],
    isPending: isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["admin-certifications"],
    queryFn: getAllCertifications,
    staleTime: 1000 * 60 * 5,
  })

  const {
    mutateAsync: createCertification,
    isPending: isSubmitting,
  } = useMutation({
    mutationFn: addCertification,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["admin-certifications"],
      })
    },
  })

  const {
    mutateAsync,
    isPending: isUploading,
  } = useMutation({
    mutationKey: ["save-certification-photo"],
    mutationFn: savePhotoCertification,
  })

  const isBusy = isSubmitting || isUploading
  const isFirstStep = page === 1
  const isLastStep = page === TOTAL_STEPS

  const resetCreateCertification = () => {
    setPage(1)
    setCertificationDetails(emptyCertificationDetails)
    setModuleCategories([])
    setDetailsErrors({})
    setSubmissionError("")
    setSubmissionDialog(emptySubmissionDialog)
  }

  const handleDrawerChange = (open) => {
    if (!open && isBusy) {
      return
    }

    setIsCreateDrawerOpen(open)

    if (!open) {
      resetCreateCertification()
    }
  }

  const handleDetailsChange = (nextDetails) => {
    setCertificationDetails(nextDetails)
    setDetailsErrors({})
    setSubmissionError("")
  }

  const handleModuleChange = (nextCategories) => {
    setModuleCategories(nextCategories)
    setSubmissionError("")
  }

  const handlePrevious = () => {
    if (isFirstStep) {
      return
    }

    setSubmissionError("")
    setPage(1)
  }

  const handleNext = () => {
    const errors = validateCertificationDetails(certificationDetails)

    if (Object.keys(errors).length > 0) {
      setDetailsErrors(errors)
      return
    }

    setDetailsErrors({})
    setSubmissionError("")
    setPage(2)
  }

  const handleCreateMiddleExam = () => {}

  const handleCreateCertification = async () => {
    if (!isModuleStructureValid(moduleCategories)) {
      setSubmissionError(
          "Add at least one complete major category, middle category, and lesson."
      )
      return
    }

    const payload = {
      title: certificationDetails.title.trim(),
      description: certificationDetails.description.trim(),
      dateCreated: formatLocalDateTime(),
      price: Number(certificationDetails.price),
      majorCategory: removeModuleUiFields(moduleCategories),
      industry: certificationDetails.industry.trim(),
    }

    try {
      setSubmissionError("")

      const imageKey = await mutateAsync(certificationDetails.imageFile)

      payload.imageKey = imageKey

      const result = await createCertification(payload)

      if (result === false || result?.success === false) {
        throw new Error(
            result?.message || "The server could not create the certification."
        )
      }

      setSubmissionDialog({
        open: true,
        title: "Certification created successfully",
        description:
            "The certification details, categories, middle categories, and lessons were saved successfully.",
      })
      setChosenIndustry(payload.industry)
    } catch (error) {
      const responseData = error?.response?.data

      const apiMessage =
          (typeof responseData === "string" && responseData) ||
          responseData?.message ||
          responseData?.error ||
          error?.message ||
          "Unable to create the certification. Please try again."

      setSubmissionError(apiMessage)

      toast.error("Could not create certification", {
        description: apiMessage,
      })
    }
  }

  const handleMainAction = () => {
    if (isLastStep) {
      handleCreateCertification()
      return
    }

    handleNext()
  }

  const handleExitAfterSubmission = () => {
    setSubmissionDialog(emptySubmissionDialog)
    handleDrawerChange(false)
  }

  if (isLoading) {
    return <CertificationSkeletonCard size={8} />
  }

  if (isError) {
    return (
        <section className="flex h-full flex-col items-center justify-center gap-4">
          <div className="max-w-md text-center">
            <h2 className="text-lg font-semibold text-zinc-950">
              Unable to load certifications
            </h2>

            <p className="mt-2 text-sm text-zinc-500">
              {error?.message || "Something went wrong while loading the data."}
            </p>
          </div>

          <Button onClick={() => refetch()}>Try Again</Button>
        </section>
    )
  }

  return (
    <section className="flex h-full flex-col gap-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-950">
            Active Certifications
          </h1>

          <p className="mt-1 text-sm text-zinc-500">
            Manage the certification reviews available to learners.
          </p>
        </div>

        {isFetching && (
          <span className="pt-2 text-xs text-zinc-400">Updating...</span>
        )}
        <Select
            value={chosenIndustry}
            onValueChange={(value) => {
              setChosenIndustry(value)
            }}
        >
          <SelectTrigger className="h-10 w-[220px] rounded-xl border-zinc-300 bg-white px-4 text-sm">
            <SelectValue placeholder="Filter by industry" />
          </SelectTrigger>

          <SelectContent className="max-h-[280px] overflow-y-auto rounded-xl">
            <SelectGroup>
              <SelectItem value="all">All Industries</SelectItem>

              {industries.map((item) => (
                  <SelectItem
                      key={item}
                      value={item}
                      className="cursor-pointer py-2"
                  >
                    {item}
                  </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {
          chosenIndustry == 'all' ?
              (items.map((item, index) => (
                  <CertificationCard
                      key={item.id ?? item.certificationId ?? index}
                      item={item}
                      index={index}
                      certification={item}
                  />))):
          filteredCertifications.map((item, index) => (
          <CertificationCard
            key={item.id ?? item.certificationId ?? index}
            item={item}
            index={index}
            certification={item}
          />
        ))}

        <Drawer
          direction="right"
          open={isCreateDrawerOpen}
          onOpenChange={handleDrawerChange}
        >
          <DrawerTrigger asChild>
            <button
              type="button"
              className="group flex h-[380px] w-full flex-col items-center justify-center rounded-[32px] border-2 border-dashed border-zinc-800 bg-zinc-50 p-6 text-center transition-all duration-200 hover:border-zinc-950 hover:bg-zinc-100 focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 focus:outline-none"
            >
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-zinc-300 bg-white transition-transform duration-200 group-hover:scale-110">
                <Plus className="h-6 w-6 text-zinc-900" strokeWidth={1.8} />
              </div>

              <span className="text-base font-medium text-zinc-900">
                Create Certification
              </span>

              <span className="mt-1 max-w-[180px] text-sm text-zinc-500">
                Add a new certification review for learners.
              </span>
            </button>
          </DrawerTrigger>

          <DrawerContent className="fixed top-0 right-0 bottom-auto left-auto flex h-dvh !w-full !max-w-none flex-col rounded-l-3xl rounded-r-none border-l bg-white p-0 sm:!w-[680px] xl:!w-[50vw]">
            <DrawerHeader className="flex flex-row items-center gap-3 border-b px-4 py-5 text-left sm:px-6">
              <DrawerClose asChild>
                <button
                  type="button"
                  aria-label="Close drawer"
                  disabled={isBusy}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-950 focus:ring-2 focus:ring-zinc-900 focus:outline-none disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <CircleChevronLeft className="h-7 w-7" />
                </button>
              </DrawerClose>

              <div className="min-w-0 flex-1">
                <DrawerTitle className="text-lg font-semibold text-zinc-950">
                  Create Certification
                </DrawerTitle>
              </div>
            </DrawerHeader>

            <div className="flex-1 overflow-y-auto">
              <div className="w-full px-4 py-5 sm:px-6">
                {page === 1 ? (
                  <CertificationDetails
                    value={certificationDetails}
                    onChange={handleDetailsChange}
                    errors={detailsErrors}
                  />
                ) : (
                  <CertificationModules
                    value={moduleCategories}
                    onChange={handleModuleChange}
                    onCreateMiddleExam={handleCreateMiddleExam}
                  />
                )}
              </div>
            </div>

            <DrawerFooter className="border-t bg-white px-4 py-4 sm:px-6">
              <div className="w-full">
                {submissionError && (
                  <Alert
                    variant="destructive"
                    className="relative mb-3 border-red-200 bg-red-50 pr-12 text-red-700"
                  >
                    <CircleAlert className="h-4 w-4" />

                    <AlertTitle>Cannot create certification</AlertTitle>

                    <AlertDescription>{submissionError}</AlertDescription>

                    <button
                      type="button"
                      onClick={() => setSubmissionError("")}
                      aria-label="Dismiss alert"
                      className="absolute top-3 right-3 rounded-md p-1 text-red-500 transition hover:bg-red-100 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </Alert>
                )}

                <div className="flex items-center justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={isFirstStep || isBusy}
                    className="min-w-[118px] gap-2 rounded-xl border-zinc-300 text-zinc-700 hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Previous
                  </Button>

                  <Button
                    type="button"
                    onClick={handleMainAction}
                    disabled={isBusy}
                    className="min-w-[150px] gap-2 rounded-xl bg-zinc-950 text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isBusy ? (
                      "Creating"
                    ) : isLastStep ? (
                      "Create Certification"
                    ) : (
                      <>
                        Next
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </DrawerFooter>
          </DrawerContent>

          <AlertDialog
            open={submissionDialog.open}
            onOpenChange={(open) => {
              setSubmissionDialog((previous) => ({
                ...previous,
                open,
              }))
            }}
          >
            <AlertDialogContent className="max-w-md rounded-2xl">
              <AlertDialogHeader>
                <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <CheckCircle2 className="h-6 w-6" />
                </div>

                <AlertDialogTitle>{submissionDialog.title}</AlertDialogTitle>

                <AlertDialogDescription className="leading-6">
                  {submissionDialog.description}
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter className="mt-3">
                <AlertDialogAction
                  onClick={handleExitAfterSubmission}
                  className="rounded-xl bg-zinc-950 text-white hover:bg-zinc-800"
                >
                  Close & Exit
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </Drawer>
      </div>
    </section>
  )
}

export default Certifications
