import React, { useState } from "react"
import { MoreVertical, Trash2Icon, TrashIcon } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useNavigate } from "react-router-dom"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { getFileViewUrl } from "@/services/fileService.js"
import { deleteCertification } from "@/services/certificationService.js"

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

const DEFAULT_IMAGE =
    "https://www.eclosio.ong/wp-content/uploads/2018/08/default.png"

function getErrorMessage(error) {
  const responseData = error?.response?.data

  return (
      (typeof responseData === "string" && responseData) ||
      responseData?.message ||
      responseData?.error ||
      error?.message ||
      "Something went wrong while deleting the certification."
  )
}

function CertificationCard({ item, certification }) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [showDialog, setShowDialog] = useState(false)

  const currentCertification = certification ?? item

  const certificationId =
      currentCertification?.certificationId ??
      currentCertification?.id ??
      item?.certificationId ??
      item?.id

  const certificationTitle =
      currentCertification?.title ?? item?.title ?? "Untitled Certification"

  const certificationDescription =
      currentCertification?.description ??
      item?.description ??
      "No description available."

  const certificationIndustry =
      currentCertification?.industry ?? item?.industry ?? "Certification"

  const imageKey = currentCertification?.imageKey ?? item?.imageKey

  const imageUrl = imageKey ? getFileViewUrl(imageKey) : DEFAULT_IMAGE

  const { mutate: removeCertification, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      if (!certificationId) {
        throw new Error("Certification ID is missing.")
      }

      const result = await deleteCertification(certificationId)

      if (result === false || result?.success === false) {
        throw new Error(
            result?.message || "The certification could not be deleted."
        )
      }

      return result
    },

    onSuccess: async () => {
      setShowDialog(false)

      await queryClient.invalidateQueries({
        queryKey: ["admin-certifications"],
      })

      toast.success("Certification deleted", {
        description: `"${certificationTitle}" has been removed.`,
      })
    },

    onError: (error) => {
      toast.error("Could not delete certification", {
        description: getErrorMessage(error),
      })
    },
  })

  function handleOpenCertification() {
    if (!certificationId) {
      toast.error("Cannot open certification", {
        description: "Certification ID is missing.",
      })

      return
    }

    navigate(`certification/${certificationId}`, {
      state: {
        certification: currentCertification,
        imageUrl,
      },
    })
  }

  function handleOpenDeleteDialog(event) {
    event.stopPropagation()
    setShowDialog(true)
  }

  function handleDeleteDialogChange(nextOpen) {
    if (isDeleting) {
      return
    }

    setShowDialog(nextOpen)
  }

  function handleConfirmDelete() {
    removeCertification()
  }

  return (
      <>
        <div
            role="button"
            tabIndex={0}
            onClick={handleOpenCertification}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault()
                handleOpenCertification()
              }
            }}
            className="group flex h-[380px] w-full cursor-pointer flex-col overflow-hidden rounded-[32px] border border-border bg-card shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/45 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          {/* Certification cover */}
          <figure className="relative h-52 shrink-0 overflow-hidden border-b border-border bg-muted/40">
            <img
                src={imageUrl}
                alt={certificationTitle}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                onError={(event) => {
                  event.currentTarget.onerror = null
                  event.currentTarget.src = DEFAULT_IMAGE
                }}
                loading="eager"
            />

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
          </figure>

          {/* Card details */}
          <div className="flex min-h-0 flex-1 flex-col p-5 pb-6">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
              <span className="inline-flex max-w-full truncate rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary">
                {certificationIndustry}
              </span>

                <h2 className="font-heading mt-2 line-clamp-2 text-lg font-semibold leading-6 text-foreground">
                  {certificationTitle}
                </h2>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                      type="button"
                      onClick={(event) => event.stopPropagation()}
                      className="-mt-1 -mr-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      aria-label="Certification options"
                  >
                    <MoreVertical className="h-5 w-5" />
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                    align="end"
                    onClick={(event) => event.stopPropagation()}
                >
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                        variant="destructive"
                        disabled={isDeleting}
                        onClick={handleOpenDeleteDialog}
                    >
                      <TrashIcon className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="mt-3 h-1 w-10 shrink-0 rounded-full bg-primary" />

            <p className="mt-3 line-clamp-3 flex-1 text-sm leading-5 text-muted-foreground">
              {certificationDescription}
            </p>
          </div>
        </div>

        <AlertDialog open={showDialog} onOpenChange={handleDeleteDialogChange}>
          <AlertDialogContent size="sm">
            <AlertDialogHeader>
              <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20">
                <Trash2Icon />
              </AlertDialogMedia>

              <AlertDialogTitle>Delete certification?</AlertDialogTitle>

              <AlertDialogDescription>
                Are you sure you want to delete "{certificationTitle}"? This
                action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel variant="outline" disabled={isDeleting}>
                Cancel
              </AlertDialogCancel>

              <Button
                  type="button"
                  variant="destructive"
                  disabled={isDeleting}
                  onClick={handleConfirmDelete}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
  )
}

export default CertificationCard