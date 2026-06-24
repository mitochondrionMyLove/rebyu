import React, { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import {
  ArrowLeft,
  BetweenHorizontalEnd,
  NotebookPen,
  Plus,
  Save,
} from "lucide-react"
import Section from "../../components/Section"

function CreateLessons() {
  const navigate = useNavigate()
  const location = useLocation()

  const state = location.state ?? {}
  const lessonName = state.lessonName ?? "Untitled Lesson"

  const [sections, setSections] = useState([])

  function handleCancel() {
    navigate(-1)
  }

  function handleAddSection() {
    const newSection = {
      id: crypto.randomUUID(),
      sectionName: "",
      title: "",
      content: "",
    }

    setSections((prev) => [...prev, newSection])
  }

  function handleSectionChange(sectionId, field, value) {
    setSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              [field]: value,
            }
          : section
      )
    )
  }

  function handleDeleteSection(sectionId) {
    setSections((prev) =>
      prev.filter((section) => section.id !== sectionId)
    )
  }

  function handleQuizPlaceholder() {
    alert("Quiz builder is not available yet.")
  }

  function handleSaveLesson() {
    console.log("Lesson name:", lessonName)
    console.log("Sections:", sections)

    alert("Lesson data was printed in the browser console.")
  }

  return (
    <section className="flex h-full min-h-0 w-full min-w-0 flex-col overflow-hidden bg-zinc-100">
      <header className="flex h-16 min-w-0 shrink-0 items-center justify-between border-b border-zinc-200 bg-white px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={handleCancel}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-950"
            title="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          <div className="min-w-0">
            <p className="text-xs font-medium text-zinc-500">
              Lesson editor
            </p>

            <h1 className="truncate text-base font-semibold text-zinc-950">
              {lessonName}
            </h1>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={handleCancel}
            className="hidden h-9 rounded-lg px-4 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-950 sm:block"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSaveLesson}
            className="flex h-9 items-center gap-2 rounded-lg bg-zinc-950 px-3 text-sm font-medium text-white transition hover:bg-zinc-800 sm:px-4"
          >
            <Save className="h-4 w-4" />

            <span className="hidden sm:inline">Save Lesson</span>
            <span className="sm:hidden">Save</span>
          </button>
        </div>
      </header>

      <div className="flex min-h-0 min-w-0 flex-1 overflow-hidden">
        {/* Left toolbox: special lesson blocks */}
        <aside className="z-20 flex w-[76px] shrink-0 flex-col border-r border-zinc-200 bg-white sm:w-28">
          <div className="border-b border-zinc-100 px-2 py-3">
            <p className="hidden text-center text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-400 sm:block">
              Tools
            </p>
          </div>

          <div className="flex flex-col gap-2 px-2 py-3">
            <button
              type="button"
              onClick={handleQuizPlaceholder}
              className="group flex w-full flex-col items-center justify-center gap-1 rounded-xl px-2 py-3 text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-950"
              title="Add quiz"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-100 text-zinc-700 transition group-hover:bg-zinc-200">
                <NotebookPen className="h-5 w-5" />
              </span>

              <span className="hidden text-[11px] font-medium sm:block">
                Quiz
              </span>
            </button>
          </div>
        </aside>

        <main className="h-full min-w-0 flex-1 overflow-x-hidden overflow-y-auto px-4 py-8 sm:px-8 lg:px-12">
          <div className="mx-auto flex w-full min-w-0 max-w-6xl flex-col gap-10 pb-16">
            {sections.length === 0 ? (
              <div className="mx-auto flex min-h-[600px] w-full max-w-5xl flex-col items-center justify-center rounded-sm border border-zinc-200 bg-white px-6 text-center shadow-[0_12px_35px_rgba(0,0,0,0.08)]">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-700">
                  <BetweenHorizontalEnd className="h-6 w-6" />
                </div>

                <h2 className="mt-5 text-xl font-semibold text-zinc-900">
                  Start building your lesson
                </h2>

                <p className="mt-2 max-w-sm text-sm leading-6 text-zinc-500">
                  Add your first section to start writing the lesson content.
                </p>

                <button
                  type="button"
                  onClick={handleAddSection}
                  className="mt-6 flex h-10 items-center gap-2 rounded-lg bg-zinc-950 px-4 text-sm font-medium text-white transition hover:bg-zinc-800"
                >
                  <Plus className="h-4 w-4" />
                  Add first section
                </button>
              </div>
            ) : (
              <>
                {sections.map((section) => (
                  <Section
                    key={section.id}
                    section={section}
                    onChange={handleSectionChange}
                    onDelete={handleDeleteSection}
                  />
                ))}

                <button
                  type="button"
                  onClick={handleAddSection}
                  className="mx-auto flex w-full max-w-5xl items-center justify-center gap-2 rounded-xl border border-dashed border-zinc-300 bg-white/70 py-4 text-sm font-medium text-zinc-600 transition hover:border-zinc-500 hover:bg-white hover:text-zinc-950"
                >
                  <Plus className="h-4 w-4" />
                  Add another section
                </button>
              </>
            )}
          </div>
        </main>
      </div>
    </section>
  )
}

export default CreateLessons