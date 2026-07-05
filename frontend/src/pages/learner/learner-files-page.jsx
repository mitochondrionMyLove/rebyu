import React, { useMemo, useState } from "react"
import { useOutletContext } from "react-router-dom"
import { Download, Eye, FileText, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  LearnerEmptyState,
  LearnerPageHeader,
} from "@/components/learner/learner-ui.jsx"

export default function LearnerFilesPage() {
  const { data, searchValue } = useOutletContext()
  const [localSearch, setLocalSearch] = useState("")
  const [certificationId, setCertificationId] = useState("")
  const [type, setType] = useState("")

  const query = (localSearch || searchValue).toLowerCase().trim()
  const resources = useMemo(
    () =>
      data.resources.filter(
        (resource) =>
          (!certificationId || String(resource.certificationId) === certificationId) &&
          (!type || resource.type === type) &&
          (!query ||
            resource.name?.toLowerCase().includes(query) ||
            resource.lessonTitle?.toLowerCase().includes(query) ||
            resource.certificationTitle?.toLowerCase().includes(query))
      ),
    [certificationId, data.resources, query, type]
  )

  const types = [...new Set(data.resources.map((resource) => resource.type).filter(Boolean))]

  return (
    <div className="space-y-7">
      <LearnerPageHeader
        title="My Files"
        subtitle="Study resources attached to certifications and lesson content appear here."
      />

      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px_180px]">
        <label className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            value={localSearch}
            onChange={(event) => setLocalSearch(event.target.value)}
            placeholder="Search files, lessons, certifications"
            className="h-10 w-full rounded-xl border border-zinc-200 bg-white pl-10 pr-3 text-sm outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100"
          />
        </label>
        <select
          value={certificationId}
          onChange={(event) => setCertificationId(event.target.value)}
          className="h-10 rounded-xl border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100"
        >
          <option value="">All certifications</option>
          {data.certifications.map((certification) => (
            <option key={certification.certificationId} value={certification.certificationId}>
              {certification.title}
            </option>
          ))}
        </select>
        <select
          value={type}
          onChange={(event) => setType(event.target.value)}
          className="h-10 rounded-xl border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100"
        >
          <option value="">All file types</option>
          {types.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      {resources.length === 0 ? (
        <LearnerEmptyState
          icon={FileText}
          title="No study files available"
          description="Study files will appear when they are attached to lessons or certification records in the backend."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {resources.map((resource) => (
            <article key={resource.id} className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-600">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <h2 className="truncate font-semibold text-zinc-950">{resource.name}</h2>
                  <p className="mt-1 text-xs text-zinc-500">{resource.type}</p>
                </div>
              </div>
              <div className="mt-4 space-y-1 text-sm text-zinc-500">
                <p>Certification: {resource.certificationTitle || "None"}</p>
                <p>Lesson: {resource.lessonTitle || "Certification resource"}</p>
              </div>
              <div className="mt-5 flex gap-2">
                <Button asChild variant="outline">
                  <a href={resource.viewUrl} target="_blank" rel="noreferrer">
                    <Eye className="h-4 w-4" />
                    View
                  </a>
                </Button>
                <Button asChild>
                  <a href={resource.downloadUrl}>
                    <Download className="h-4 w-4" />
                    Download
                  </a>
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
