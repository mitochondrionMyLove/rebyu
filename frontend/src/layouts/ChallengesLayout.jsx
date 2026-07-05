import {
    ArrowLeft,
    ChevronLeft,
    ChevronRight,
    Clock3,
} from "lucide-react"

import MainArea from "../components/challenges/main.jsx"

export default function ChallengesLayout() {
    return (
        <section className="flex h-dvh min-h-0 flex-col overflow-hidden bg-white">
            {}
            <header className="flex h-16 shrink-0 items-center justify-between border-b border-zinc-200 px-4 sm:px-6">
                <div className="flex min-w-0 items-center gap-3">
                    <button
                        type="button"
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-950"
                        aria-label="Back"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </button>

                    <div className="min-w-0">
                        <h1 className="truncate text-base font-semibold text-zinc-950">
                            CodeStrike
                        </h1>
                    </div>
                </div>

                <div className="flex shrink-0 items-center gap-2 text-zinc-700">
                    <Clock3 className="h-4 w-4" />

                    <div className="leading-tight">
                        <p className="text-[10px] font-medium uppercase tracking-wide text-zinc-500">
                            Time Left
                        </p>

                        <p className="text-sm font-semibold tabular-nums">
                            01:56:12
                        </p>
                    </div>
                </div>
            </header>

            <main className="min-h-0 flex-1 overflow-hidden">
                <MainArea />
            </main>

            <footer className="flex h-16 shrink-0 items-center justify-between border-t border-zinc-200 px-4 sm:px-6">
                <button
                    type="button"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
                >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                </button>

                <p className="text-sm font-medium text-zinc-500">2 / 4</p>

                <button
                    type="button"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
                >
                    Next
                    <ChevronRight className="h-4 w-4" />
                </button>
            </footer>
        </section>
    )
}