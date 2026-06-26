import React from "react"
import { MoreVertical, PencilIcon, ShareIcon, TrashIcon } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useNavigate } from "react-router-dom"
import { getFileViewUrl } from "../../src/services/fileService.js"

const DEFAULT_IMAGE =
  "https://www.eclosio.ong/wp-content/uploads/2018/08/default.png"

function CertificationCard({ item, certification }) {
  const nav = useNavigate()
  const imageKey = certification?.imageKey ?? item?.imageKey
  const imageUrl = imageKey ? getFileViewUrl(imageKey) : DEFAULT_IMAGE

  function handleOpenCertification() {
    nav(`certification/${certification?.id ?? item?.id}`, {
      state: { certification: {certification}, imageUrl: {imageUrl} },
    })
  }

  return (
    <div
      className="card h-[380px] w-full cursor-pointer overflow-hidden rounded-[32px] bg-base-100 shadow-sm transition hover:shadow-md"
      onClick={handleOpenCertification}
    >
      <figure className="h-56 shrink-0 bg-zinc-100">
        <img
          src={imageUrl}
          alt={item.title}
          className="h-full w-full object-contain"
          onError={(e) => { e.currentTarget.src = DEFAULT_IMAGE }}
          loading="eager"
        />
      </figure>

      <div className="card-body flex flex-1 bg-zinc-200 p-5">
        <div className="flex items-start justify-between gap-3">
          <h2 className="card-title line-clamp-2 flex-1 text-xl font-semibold text-zinc-950">
            {item.title}
          </h2>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                onClick={(e) => e.stopPropagation()}
                className="-mt-1 -mr-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition hover:bg-zinc-300"
                aria-label="Certification options"
              >
                <MoreVertical className="h-5 w-5 text-zinc-950" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              onClick={(e) => e.stopPropagation()}
            >
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation()
                    console.log("Edit:", item)
                  }}
                >
                  <PencilIcon className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation()
                    console.log("Share:", item)
                  }}
                >
                  <ShareIcon className="mr-2 h-4 w-4" />
                  Share
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <DropdownMenuGroup>
                <DropdownMenuItem
                  variant="destructive"
                  onClick={(e) => {
                    e.stopPropagation()
                    console.log("Delete:", item)
                  }}
                >
                  <TrashIcon className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <p className="line-clamp-3 text-sm leading-6 text-zinc-500">
          {item.description}
        </p>
      </div>
    </div>
  )
}

export default CertificationCard
