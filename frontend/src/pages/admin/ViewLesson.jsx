import React, { useState } from "react"
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Circle,
  Menu,
  X,
} from "lucide-react"

const lessonModules = [
  {
    id: "module-1",
    title: "Module 1: Introduction to Cybersecurity",
    sections: [
      {
        id: "section-1-1",
        title: "1.1. The World of Cybersecurity",
        topics: [
          {
            id: "topic-1-1-1",
            title: "1.1.1 What Is Cybersecurity?",
            completed: true,
            content: {
              title: "1.1.1 What Is Cybersecurity?",
              description:
                "Cybersecurity is the practice of protecting devices, networks, systems, and data from unauthorized access, attacks, or damage.",
              instruction:
                "Learn the basic concepts of cybersecurity and why protecting information is important.",
              cards: [],
            },
          },
          {
            id: "topic-1-1-2",
            title: "1.1.2 Protecting Your Personal Data",
            completed: false,
            content: {
              title: "1.1.2 Protecting Your Personal Data",
              description:
                "Personal data is any information that can be used to identify you, and it can exist both offline and online.",
              instruction:
                "Select the images to find out the difference between your offline and online identity.",
              cards: [
                {
                  title: "Offline Identity",
                  description:
                    "Your offline identity includes information you share or use in real life, such as your name, school ID, address, phone number, and documents.",
                  image:
                    "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=900&q=80",
                },
                {
                  title: "Online Identity",
                  description:
                    "Your online identity includes your social-media profiles, email address, usernames, passwords, online posts, and browsing activity.",
                  image:
                    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
                },
              ],
            },
          },
          {
            id: "topic-1-1-3",
            title: "1.1.3 Your Online Identity",
            completed: false,
            content: {
              title: "1.1.3 Your Online Identity",
              description:
                "Your online identity is the collection of information that represents you on the internet.",
              instruction:
                "Review the examples below and identify which details form part of an online identity.",
              cards: [],
            },
          },
          {
            id: "topic-1-1-4",
            title: "1.1.4 Your Data",
            completed: false,
            content: {
              title: "1.1.4 Your Data",
              description:
                "Your data can include personal details, account information, files, activity history, and communication records.",
              instruction:
                "Understand which personal details should be protected.",
              cards: [],
            },
          },
          {
            id: "topic-1-1-5",
            title: "1.1.5 Where Is Your Data?",
            completed: false,
            content: {
              title: "1.1.5 Where Is Your Data?",
              description:
                "Personal data can be stored on devices, cloud platforms, social networks, websites, and company databases.",
              instruction:
                "Explore where your personal data may be stored.",
              cards: [],
            },
          },
          {
            id: "topic-1-1-6",
            title: "1.1.6 What's More...",
            completed: false,
            content: {
              title: "1.1.6 What's More...",
              description:
                "Cybersecurity affects many areas of everyday life, including education, work, banking, shopping, and communication.",
              instruction:
                "Review more examples of cybersecurity in daily life.",
              cards: [],
            },
          },
          {
            id: "topic-1-1-7",
            title: "1.1.7 Smart Devices",
            completed: false,
            content: {
              title: "1.1.7 Smart Devices",
              description:
                "Smart devices can collect and exchange information through the internet.",
              instruction:
                "Identify the cybersecurity risks of connected devices.",
              cards: [],
            },
          },
          {
            id: "topic-1-1-8",
            title: "1.1.8 What Do Hackers Want?",
            completed: false,
            content: {
              title: "1.1.8 What Do Hackers Want?",
              description:
                "Hackers may target money, personal information, access to systems, or sensitive company data.",
              instruction:
                "Learn why attackers target people and organizations.",
              cards: [],
            },
          },
          {
            id: "topic-1-1-9",
            title: "1.1.9 Identity Theft",
            completed: false,
            content: {
              title: "1.1.9 Identity Theft",
              description:
                "Identity theft happens when someone steals and misuses another person's personal information.",
              instruction:
                "Learn how identity theft can happen and how to prevent it.",
              cards: [],
            },
          },
          {
            id: "topic-1-1-10",
            title: "1.1.10 Who Else Wants My Data?",
            completed: false,
            content: {
              title: "1.1.10 Who Else Wants My Data?",
              description:
                "Different organizations may collect data for services, advertising, analytics, business operations, or security.",
              instruction:
                "Discover the different groups that may request or collect data.",
              cards: [],
            },
          },
        ],
      },
    ],
  },

  {
    id: "module-2",
    title: "Module 2: Organizational Data",
    sections: [
      {
        id: "section-2-1",
        title: "2.1. Protecting Organizational Information",
        topics: [
          {
            id: "topic-2-1-1",
            title: "2.1.1 Company Information",
            completed: false,
            content: {
              title: "2.1.1 Company Information",
              description:
                "Organizations must protect confidential files, customer records, employee data, and business information.",
              instruction:
                "Learn what information should be protected in an organization.",
              cards: [],
            },
          },
          {
            id: "topic-2-1-2",
            title: "2.1.2 Data Classification",
            completed: false,
            content: {
              title: "2.1.2 Data Classification",
              description:
                "Data classification helps organizations identify how sensitive a piece of information is.",
              instruction:
                "Understand how information can be categorized based on sensitivity.",
              cards: [],
            },
          },
        ],
      },
    ],
  },
]

function getAllTopics(modules) {
  return modules.flatMap((module) =>
    module.sections.flatMap((section) =>
      section.topics.map((topic) => ({
        ...topic,
        moduleId: module.id,
        sectionId: section.id,
      }))
    )
  )
}

function getSectionProgress(section) {
  const completed = section.topics.filter((topic) => topic.completed).length

  return {
    completed,
    total: section.topics.length,
  }
}

export default function AdminViewLesson() {
  const allTopics = getAllTopics(lessonModules)

  const [activeTopicId, setActiveTopicId] = useState("topic-1-1-2")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const [openModules, setOpenModules] = useState({
    "module-1": true,
    "module-2": false,
  })

  const [openSections, setOpenSections] = useState({
    "section-1-1": true,
    "section-2-1": false,
  })

  const activeTopic =
    allTopics.find((topic) => topic.id === activeTopicId) ?? allTopics[0]

  const activeTopicIndex = allTopics.findIndex(
    (topic) => topic.id === activeTopic.id
  )

  const previousTopic =
    activeTopicIndex > 0 ? allTopics[activeTopicIndex - 1] : null

  const nextTopic =
    activeTopicIndex < allTopics.length - 1
      ? allTopics[activeTopicIndex + 1]
      : null

  function selectTopic(topic) {
    setActiveTopicId(topic.id)

    setOpenModules((previous) => ({
      ...previous,
      [topic.moduleId]: true,
    }))

    setOpenSections((previous) => ({
      ...previous,
      [topic.sectionId]: true,
    }))

    setIsSidebarOpen(false)
  }

  function toggleModule(moduleId) {
    setOpenModules((previous) => ({
      ...previous,
      [moduleId]: !previous[moduleId],
    }))
  }

  function toggleSection(sectionId) {
    setOpenSections((previous) => ({
      ...previous,
      [sectionId]: !previous[sectionId],
    }))
  }

  return (
    <section className="min-h-screen bg-zinc-100">
      <div className="grid min-h-screen lg:grid-cols-[minmax(340px,470px)_1fr]">
        {}
        <aside
          className={`min-h-screen border-r border-zinc-200 bg-white lg:block ${
            isSidebarOpen ? "block" : "hidden"
          }`}
        >
          <div className="flex h-16 items-center justify-between border-b border-zinc-200 px-5">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-lime-600" />

              <div>
                <p className="text-sm font-semibold text-zinc-900">
                  Lesson Content
                </p>

                <p className="text-xs text-zinc-500">
                  Modules, sections, and topics
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsSidebarOpen(false)}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-950 lg:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="h-[calc(100vh-4rem)] overflow-y-auto">
            {lessonModules.map((module) => {
              const isModuleOpen = openModules[module.id]

              return (
                <div
                  key={module.id}
                  className="border-b border-zinc-200 last:border-b-0"
                >
                  {}
                  <button
                    type="button"
                    onClick={() => toggleModule(module.id)}
                    className="flex w-full items-center justify-between gap-3 bg-emerald-50 px-4 py-4 text-left transition hover:bg-emerald-100"
                  >
                    <span className="text-sm font-bold text-zinc-900">
                      {module.title}
                    </span>

                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-lime-600 text-white">
                      {isModuleOpen ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </span>
                  </button>

                  {isModuleOpen &&
                    module.sections.map((section) => {
                      const isSectionOpen = openSections[section.id]
                      const progress = getSectionProgress(section)
                      const isActiveSection = section.topics.some(
                        (topic) => topic.id === activeTopic.id
                      )

                      return (
                        <div key={section.id}>
                          {}
                          <button
                            type="button"
                            onClick={() => toggleSection(section.id)}
                            className={`flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition ${
                              isActiveSection
                                ? "bg-lime-100"
                                : "bg-white hover:bg-zinc-50"
                            }`}
                          >
                            <div className="flex min-w-0 items-center gap-3">
                              <span
                                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
                                  isActiveSection
                                    ? "border-lime-500 bg-white text-lime-600"
                                    : "border-zinc-300 bg-white text-zinc-400"
                                }`}
                              >
                                {progress.completed === progress.total ? (
                                  <CheckCircle2 className="h-4 w-4" />
                                ) : (
                                  <Circle className="h-3 w-3 fill-current" />
                                )}
                              </span>

                              <span
                                className={`truncate text-sm font-semibold ${
                                  isActiveSection
                                    ? "text-zinc-950"
                                    : "text-zinc-700"
                                }`}
                              >
                                {section.title}
                              </span>
                            </div>

                            <div className="flex shrink-0 items-center gap-3">
                              <span className="text-[11px] font-medium text-zinc-600">
                                {progress.completed} / {progress.total}
                              </span>

                              {isSectionOpen ? (
                                <ChevronDown className="h-4 w-4 text-zinc-500" />
                              ) : (
                                <ChevronRight className="h-4 w-4 text-zinc-500" />
                              )}
                            </div>
                          </button>

                          {}
                          {isSectionOpen && (
                            <div className="bg-[#f8fcf8] px-4 py-2">
                              <div className="ml-3 border-l border-dashed border-lime-400 pl-5">
                                {section.topics.map((topic) => {
                                  const isActive =
                                    topic.id === activeTopic.id

                                  const topicWithParent = {
                                    ...topic,
                                    moduleId: module.id,
                                    sectionId: section.id,
                                  }

                                  return (
                                    <button
                                      key={topic.id}
                                      type="button"
                                      onClick={() =>
                                        selectTopic(topicWithParent)
                                      }
                                      className="group relative flex w-full items-center gap-3 py-2.5 text-left"
                                    >
                                      <span
                                        className={`absolute -left-[31px] flex h-5 w-5 items-center justify-center rounded-full border bg-white ${
                                          isActive
                                            ? "border-lime-500 text-lime-600"
                                            : "border-lime-300 text-lime-400"
                                        }`}
                                      >
                                        {topic.completed ? (
                                          <CheckCircle2 className="h-3.5 w-3.5" />
                                        ) : (
                                          <ChevronRight className="h-3 w-3" />
                                        )}
                                      </span>

                                      <span
                                        className={`text-sm transition ${
                                          isActive
                                            ? "font-bold text-zinc-950"
                                            : "font-medium text-zinc-700 group-hover:text-zinc-950"
                                        }`}
                                      >
                                        {topic.title}
                                      </span>
                                    </button>
                                  )
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                </div>
              )
            })}
          </div>
        </aside>

        {}
        <main className="min-w-0 overflow-x-hidden">
          <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-zinc-200 bg-white px-4 sm:px-7">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-700 transition hover:bg-zinc-100 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>

            <p className="hidden text-sm font-medium text-zinc-500 sm:block">
              Viewing lesson topic
            </p>

            <div className="flex items-center gap-2">
              <span className="hidden rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 sm:inline-flex">
                Admin Preview
              </span>
            </div>
          </header>

          <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-8 lg:px-12 lg:py-12">
            <article className="mx-auto max-w-5xl">
              <div className="flex flex-col gap-4 border-b border-zinc-200 pb-7">
                <span className="w-fit rounded-full bg-lime-100 px-3 py-1 text-xs font-bold text-lime-800">
                  Lesson Topic
                </span>

                <h1 className="text-2xl font-bold tracking-tight text-zinc-950 sm:text-4xl">
                  {activeTopic.content.title}
                </h1>

                <p className="max-w-4xl text-base leading-8 text-zinc-700 sm:text-lg">
                  {activeTopic.content.description}
                </p>

                <p className="font-semibold leading-7 text-zinc-950">
                  {activeTopic.content.instruction}
                </p>
              </div>

              {activeTopic.content.cards.length > 0 ? (
                <div className="mt-10 grid gap-6 md:grid-cols-2">
                  {activeTopic.content.cards.map((card) => (
                    <div
                      key={card.title}
                      className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm"
                    >
                      <img
                        src={card.image}
                        alt={card.title}
                        className="h-72 w-full object-cover sm:h-80"
                      />

                      <div className="p-5">
                        <h2 className="text-lg font-bold text-zinc-950">
                          {card.title}
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-zinc-600">
                          {card.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-10 rounded-2xl border border-dashed border-zinc-300 bg-white px-6 py-16 text-center">
                  <BookOpen className="mx-auto h-8 w-8 text-zinc-400" />

                  <h2 className="mt-4 text-lg font-semibold text-zinc-900">
                    Topic content preview
                  </h2>

                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-500">
                    Add headings, descriptions, images, tabs, flip cards, or
                    other lesson tools to display the content for this topic.
                  </p>
                </div>
              )}

              <div className="mt-12 flex items-center justify-between gap-4 border-t border-zinc-200 pt-6">
                <button
                  type="button"
                  disabled={!previousTopic}
                  onClick={() => previousTopic && selectTopic(previousTopic)}
                  className="flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Previous
                </button>

                <button
                  type="button"
                  disabled={!nextTopic}
                  onClick={() => nextTopic && selectTopic(nextTopic)}
                  className="flex items-center gap-2 rounded bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </article>
          </div>
        </main>
      </div>
    </section>
  )
}
