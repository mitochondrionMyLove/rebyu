import React, { useEffect, useMemo, useState } from "react"
import {
  BookOpenCheck,
  BrainCircuit,
  Download,
  Eye,
  FileText,
  Layers3,
  LibraryBig,
  Search,
  Share2,
  UsersRound,
  Plus,
  Trash2,
  Link,
  StickyNote,
} from "lucide-react"
import { useNavigate, useOutletContext } from "react-router-dom"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "sonner"
import { addLibraryItem, deleteLibraryItem, getLibraryItems } from "@/services/learnerToolsService"
import {
  LearnerEmptyState,
  LearnerPageHeader,
} from "@/components/learner/learner-ui.jsx"

const ALL_VALUE = "all"

const libraryTypeMeta = {
  quiz: {
    label: "Quiz",
    icon: BrainCircuit,
    badge:
        "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-300",
  },
  flashcard: {
    label: "Flashcards",
    icon: Layers3,
    badge:
        "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-800 dark:bg-violet-950/40 dark:text-violet-300",
  },
  file: {
    label: "File",
    icon: FileText,
    badge:
        "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300",
  },
  community: {
    label: "Community",
    icon: UsersRound,
    badge:
        "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300",
  },
  link: {
    label: "Link",
    icon: Link,
    badge: "border-cyan-200 bg-cyan-50 text-cyan-700 dark:border-cyan-800 dark:bg-cyan-950/40 dark:text-cyan-300",
  },
  note: {
    label: "Note",
    icon: StickyNote,
    badge: "border-zinc-200 bg-zinc-50 text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300",
  },
}

function safeArray(value) {
  return Array.isArray(value) ? value : []
}

function formatDate(value) {
  if (!value) return "—"

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return String(value)
  }

  return new Intl.DateTimeFormat("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date)
}

function normalizeQuiz(item, index) {
  return {
    id: item.quizId ?? item.id ?? `quiz-${index}`,
    kind: "quiz",
    title:
        item.title ??
        item.name ??
        item.quizTitle ??
        `Generated Quiz ${index + 1}`,
    description:
        item.description ??
        "AI-generated practice quiz saved in your library.",
    certificationId: item.certificationId ?? null,
    certificationTitle:
        item.certificationTitle ?? item.certification?.title ?? "",
    lessonTitle: item.lessonTitle ?? item.lesson?.title ?? "",
    details:
        item.questionCount != null
            ? `${item.questionCount} question${
                Number(item.questionCount) === 1 ? "" : "s"
            }`
            : "Generated quiz",
    route:
        item.route ??
        item.viewUrl ??
        (item.quizId != null
            ? `/learner/library/quizzes/${item.quizId}`
            : null),
    createdAt:
        item.createdAt ?? item.dateCreated ?? item.generatedAt ?? null,
  }
}

function normalizeFlashcard(item, index) {
  return {
    id:
        item.flashcardSetId ??
        item.flashcardId ??
        item.id ??
        `flashcard-${index}`,
    kind: "flashcard",
    title:
        item.title ??
        item.name ??
        item.setTitle ??
        `Flashcard Set ${index + 1}`,
    description:
        item.description ??
        "Generated flashcards for review and active recall.",
    certificationId: item.certificationId ?? null,
    certificationTitle:
        item.certificationTitle ?? item.certification?.title ?? "",
    lessonTitle: item.lessonTitle ?? item.lesson?.title ?? "",
    details:
        item.cardCount != null
            ? `${item.cardCount} card${Number(item.cardCount) === 1 ? "" : "s"}`
            : "Flashcard set",
    route:
        item.route ??
        item.viewUrl ??
        (item.flashcardSetId != null
            ? `/learner/library/flashcards/${item.flashcardSetId}`
            : null),
    createdAt:
        item.createdAt ?? item.dateCreated ?? item.generatedAt ?? null,
  }
}

function normalizeFile(item, index) {
  return {
    id: item.resourceId ?? item.fileId ?? item.id ?? `file-${index}`,
    kind: "file",
    title:
        item.name ??
        item.fileName ??
        item.title ??
        `Study File ${index + 1}`,
    description:
        item.description ??
        "Study resource attached to a certification or lesson.",
    certificationId: item.certificationId ?? null,
    certificationTitle:
        item.certificationTitle ?? item.certification?.title ?? "",
    lessonTitle: item.lessonTitle ?? item.lesson?.title ?? "",
    details: item.type ?? item.fileType ?? "Study file",
    route: item.viewUrl ?? item.url ?? null,
    downloadUrl: item.downloadUrl ?? null,
    createdAt:
        item.createdAt ?? item.dateCreated ?? item.uploadedAt ?? null,
  }
}

function normalizeCommunityResource(item, index) {
  const sharedType = String(
      item.contentType ??
      item.resourceType ??
      item.type ??
      "resource"
  ).toLowerCase()

  return {
    id:
        item.sharedResourceId ??
        item.postId ??
        item.id ??
        `community-${index}`,
    kind: "community",
    title:
        item.title ??
        item.name ??
        item.postTitle ??
        `Community Resource ${index + 1}`,
    description:
        item.description ??
        item.summary ??
        "A resource shared by another learner in the REBYU community.",
    certificationId: item.certificationId ?? null,
    certificationTitle:
        item.certificationTitle ?? item.certification?.title ?? "",
    lessonTitle: item.lessonTitle ?? item.lesson?.title ?? "",
    details:
        item.sharedByName ??
        item.authorName ??
        item.userName ??
        "Shared by the community",
    sharedType:
        sharedType === "quiz"
            ? "Shared quiz"
            : sharedType === "flashcard" || sharedType === "flashcards"
                ? "Shared flashcards"
                : sharedType === "file"
                    ? "Shared file"
                    : "Community resource",
    route:
        item.route ??
        item.viewUrl ??
        item.url ??
        (item.postId != null
            ? `/learner/community/posts/${item.postId}`
            : null),
    downloadUrl: item.downloadUrl ?? null,
    createdAt:
        item.sharedAt ?? item.createdAt ?? item.dateCreated ?? null,
  }
}

export default function LearnerFilesPage() {
  const navigate = useNavigate()
  const outletContext = useOutletContext() ?? {}
  const data = outletContext.data ?? {}
  const searchValue = outletContext.searchValue ?? ""

  const [localSearch, setLocalSearch] = useState("")
  const [certificationId, setCertificationId] = useState("")
  const [category, setCategory] = useState(ALL_VALUE)
  const [storedItems, setStoredItems] = useState([])
  const [addOpen, setAddOpen] = useState(false)
  const [newType, setNewType] = useState("link")
  const [newTitle, setNewTitle] = useState("")
  const [newDescription, setNewDescription] = useState("")
  const [newUrl, setNewUrl] = useState("")
  const [viewItem, setViewItem] = useState(null)

  useEffect(() => {
    getLibraryItems().then(setStoredItems).catch(() => toast.error("Your library could not be loaded."))
  }, [])

  const quizzes = useMemo(
      () =>
          safeArray(
              data.generatedQuizzes ??
              data.quizzes ??
              data.savedQuizzes
          ).map(normalizeQuiz),
      [data.generatedQuizzes, data.quizzes, data.savedQuizzes]
  )

  const flashcards = useMemo(
      () =>
          safeArray(
              data.generatedFlashcards ??
              data.flashcards ??
              data.flashcardSets
          ).map(normalizeFlashcard),
      [data.flashcardSets, data.flashcards, data.generatedFlashcards]
  )

  const files = useMemo(
      () =>
          safeArray(
              data.resources ??
              data.files ??
              data.studyFiles
          ).map(normalizeFile),
      [data.files, data.resources, data.studyFiles]
  )

  const communityResources = useMemo(
      () =>
          safeArray(
              data.communityShared ??
              data.sharedResources ??
              data.communityResources ??
              data.sharedFromCommunity
          ).map(normalizeCommunityResource),
      [
        data.communityResources,
        data.communityShared,
        data.sharedFromCommunity,
        data.sharedResources,
      ]
  )

  const allItems = useMemo(
      () => [
        ...storedItems,
        ...quizzes,
        ...flashcards,
        ...files,
        ...communityResources,
      ],
      [communityResources, files, flashcards, quizzes, storedItems]
  )

  async function saveResource() {
    if (!newTitle.trim() || (newType !== "note" && !newUrl.trim())) {
      toast.error("Add a title and resource URL.")
      return
    }
    try {
      const item = await addLibraryItem({ itemType: newType, title: newTitle.trim(), description: newDescription.trim(), resourceUrl: newType === "note" ? null : newUrl.trim() })
      setStoredItems((current) => [item, ...current])
      setNewTitle(""); setNewDescription(""); setNewUrl(""); setAddOpen(false)
      toast.success("Resource added to your library.")
    } catch { toast.error("The resource could not be saved.") }
  }

  async function removeResource(item) {
    try { await deleteLibraryItem(item.id); setStoredItems((current) => current.filter((entry) => entry.id !== item.id)); toast.success("Resource removed.") }
    catch { toast.error("The resource could not be removed.") }
  }

  const certifications = useMemo(() => {
    const existingCertifications = safeArray(data.certifications)

    if (existingCertifications.length > 0) {
      return existingCertifications.map((certification) => ({
        certificationId:
            certification.certificationId ?? certification.id,
        title:
            certification.title ??
            certification.name ??
            "Untitled certification",
      }))
    }

    const certificationMap = new Map()

    allItems.forEach((item) => {
      if (
          item.certificationId != null &&
          item.certificationTitle
      ) {
        certificationMap.set(String(item.certificationId), {
          certificationId: item.certificationId,
          title: item.certificationTitle,
        })
      }
    })

    return [...certificationMap.values()]
  }, [allItems, data.certifications])

  const query = (localSearch || searchValue).toLowerCase().trim()

  const libraryItems = useMemo(
      () =>
          allItems.filter((item) => {
            const matchesCategory =
                category === ALL_VALUE || item.kind === category

            const matchesCertification =
                !certificationId ||
                String(item.certificationId ?? "") === certificationId

            const matchesSearch =
                !query ||
                item.title?.toLowerCase().includes(query) ||
                item.description?.toLowerCase().includes(query) ||
                item.certificationTitle?.toLowerCase().includes(query) ||
                item.lessonTitle?.toLowerCase().includes(query) ||
                item.details?.toLowerCase().includes(query)

            return (
                matchesCategory &&
                matchesCertification &&
                matchesSearch
            )
          }),
      [allItems, category, certificationId, query]
  )

  function openItem(item) {
    if (!item.route) {
      setViewItem(item)
      return
    }

    if (/^https?:\/\//i.test(item.route)) {
      window.open(item.route, "_blank", "noopener,noreferrer")
      return
    }

    navigate(item.route)
  }

  return (
      <div className="space-y-6">
        <LearnerPageHeader title="Library" subtitle="Access your generated quizzes, flashcards, study files, and community-shared resources.">
          <Button type="button" onClick={() => setAddOpen(true)}><Plus className="mr-2 h-4 w-4" />Add resource</Button>
        </LearnerPageHeader>

        <div className="flex flex-wrap items-center gap-2 border-b border-zinc-200 pb-4">
          {[
            { value: ALL_VALUE, label: `All (${allItems.length})` },
            { value: "quiz", label: `Quizzes (${quizzes.length})` },
            {
              value: "flashcard",
              label: `Flashcards (${flashcards.length})`,
            },
            { value: "file", label: `Files (${files.length})` },
            {
              value: "community",
              label: `Community (${communityResources.length})`,
            },
          ].map((item) => (
              <Button
                  key={item.value}
                  type="button"
                  variant={category === item.value ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setCategory(item.value)}
              >
                {item.label}
              </Button>
          ))}
        </div>

        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_240px]">
          <label className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />

            <input
                value={localSearch}
                onChange={(event) =>
                    setLocalSearch(event.target.value)
                }
                placeholder="Search quizzes, flashcards, files, or community resources"
                className="h-10 w-full rounded-lg border border-zinc-200 bg-white pl-10 pr-3 text-sm outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100"
            />
          </label>

          <select
              value={certificationId}
              onChange={(event) =>
                  setCertificationId(event.target.value)
              }
              className="h-10 rounded-lg border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100"
          >
            <option value="">All certifications</option>

            {certifications.map((certification) => (
                <option
                    key={String(certification.certificationId)}
                    value={String(certification.certificationId)}
                >
                  {certification.title}
                </option>
            ))}
          </select>
        </div>

        {libraryItems.length === 0 ? (
            <LearnerEmptyState
                icon={LibraryBig}
                title="Your library is empty"
                description="Generated quizzes, flashcards, files, and community resources will appear here."
            />
        ) : (
            <div className="overflow-x-auto border-y border-zinc-200">
              <table className="w-full min-w-[980px] border-collapse text-left">
                <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50/80">
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    Resource
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    Type
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    Certification
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    Lesson
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    Details
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    Added
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    Actions
                  </th>
                </tr>
                </thead>

                <tbody>
                {libraryItems.map((item) => {
                  const meta = libraryTypeMeta[item.kind]
                  const Icon = meta.icon

                  return (
                      <tr
                          key={`${item.kind}-${item.id}`}
                          className="border-b border-zinc-100 transition last:border-b-0 hover:bg-zinc-50/70"
                      >
                        <td className="px-4 py-4">
                          <div className="flex min-w-0 items-start gap-3">
                            <Icon className="mt-0.5 h-5 w-5 shrink-0 text-zinc-500" />

                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-zinc-950">
                                {item.title}
                              </p>

                              <p className="mt-1 line-clamp-1 max-w-md text-xs text-zinc-500">
                                {item.description}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <Badge
                              variant="outline"
                              className={meta.badge}
                          >
                            {meta.label}
                          </Badge>
                        </td>

                        <td className="max-w-48 px-4 py-4 text-sm text-zinc-600">
                      <span className="block truncate">
                        {item.certificationTitle || "General library"}
                      </span>
                        </td>

                        <td className="max-w-48 px-4 py-4 text-sm text-zinc-600">
                      <span className="block truncate">
                        {item.lessonTitle || "Not linked"}
                      </span>
                        </td>

                        <td className="max-w-44 px-4 py-4 text-sm text-zinc-600">
                      <span className="block truncate">
                        {item.sharedType || item.details}
                      </span>
                        </td>

                        <td className="whitespace-nowrap px-4 py-4 text-sm text-zinc-500">
                          {formatDate(item.createdAt)}
                        </td>

                        <td className="px-4 py-4">
                          <div className="flex justify-end gap-2">
                            {item.kind === "quiz" ? (
                                <Button
                                    type="button"
                                    size="sm"
                                    onClick={() => openItem(item)}
                                    disabled={!item.route}
                                >
                                  <BrainCircuit className="mr-2 h-4 w-4" />
                                  Open
                                </Button>
                            ) : item.kind === "flashcard" ? (
                                <Button
                                    type="button"
                                    size="sm"
                                    onClick={() => openItem(item)}
                                    disabled={!item.route}
                                >
                                  <BookOpenCheck className="mr-2 h-4 w-4" />
                                  Study
                                </Button>
                            ) : (
                                <>
                                  <Button
                                      type="button"
                                      size="sm"
                                      variant="outline"
                                      onClick={() => openItem(item)}
                                    >
                                    <Eye className="mr-2 h-4 w-4" />
                                    View
                                  </Button>

                                  {item.downloadUrl ? (
                                      <Button asChild size="sm">
                                        <a href={item.downloadUrl}>
                                          <Download className="mr-2 h-4 w-4" />
                                          Download
                                        </a>
                                      </Button>
                                  ) : null}
                                </>
                            )}

                            {item.kind === "community" ? (
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="ghost"
                                    onClick={() =>
                                        navigate("/learner/community")
                                    }
                                >
                                  <Share2 className="mr-2 h-4 w-4" />
                                  Source
                                </Button>
                            ) : null}
                            {item.ownedByMe ? (
                                <Button type="button" size="icon" variant="ghost" onClick={() => removeResource(item)} aria-label="Remove from library">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                            ) : null}
                          </div>
                        </td>
                      </tr>
                  )
                })}
                </tbody>
              </table>
            </div>
        )}

        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader><DialogTitle>Add to library</DialogTitle><DialogDescription>Save a useful link, file URL, quiz, flashcard set, or personal note.</DialogDescription></DialogHeader>
            <div className="grid gap-4">
              <select value={newType} onChange={(event) => setNewType(event.target.value)} className="h-10 rounded-md border bg-background px-3 text-sm">
                <option value="link">Link</option><option value="file">File URL</option><option value="quiz">Quiz</option><option value="flashcard">Flashcards</option><option value="note">Note</option>
              </select>
              <Input value={newTitle} onChange={(event) => setNewTitle(event.target.value)} placeholder="Resource title" />
              {newType !== "note" ? <Input type="url" value={newUrl} onChange={(event) => setNewUrl(event.target.value)} placeholder="https://..." /> : null}
              <Textarea value={newDescription} onChange={(event) => setNewDescription(event.target.value)} placeholder={newType === "note" ? "Write your study note..." : "Why is this resource useful?"} className="min-h-28" />
            </div>
            <DialogFooter><Button type="button" variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button><Button type="button" onClick={saveResource}>Save resource</Button></DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={Boolean(viewItem)} onOpenChange={(open) => !open && setViewItem(null)}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader><DialogTitle>{viewItem?.title}</DialogTitle><DialogDescription>{viewItem?.details || "Library resource"}</DialogDescription></DialogHeader>
            <p className="whitespace-pre-wrap text-sm leading-7 text-muted-foreground">{viewItem?.description || "No description was added."}</p>
          </DialogContent>
        </Dialog>
      </div>
  )
}
