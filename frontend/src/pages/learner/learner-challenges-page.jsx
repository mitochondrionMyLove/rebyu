import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Code2, Database, Flame, Network, Timer, Trophy } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { LearnerPageHeader } from "@/components/learner/learner-ui.jsx"

const challenges = [
  {
    title: "CodeStrike",
    description: "Coding practice challenges for algorithmic and implementation skills.",
    icon: Code2,
    tag: "Practice",
    available: false,
  },
  {
    title: "BlueprintArena",
    description: "System design prompts for architecture and diagram reasoning.",
    icon: Network,
    tag: "Design",
    available: false,
  },
  {
    title: "QueryRealm",
    description: "SQL and ERD practice for data modeling and querying.",
    icon: Database,
    tag: "Database",
    available: false,
  },
  {
    title: "Sprint Challenge",
    description: "Timed short practice challenge using the existing challenge experience.",
    icon: Timer,
    tag: "Timed",
    available: true,
    route: "/challenges",
  },
  {
    title: "Daily Ranked Exam Challenge",
    description: "Daily assessment challenge for exam readiness.",
    icon: Flame,
    tag: "Daily",
    available: false,
  },
]

export default function LearnerChallengesPage() {
  const navigate = useNavigate()
  const [selectedComingSoon, setSelectedComingSoon] = useState("")

  const showComingSoon = (title) => {
    setSelectedComingSoon(title)
    toast.info(`${title} is coming soon`, {
      description: "This challenge is visually prepared and will activate when its backend flow is available.",
    })
  }

  return (
    <div className="space-y-7">
      <LearnerPageHeader
        title="Challenges"
        subtitle="Practice with focused challenge modes. Available modes open existing REBYU challenge features."
      />

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {challenges.map((challenge) => {
          const Icon = challenge.icon
          return (
            <article
              key={challenge.title}
              className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-800">
                  <Icon className="h-6 w-6" />
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                    challenge.available
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-zinc-100 text-zinc-600"
                  }`}
                >
                  {challenge.available ? "Available" : "Coming Soon"}
                </span>
              </div>
              <h2 className="mt-5 text-lg font-semibold text-zinc-950">
                {challenge.title}
              </h2>
              <p className="mt-2 min-h-12 text-sm leading-6 text-zinc-500">
                {challenge.description}
              </p>
              <div className="mt-4 flex items-center justify-between gap-3">
                <span className="rounded-full bg-zinc-50 px-2.5 py-1 text-xs font-medium text-zinc-500">
                  {challenge.tag}
                </span>
                <Button
                  onClick={() =>
                    challenge.available
                      ? navigate(challenge.route)
                      : showComingSoon(challenge.title)
                  }
                  variant={challenge.available ? "default" : "outline"}
                >
                  {challenge.available ? "Start Challenge" : "Notify Me"}
                </Button>
              </div>
            </article>
          )
        })}
      </div>

      {selectedComingSoon && (
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <Trophy className="h-5 w-5 text-zinc-500" />
            <p className="text-sm text-zinc-600">
              {selectedComingSoon} will appear here when its challenge route and scoring APIs are available.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
