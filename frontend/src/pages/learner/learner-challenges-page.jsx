import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  ChevronLeft,
  ChevronRight,
  Code2,
  Database,
  Flame,
  Network,
  Timer,
  Trophy,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"

const challenges = [
  {
    title: "CodeStrike",
    role: "Coding Skills",
    description:
      "Coding practice challenges for algorithmic and implementation skills.",
    icon: Code2,
    tag: "Practice",
    accent: "linear-gradient(135deg, #2563eb, #06b6d4)",
    surface: "#dbeafe",
    available: false,
  },
  {
    title: "BlueprintArena",
    role: "Design Skills",
    description:
      "System design prompts for architecture and diagram reasoning.",
    icon: Network,
    tag: "Design",
    accent: "linear-gradient(135deg, #7c3aed, #6366f1)",
    surface: "#ede9fe",
    available: false,
  },
  {
    title: "QueryRealm",
    role: "Data Skills",
    description: "SQL and ERD practice for data modeling and querying.",
    icon: Database,
    tag: "Database",
    accent: "linear-gradient(135deg, #059669, #14b8a6)",
    surface: "#d1fae5",
    available: false,
  },
  {
    title: "Sprint Challenge",
    role: "Speed and Accuracy",
    description:
      "Timed short practice using the existing competitive challenge experience.",
    icon: Timer,
    tag: "Timed",
    accent: "linear-gradient(135deg, #f97316, #f43f5e)",
    surface: "#ffedd5",
    available: true,
    route: "/challenges",
  },
  {
    title: "Daily Ranked",
    role: "Exam Readiness",
    description:
      "A daily assessment challenge built to sharpen exam readiness.",
    icon: Flame,
    tag: "Daily",
    accent: "linear-gradient(135deg, #f59e0b, #facc15)",
    surface: "#fef3c7",
    available: false,
  },
]

function relativePosition(index, activeIndex) {
  let difference = index - activeIndex
  const midpoint = Math.floor(challenges.length / 2)
  if (difference > midpoint) difference -= challenges.length
  if (difference < -midpoint) difference += challenges.length
  return difference
}

export default function LearnerChallengesPage() {
  const navigate = useNavigate()
  const [activeIndex, setActiveIndex] = useState(3)
  const activeChallenge = challenges[activeIndex]

  const move = (direction) => {
    setActiveIndex(
      (current) => (current + direction + challenges.length) % challenges.length
    )
  }

  const selectChallenge = (challenge) => {
    if (challenge.available) {
      navigate(challenge.route)
      return
    }
    toast.info(`${challenge.title} is coming soon`, {
      description: "This challenge will unlock when its activity is ready.",
    })
  }

  return (
    <div
      className="relative left-1/2 isolate -my-6 min-h-[calc(100dvh-4rem)] w-screen -translate-x-1/2 overflow-hidden bg-[#eef4ff] px-4 py-8 sm:px-6 md:w-[calc(100vw-3.25rem)] lg:px-8 dark:bg-[#071126]"
      style={{
        backgroundImage:
          "radial-gradient(circle at 18% 18%, rgba(59,130,246,0.26), transparent 27%), radial-gradient(circle at 82% 22%, rgba(139,92,246,0.22), transparent 28%), radial-gradient(circle at 50% 92%, rgba(6,182,212,0.18), transparent 30%)",
      }}
    >
      <div className="pointer-events-none absolute top-24 -left-20 h-56 w-56 rounded-full bg-blue-400/20 blur-3xl" />
      <div className="pointer-events-none absolute top-48 -right-20 h-72 w-72 rounded-full bg-violet-400/20 blur-3xl" />
      <div className="pointer-events-none absolute right-0 bottom-0 left-0 h-32 bg-gradient-to-t from-blue-200/40 to-transparent dark:from-blue-950/40" />

      <div className="relative mx-auto w-full max-w-6xl space-y-6">
        <section
          className="relative overflow-hidden px-1 py-6 before:absolute before:top-20 before:left-1/2 before:h-72 before:w-[80%] before:-translate-x-1/2 before:rounded-full before:bg-white/45 before:blur-3xl before:content-[''] sm:px-4 dark:before:bg-blue-950/25"
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") move(-1)
            if (event.key === "ArrowRight") move(1)
          }}
          tabIndex={0}
        aria-label="Challenge activity carousel"
        >
          <div className="text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-200">
              <Trophy className="h-5 w-5" />
            </div>
          <p className="mt-3 text-xs font-bold tracking-[0.2em] text-blue-600 uppercase">
            Choose your challenge
          </p>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-300">
            Choose what you want to practice and take on your next challenge.
          </p>
          </div>

          <div className="relative mt-7 h-[390px] sm:h-[420px]">
            {challenges.map((challenge, index) => {
              const position = relativePosition(index, activeIndex)
              const isActive = position === 0
              const Icon = challenge.icon
              return (
                <button
                  key={challenge.title}
                  type="button"
                  onClick={() =>
                    isActive
                      ? selectChallenge(challenge)
                      : setActiveIndex(index)
                  }
                  className={`absolute top-1/2 left-1/2 isolate h-[350px] w-[250px] overflow-hidden rounded-2xl bg-[var(--challenge-surface)] text-left shadow-[0_22px_55px_-18px_rgba(15,23,42,0.48)] transition-all duration-500 ease-out [backface-visibility:hidden] focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none sm:w-[280px] ${
                    isActive
                      ? "shadow-[0_26px_65px_-18px_rgba(37,99,235,0.5)] dark:bg-zinc-900"
                      : "dark:bg-zinc-900"
                  }`}
                  style={{
                    transform: `translate(calc(-50% + ${position * 190}px), -50%) scale(${isActive ? 1 : Math.abs(position) === 1 ? 0.82 : 0.66})`,
                    opacity: 1,
                    visibility: "visible",
                    zIndex: 10 - Math.abs(position),
                    pointerEvents: "auto",
                    "--challenge-surface": challenge.surface,
                    backgroundColor: challenge.surface,
                  }}
                  aria-current={isActive ? "true" : undefined}
                  aria-label={`${challenge.title}${isActive ? ", selected" : ", select"}`}
                >
                  <div
                    className="relative flex h-44 items-center justify-center overflow-hidden"
                    style={{ background: challenge.accent }}
                  >
                    <div className="absolute top-3 right-3 left-3 z-10 flex items-center justify-between gap-2">
                      <span className="rounded-md bg-white/90 px-2.5 py-1 text-[10px] font-bold tracking-wide text-zinc-800 uppercase shadow-sm backdrop-blur-sm">
                        {challenge.tag}
                      </span>
                      <span
                        className={`rounded-md px-2.5 py-1 text-[10px] font-bold tracking-wide uppercase shadow-sm backdrop-blur-sm ${
                          challenge.available
                            ? "bg-emerald-500 text-white"
                            : "bg-zinc-950/70 text-white"
                        }`}
                      >
                        {challenge.available ? "Ready" : "Coming soon"}
                      </span>
                    </div>
                    <div className="absolute -top-8 -right-8 h-28 w-28 rounded-full bg-white/10" />
                    <div className="absolute -bottom-10 -left-7 h-32 w-32 rounded-full bg-white/10" />
                    <div
                      className={`flex h-24 w-24 items-center justify-center rounded-full bg-white/20 text-white shadow-xl transition-transform duration-500 ${isActive ? "scale-100" : "scale-90"}`}
                    >
                      <Icon className="h-12 w-12" strokeWidth={1.7} />
                    </div>
                  </div>

                  <div
                    className="h-[176px] p-5 text-center"
                    style={{ backgroundColor: challenge.surface }}
                  >
                    <p className="text-[10px] font-bold tracking-[0.16em] text-blue-600 uppercase">
                      {challenge.role}
                    </p>
                    <h2 className="mt-1 text-xl font-bold text-zinc-950">
                      {challenge.title}
                    </h2>
                    <p className="mt-2 min-h-12 text-xs leading-5 text-zinc-500">
                      {challenge.description}
                    </p>
                    <div
                      className={`mx-auto mt-4 h-1 rounded-full transition-all ${
                        isActive ? "w-14 bg-blue-600" : "w-6 bg-zinc-300"
                      }`}
                      aria-hidden="true"
                    />
                  </div>
                </button>
              )
            })}
          </div>

          <div className="flex items-center justify-center gap-4">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-11 w-11 rounded-full bg-white shadow-sm"
              onClick={() => move(-1)}
              aria-label="Previous challenge"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div className="flex gap-1.5" aria-hidden="true">
              {challenges.map((challenge, index) => (
                <span
                  key={challenge.title}
                  className={`h-1.5 rounded-full transition-all ${index === activeIndex ? "w-7 bg-blue-600" : "w-1.5 bg-zinc-300"}`}
                />
              ))}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-11 w-11 rounded-full bg-white shadow-sm"
              onClick={() => move(1)}
              aria-label="Next challenge"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </section>

        <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-3 px-2 pt-5 text-center sm:flex-row sm:text-left">
          <div>
            <p className="font-semibold text-zinc-950">
              {activeChallenge.title}
            </p>
            <p className="mt-1 text-sm text-zinc-500">
              {activeChallenge.available
                ? "This game mode is ready to play."
              : "This activity is part of the upcoming challenge lineup."}
            </p>
          </div>
          <Button
            type="button"
            onClick={() => selectChallenge(activeChallenge)}
            variant={activeChallenge.available ? "default" : "secondary"}
          >
            {activeChallenge.available ? "Start challenge" : "Notify me"}
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
