import React from "react"
import { Trash2 } from "lucide-react"

function Section({ section, onChange, onDelete }) {
  return (
    <div className="group relative mx-auto w-full min-w-0 max-w-5xl">
      <div className="mb-3 flex min-w-0 items-center justify-between gap-3 px-1">
        <input
          id={`section-name-${section.id}`}
          type="text"
          value={section.sectionName ?? ""}
          onChange={(event) =>
            onChange(section.id, "sectionName", event.target.value)
          }
          placeholder="Name this section"
          className="w-full min-w-0 max-w-sm bg-transparent text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500 outline-none placeholder:text-zinc-400 focus:text-zinc-950"
        />
        <button
          type="button"
          onClick={() => onDelete(section.id)}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-zinc-400 opacity-100 transition hover:bg-red-50 hover:text-red-600 sm:opacity-0 sm:group-hover:opacity-100"
          title="Delete section"
          aria-label="Delete section"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <article className="min-h-[720px] w-full overflow-hidden rounded-sm border border-zinc-200 bg-white shadow-[0_12px_35px_rgba(0,0,0,0.08)] transition duration-200 hover:shadow-[0_16px_45px_rgba(0,0,0,0.12)]">
        <div className="mx-auto flex min-h-[720px] w-full max-w-4xl flex-col px-8 py-10 sm:px-14 sm:py-14">
          <input
            id={`section-title-${section.id}`}
            type="text"
            value={section.title ?? ""}
            onChange={(event) =>
              onChange(section.id, "title", event.target.value)
            }
            placeholder="Untitled lesson heading"
            className="w-full bg-transparent text-3xl font-bold tracking-tight text-zinc-950 outline-none placeholder:font-medium placeholder:text-zinc-300 sm:text-4xl"
          />

          <div className="mt-5 h-px w-full bg-zinc-100" />

          <textarea
            id={`section-content-${section.id}`}
            value={section.content ?? ""}
            onChange={(event) =>
              onChange(section.id, "content", event.target.value)
            }
            placeholder="Start writing your lesson content here..."
            className="mt-8 min-h-[500px] w-full flex-1 resize-none bg-transparent text-base leading-8 text-zinc-700 outline-none placeholder:text-zinc-300 sm:text-lg"
          />
        </div>
      </article>
    </div>
  )
}

export default Section