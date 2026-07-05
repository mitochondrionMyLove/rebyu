import React, { useMemo, useState } from "react"
import { useNavigate, useOutletContext } from "react-router-dom"
import { Award, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  CertificationProgressCard,
  LearnerEmptyState,
  LearnerPageHeader,
  ProgressBar,
} from "@/components/learner/learner-ui.jsx"
import { getFileViewUrl } from "@/services/fileService.js"

const DEFAULT_IMAGE = "https://www.eclosio.ong/wp-content/uploads/2018/08/default.png"

function CertificationCard({ certification, enrolled, lessons, onOpen, onContinue, onProgress }) {
  const related = lessons.filter(
    (lesson) => String(lesson.certificationId) === String(certification.certificationId)
  )
  const completed = related.filter((lesson) => lesson.completed).length
  const percent = related.length ? Math.round((completed / related.length) * 100) : 0
  const imageUrl = certification.imageKey ? getFileViewUrl(certification.imageKey) : DEFAULT_IMAGE

  return (
    <article className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <button type="button" onClick={onOpen} className="block h-44 w-full overflow-hidden bg-zinc-100">
        <img src={imageUrl} alt={certification.title} className="h-full w-full object-cover" />
      </button>
      <div className="p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-400">
          {certification.industry || "Certification"}
        </p>
        <h2 className="mt-2 text-lg font-semibold text-zinc-950">{certification.title}</h2>
        <p className="mt-2 line-clamp-3 text-sm leading-6 text-zinc-500">
          {certification.description || "No description available."}
        </p>
        {enrolled && (
          <div className="mt-4 space-y-2">
            <ProgressBar value={percent} />
            <p className="text-xs text-zinc-500">
              {completed} of {related.length} lessons completed
            </p>
          </div>
        )}
        <div className="mt-5 flex flex-wrap gap-2">
          {enrolled ? (
            <>
              <Button onClick={onContinue}>Continue Learning</Button>
              <Button variant="outline" onClick={onProgress}>
                View Progress
              </Button>
            </>
          ) : (
            <Button variant="outline" onClick={onOpen}>
              View Details
            </Button>
          )}
        </div>
      </div>
    </article>
  )
}

export default function LearnerCertificationsPage() {
  const navigate = useNavigate()
  const { data, searchValue } = useOutletContext()
  const [tab, setTab] = useState("enrolled")
  const [localSearch, setLocalSearch] = useState("")
  const query = (localSearch || searchValue).toLowerCase().trim()

  const enrolledIds = new Set(
    data.enrolledCertifications.map((certification) => String(certification.certificationId))
  )

  const filtered = useMemo(() => {
    const source =
      tab === "enrolled"
        ? data.enrolledCertifications
        : data.certifications.filter(
            (certification) => !enrolledIds.has(String(certification.certificationId))
          )

    return source.filter(
      (certification) =>
        !query ||
        certification.title?.toLowerCase().includes(query) ||
        certification.description?.toLowerCase().includes(query) ||
        certification.industry?.toLowerCase().includes(query)
    )
  }, [data.certifications, data.enrolledCertifications, enrolledIds, query, tab])

  return (
    <div className="space-y-7">
      <LearnerPageHeader
        title="My Certifications"
        subtitle="View enrolled certifications, continue lessons, and browse available learning paths."
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-flex w-fit rounded-xl border border-zinc-200 bg-white p-1">
          {["enrolled", "available"].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setTab(item)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                tab === item ? "bg-zinc-950 text-white" : "text-zinc-500 hover:text-zinc-950"
              }`}
            >
              {item === "enrolled" ? "Enrolled Certifications" : "Available Certifications"}
            </button>
          ))}
        </div>
        <label className="relative w-full sm:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            value={localSearch}
            onChange={(event) => setLocalSearch(event.target.value)}
            placeholder="Search certifications"
            className="h-10 w-full rounded-xl border border-zinc-200 bg-white pl-10 pr-3 text-sm outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100"
          />
        </label>
      </div>

      {filtered.length === 0 ? (
        <LearnerEmptyState
          icon={Award}
          title={tab === "enrolled" ? "No enrolled certifications" : "No available certifications"}
          description={
            tab === "enrolled"
              ? "Your enrolled certifications will appear here after enrollment records are created."
              : "There are no additional certifications available from the current backend data."
          }
        />
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((certification) => {
            const enrolled = enrolledIds.has(String(certification.certificationId))
            return (
              <CertificationCard
                key={certification.certificationId}
                certification={certification}
                enrolled={enrolled}
                lessons={data.lessons}
                onOpen={() => navigate(`/learner/certifications/${certification.certificationId}`)}
                onContinue={() => navigate(`/learner/learning/${certification.certificationId}`)}
                onProgress={() => navigate("/learner/progress")}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}

export { CertificationProgressCard }
