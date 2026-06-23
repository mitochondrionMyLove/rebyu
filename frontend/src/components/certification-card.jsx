import React from "react"
import { MoreVertical } from "lucide-react"
import { PencilIcon, ShareIcon, TrashIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

function CertificationCard({ item }) {
  return (
    <div className="card h-[380px] w-full overflow-hidden rounded-[32px] bg-base-100 shadow-sm">
      <figure className="h-56 shrink-0">
        <img
          src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
          alt="Certification"
          className="h-full w-full object-cover"
        />
      </figure>

      <div className="card-body flex flex-1 bg-zinc-200 p-5">
        <div className="flex items-start justify-between gap-3">
          <h2 className="card-title text-xl font-semibold text-zinc-950">
            {item.title}
          </h2>

          <button
            type="button"
            className="btn -mt-1 -mr-2 btn-circle btn-ghost btn-sm"
            aria-label="Certification options"
          >
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <MoreVertical className="h-5 w-5 text-zinc-950" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <PencilIcon />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <ShareIcon />
                    Share
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem variant="destructive">
                    <TrashIcon />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </button>
        </div>

        <p className="text-sm text-zinc-500">{item.description}</p>
      </div>
    </div>
  )
}

export default CertificationCard
