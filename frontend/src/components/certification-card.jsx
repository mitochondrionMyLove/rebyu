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
            className="card h-[380px] w-full cursor-pointer overflow-hidden rounded-[32px] bg-base-100 shadow-sm transition hover:shadow-md"
            onClick={handleOpenCertification}
        >
          <figure className="h-56 shrink-0 bg-zinc-100">
            <img
                src={imageUrl}
                alt={certificationTitle}
                className="h-full w-full object-contain"
                onError={(event) => {
                  event.currentTarget.src = DEFAULT_IMAGE
                }}
                loading="eager"
            />
          </figure>

          <div className="card-body flex flex-1 bg-zinc-200 p-5">
            <div className="flex items-start justify-between gap-3">
              <h2 className="card-title line-clamp-2 flex-1 text-xl font-semibold text-zinc-950">
                {certificationTitle}
              </h2>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                      type="button"
                      onClick={(event) => event.stopPropagation()}
                      className="-mt-1 -mr-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition hover:bg-zinc-300"
                      aria-label="Certification options"
                  >
                    <MoreVertical className="h-5 w-5 text-zinc-950" />
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

            <p className="line-clamp-3 text-sm leading-6 text-zinc-500">
              {currentCertification?.description ||
                  item?.description ||
                  "No description available."}
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