import { useEffect, useState } from "react"
import {
    ArrowLeft,
    ArrowRight,
    CheckCircle2,
    CircleAlert,
    CircleChevronLeft,
    X,
} from "lucide-react"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

import {
    addCertification,
    updateCertification,
} from "@/services/certificationService"
import { savePhotoCertification } from "@/services/fileService"

import CertificationDetails from "@/components/certifications/certification-details"
import CertificationModules from "@/components/certifications/certification-modules"

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

const TOTAL_STEPS = 2

const emptySubmissionDialog = {
    open: false,
    title: "",
    description: "",
}

let uiIdCounter = 0

function createUiId(prefix) {
    uiIdCounter += 1

    return `${prefix}-${Date.now()}-${uiIdCounter}`
}

function getCertificationId(certification) {
    return (
        certification?.certificationId ??
        certification?.id ??
        certification?.certification?.certificationId ??
        null
    )
}

function getEmptyDetails() {
    return {
        title: "",
        price: "",
        industry: "",
        description: "",
        imageFile: null,
        existingImageKey: "",
    }
}

function formatLocalDateTime(date = new Date()) {
    const pad = (value) => String(value).padStart(2, "0")

    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
        date.getDate()
    )}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
        date.getSeconds()
    )}`
}

function getLessonComponentStructure(lesson) {
    if (!lesson?.lessonComponentStructure) {
        return "[]"
    }

    if (typeof lesson.lessonComponentStructure === "string") {
        return lesson.lessonComponentStructure
    }

    return JSON.stringify(lesson.lessonComponentStructure)
}

function toDetails(certification) {
    if (!certification) {
        return getEmptyDetails()
    }

    return {
        title: certification.title ?? "",
        price: certification.price ?? "",
        industry: certification.industry ?? "",
        description: certification.description ?? "",
        imageFile: null,
        existingImageKey: certification.imageKey ?? "",
    }
}

function toEditableModuleCategories(certification) {
    const majorCategories =
        certification?.majorCategory ??
        certification?.majorCategories ??
        []

    if (!Array.isArray(majorCategories)) {
        return []
    }

    return majorCategories.map((majorCategory) => {
        const middleCategories =
            majorCategory.middleCategory ??
            majorCategory.middleCategories ??
            []

        return {
            id: createUiId("major"),
            majorCategoryId:
                majorCategory.majorCategoryId ?? majorCategory.id ?? null,
            title: majorCategory.title ?? "",

            middleCategories: middleCategories.map((middleCategory) => {
                const lessons = middleCategory.lessons ?? []

                return {
                    id: createUiId("middle"),
                    middleCategoryId:
                        middleCategory.middleCategoryId ?? middleCategory.id ?? null,
                    title: middleCategory.title ?? "",

                    lessons: lessons.map((lesson) => ({
                        id: createUiId("lesson"),
                        lessonId: lesson.lessonId ?? lesson.id ?? null,
                        name: lesson.name ?? lesson.title ?? "",
                        lessonComponentStructure: getLessonComponentStructure(lesson),
                    })),
                }
            }),
        }
    })
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

    if (!details.imageFile && !details.existingImageKey) {
        errors.imageFile = "Certification cover image is required."
    }

    return errors
}

function isModuleStructureValid(categories) {
    if (!Array.isArray(categories) || categories.length === 0) {
        return false
    }

    return categories.every((majorCategory) => {
        const hasMajorTitle = majorCategory.title?.trim().length > 0

        const middleCategories = majorCategory.middleCategories ?? []

        const hasMiddleCategories = middleCategories.length > 0

        const hasValidMiddleCategories = middleCategories.every(
            (middleCategory) => {
                const hasMiddleTitle = middleCategory.title?.trim().length > 0

                const lessons = middleCategory.lessons ?? []

                const hasLessons = lessons.length > 0

                const hasValidLessons = lessons.every(
                    (lesson) => lesson.name?.trim().length > 0
                )

                return hasMiddleTitle && hasLessons && hasValidLessons
            }
        )

        return hasMajorTitle && hasMiddleCategories && hasValidMiddleCategories
    })
}

function removeModuleUiFields(categories, includeExistingIds = false) {
    return categories.map((majorCategory) => {
        const majorPayload = {
            title: majorCategory.title.trim(),

            middleCategory: (majorCategory.middleCategories ?? []).map(
                (middleCategory) => {
                    const middlePayload = {
                        title: middleCategory.title.trim(),

                        lessons: (middleCategory.lessons ?? []).map((lesson) => {
                            const lessonPayload = {
                                name: lesson.name.trim(),
                                lessonComponentStructure:
                                    lesson.lessonComponentStructure ?? "[]",
                            }

                            if (includeExistingIds && lesson.lessonId != null) {
                                lessonPayload.lessonId = lesson.lessonId
                            }

                            return lessonPayload
                        }),
                    }

                    if (
                        includeExistingIds &&
                        middleCategory.middleCategoryId != null
                    ) {
                        middlePayload.middleCategoryId =
                            middleCategory.middleCategoryId
                    }

                    return middlePayload
                }
            ),
        }

        if (includeExistingIds && majorCategory.majorCategoryId != null) {
            majorPayload.majorCategoryId = majorCategory.majorCategoryId
        }

        return majorPayload
    })
}

function getErrorMessage(error) {
    const responseData = error?.response?.data

    return (
        (typeof responseData === "string" && responseData) ||
        responseData?.message ||
        responseData?.error ||
        error?.message ||
        "Unable to save the certification. Please try again."
    )
}

function getCertificationFromResponse(result) {
    if (!result || typeof result !== "object") {
        return null
    }

    if (result.certification && typeof result.certification === "object") {
        return result.certification
    }

    if (result.data && typeof result.data === "object") {
        return result.data
    }

    if (
        result.certificationId != null ||
        result.id != null ||
        result.title != null
    ) {
        return result
    }

    return null
}

export default function CertificationFormDrawer({
                                                    mode = "create",
                                                    certification = null,
                                                    open,
                                                    onOpenChange,
                                                    onSaved,
                                                    trigger,
                                                    image
                                                }) {
    const isEditing = mode === "edit"
    const certificationId = getCertificationId(certification)

    const [page, setPage] = useState(1)

    const [certificationDetails, setCertificationDetails] = useState(
        getEmptyDetails()
    )

    const [moduleCategories, setModuleCategories] = useState([])
    const [detailsErrors, setDetailsErrors] = useState({})
    const [submissionError, setSubmissionError] = useState("")
    const [submissionDialog, setSubmissionDialog] = useState(
        emptySubmissionDialog
    )



    const {
        mutateAsync: saveCertification,
        isPending: isSavingCertification,
    } = useMutation({
        mutationFn: async (payload) => {
            if (isEditing) {
                return await updateCertification(certificationId, payload)
            }

            return await addCertification(payload)
        },
    })

    const {
        mutateAsync: uploadCoverImage,
        isPending: isUploadingImage,
    } = useMutation({
        mutationFn: savePhotoCertification,
    })

    const isBusy = isSavingCertification || isUploadingImage
    const isFirstStep = page === 1
    const isLastStep = page === TOTAL_STEPS

    function resetForm() {
        setPage(1)

        setCertificationDetails(
            toDetails(isEditing ? certification : null)
        )

        setModuleCategories(
            isEditing ? toEditableModuleCategories(certification) : []
        )

        setDetailsErrors({})
        setSubmissionError("")
        setSubmissionDialog(emptySubmissionDialog)
    }

    useEffect(() => {
        if (open) {
            resetForm()
        }
    }, [open, certificationId])

    function handleDrawerChange(nextOpen) {
        if (!nextOpen && isBusy) {
            return
        }

        onOpenChange(nextOpen)

        if (!nextOpen) {
            resetForm()
        }
    }

    function handleDetailsChange(nextDetails) {
        setCertificationDetails(nextDetails)
        setDetailsErrors({})
        setSubmissionError("")
    }

    function handleModulesChange(nextCategories) {
        setModuleCategories(nextCategories)
        setSubmissionError("")
    }

    function handlePrevious() {
        if (isFirstStep || isBusy) {
            return
        }

        setPage(1)
        setSubmissionError("")
    }

    function handleNext() {
        const errors = validateCertificationDetails(certificationDetails)

        if (Object.keys(errors).length > 0) {
            setDetailsErrors(errors)
            return
        }

        setDetailsErrors({})
        setSubmissionError("")
        setPage(2)
    }

    async function handleSubmit() {
        const detailsValidationErrors =
            validateCertificationDetails(certificationDetails)

        if (Object.keys(detailsValidationErrors).length > 0) {
            setDetailsErrors(detailsValidationErrors)
            setPage(1)
            return
        }

        if (!isModuleStructureValid(moduleCategories)) {
            setSubmissionError(
                "Add at least one complete major category, middle category, and lesson."
            )
            return
        }

        if (isEditing && !certificationId) {
            setSubmissionError(
                "Cannot update this certification because its ID is missing."
            )
            return
        }

        try {
            setSubmissionError("")

            let imageKey = certificationDetails.existingImageKey

            if (certificationDetails.imageFile) {
                imageKey = await uploadCoverImage(
                    certificationDetails.imageFile
                )
            }

            if (!imageKey) {
                throw new Error("Certification cover image is required.")
            }

            const payload = {
                title: certificationDetails.title.trim(),
                description: certificationDetails.description.trim(),
                price: Number(certificationDetails.price),
                industry: certificationDetails.industry.trim(),
                imageKey,

                majorCategory: removeModuleUiFields(
                    moduleCategories,
                    isEditing
                ),
            }

            if (isEditing) {
                payload.certificationId = certificationId

                payload.dateCreated =
                    certification?.dateCreated ?? formatLocalDateTime()

                payload.dateUpdated = formatLocalDateTime()
            } else {
                payload.dateCreated = formatLocalDateTime()
            }

            const result = await saveCertification(payload)

            if (result === false || result?.success === false) {
                throw new Error(
                    result?.message ||
                    "The server could not save the certification."
                )
            }

            const serverCertification = getCertificationFromResponse(result)

            const savedCertification = {
                ...(certification ?? {}),
                ...payload,
                ...(serverCertification ?? {}),
            }

            if (isEditing && certificationId != null) {
                savedCertification.certificationId =
                    serverCertification?.certificationId ?? certificationId
            }

            await onSaved?.(savedCertification)

            setSubmissionDialog({
                open: true,
                title: isEditing
                    ? "Certification updated successfully"
                    : "Certification created successfully",
                description: isEditing
                    ? "Your certification details, modules, lessons, and cover image were updated."
                    : "The certification details, categories, modules, and lessons were saved successfully.",
            })
        } catch (error) {
            const message = getErrorMessage(error)

            setSubmissionError(message)

            toast.error(
                isEditing
                    ? "Could not update certification"
                    : "Could not create certification",
                {
                    description: message,
                }
            )
        }
    }

    function handleMainAction() {
        if (isLastStep) {
            handleSubmit()
            return
        }

        handleNext()
    }

    function handleCloseAfterSuccess() {
        setSubmissionDialog(emptySubmissionDialog)
        handleDrawerChange(false)
    }

    return (
        <Drawer
            direction="right"
            open={open}
            onOpenChange={handleDrawerChange}
        >
            {trigger && <DrawerTrigger asChild>{trigger}</DrawerTrigger>}

            <DrawerContent className="fixed top-0 right-0 bottom-auto left-auto flex h-dvh !w-full !max-w-none flex-col rounded-l-3xl rounded-r-none border-l bg-background p-0 sm:!w-[680px] xl:!w-[50vw]">
                <DrawerHeader className="flex flex-row items-center gap-3 border-b px-4 py-5 text-left sm:px-6">
                    <DrawerClose asChild>
                        <button
                            type="button"
                            aria-label="Close certification form"
                            disabled={isBusy}
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <CircleChevronLeft className="h-7 w-7" />
                        </button>
                    </DrawerClose>

                    <div className="min-w-0 flex-1">
                        <DrawerTitle className="text-lg font-semibold text-foreground">
                            {isEditing ? "Edit Certification" : "Create Certification"}
                        </DrawerTitle>

                        <p className="mt-0.5 text-xs text-muted-foreground">
                            Step {page} of {TOTAL_STEPS}
                        </p>
                    </div>
                </DrawerHeader>

                <div className="flex-1 overflow-y-auto">
                    <div className="w-full px-4 py-5 sm:px-6">
                        {page === 1 ? (
                                <CertificationDetails
                                    value={certificationDetails}
                                    onChange={handleDetailsChange}
                                    errors={detailsErrors}
                                    mode={mode}
                                />
                        ) : (
                            <CertificationModules
                                value={moduleCategories}
                                onChange={handleModulesChange}
                                onCreateMiddleExam={() => {}}
                            />
                        )}
                    </div>
                </div>

                <DrawerFooter className="border-t bg-background px-4 py-4 sm:px-6">
                    <div className="w-full">
                        {submissionError && (
                            <Alert
                                variant="destructive"
                                className="relative mb-3 pr-12"
                            >
                                <CircleAlert className="h-4 w-4" />

                                <AlertTitle>
                                    Cannot {isEditing ? "update" : "create"} certification
                                </AlertTitle>

                                <AlertDescription>
                                    {submissionError}
                                </AlertDescription>

                                <button
                                    type="button"
                                    onClick={() => setSubmissionError("")}
                                    aria-label="Dismiss error"
                                    className="absolute top-3 right-3 rounded-md p-1 text-destructive transition hover:bg-destructive/10"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </Alert>
                        )}

                        <div className="flex items-center justify-between gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handlePrevious}
                                disabled={isFirstStep || isBusy}
                                className="min-w-[118px] gap-2 rounded-xl"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Previous
                            </Button>

                            <Button
                                type="button"
                                onClick={handleMainAction}
                                disabled={isBusy}
                                className="min-w-[165px] gap-2 rounded-xl"
                            >
                                {isBusy
                                    ? isEditing
                                        ? "Saving..."
                                        : "Creating..."
                                    : isLastStep
                                        ? isEditing
                                            ? "Save Changes"
                                            : "Create Certification"
                                        : (
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
                onOpenChange={(nextOpen) => {
                    setSubmissionDialog((current) => ({
                        ...current,
                        open: nextOpen,
                    }))
                }}
            >
                <AlertDialogContent className="max-w-md rounded-2xl">
                    <AlertDialogHeader>
                        <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <CheckCircle2 className="h-6 w-6" />
                        </div>

                        <AlertDialogTitle>
                            {submissionDialog.title}
                        </AlertDialogTitle>

                        <AlertDialogDescription className="leading-6">
                            {submissionDialog.description}
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter className="mt-3">
                        <AlertDialogAction
                            onClick={handleCloseAfterSuccess}
                            className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                            Close
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Drawer>
    )
}