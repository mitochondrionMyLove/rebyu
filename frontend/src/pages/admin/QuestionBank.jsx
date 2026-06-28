import React, { useState } from "react"
import {
  BookOpen,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  CircleHelp,
  Code2,
  FileQuestion,
  FileText,
  ListChecks,
  Search,
  Workflow,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

const sampleCertifications = [
  {
    id: "topcit",
    name: "TOPCIT",
  },
  {
    id: "it-passport",
    name: "IT Passport",
  },
  {
    id: "fe",
    name: "Fundamentals of Engineering",
  },
]

const questionTypes = [
  {
    title: "Multiple Choice",
    description: "Choose from answer options",
    icon: ListChecks,
  },
  {
    title: "Short Answer",
    description: "Brief text response",
    icon: FileText,
  },
  {
    title: "Descriptive",
    description: "Written explanation",
    icon: FileQuestion,
  },
  {
    title: "Programming",
    description: "Code-based problem",
    icon: Code2,
  },
  {
    title: "Diagram",
    description: "ERD, UML, flowchart, or DFD",
    icon: Workflow,
  },
]

function QuestionTypeButton({ title, description, icon: Icon }) {
  return (
    <Button
      type="button"
      variant="outline"
      className="h-auto w-full justify-start gap-3 whitespace-normal px-3 py-3 text-left"
    >
      <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />

      <span className="min-w-0 text-left">
        <span className="block text-sm font-medium">{title}</span>

        <span className="mt-0.5 block text-xs font-normal leading-4 text-muted-foreground">
          {description}
        </span>
      </span>
    </Button>
  )
}

function QuestionBank() {
  const [activeTab, setActiveTab] = useState("all-questions")

  return (
    <section className="flex h-full min-h-0 flex-col overflow-hidden py-0">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex h-full min-h-0 flex-1 flex-col"
      >
        {/* PAGE HEADER */}
        <header className="shrink-0 border-b border-border bg-background py-5">
          <div>
            <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
              Question Bank
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Create and manage questions for certifications, quizzes, and
              exams.
            </p>
          </div>
        </header>

        {/* TABS + QUESTION BUILDER ACTIONS */}
        <div className="flex shrink-0 items-center justify-between border-b border-border bg-background">
          <TabsList className="h-11 w-fit rounded-none bg-transparent p-0">
            <TabsTrigger
              value="all-questions"
              className="h-11 rounded-none border-b-2 border-transparent px-4 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              <ListChecks className="mr-2 h-4 w-4" />
              All Questions
            </TabsTrigger>

            <TabsTrigger
              value="question-builder"
              className="h-11 rounded-none border-b-2 border-transparent px-4 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              <BookOpen className="mr-2 h-4 w-4" />
              Question Builder
            </TabsTrigger>
          </TabsList>

          {activeTab === "question-builder" && (
            <div className="flex shrink-0 items-center gap-2">
              <Button type="button" variant="outline" size="sm">
                Preview
              </Button>

              <Button type="button" variant="outline" size="sm">
                Save Draft
              </Button>

              <Button type="button" size="sm">
                Publish
              </Button>
            </div>
          )}
        </div>

        {/* ALL QUESTIONS */}
        <TabsContent
          value="all-questions"
          className="m-0 min-h-0 flex-1 overflow-y-auto py-5"
        >
          <div className="w-full">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="font-heading text-xl font-bold tracking-tight text-foreground">
                  Questions
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Select a certification to view and manage its questions.
                </p>
              </div>
            </div>

            {/* FILTERS */}
            <Card className="mt-5">
              <CardContent className="p-4">
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(220px,1fr)_190px_170px_150px_160px]">
                  <div className="relative">
                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                    <Input
                      placeholder="Search questions..."
                      className="pl-9"
                      disabled
                    />
                  </div>

                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select certification" />
                    </SelectTrigger>

                    <SelectContent>
                      {sampleCertifications.map((certification) => (
                        <SelectItem
                          key={certification.id}
                          value={certification.id}
                        >
                          {certification.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select disabled>
                    <SelectTrigger>
                      <SelectValue placeholder="Select lesson" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="sample-lesson">
                        Sample Lesson
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  <Select disabled>
                    <SelectTrigger>
                      <SelectValue placeholder="Question type" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="mcq">
                        Multiple Choice
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  <Select disabled>
                    <SelectTrigger>
                      <SelectValue placeholder="Difficulty" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* TABLE */}
            <Card className="mt-4 overflow-hidden">
              <div className="overflow-x-auto">
                <Table className="min-w-[1000px]">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-72">Question</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Lesson</TableHead>
                      <TableHead>Difficulty</TableHead>
                      <TableHead className="text-center">Points</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Updated</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    <TableRow>
                      <TableCell colSpan={8} className="h-[390px]">
                        <div className="flex h-full flex-col items-center justify-center px-6 text-center">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                            <FileQuestion className="h-5 w-5 text-muted-foreground" />
                          </div>

                          <h3 className="mt-4 font-heading text-base font-bold text-foreground">
                            Select a certification
                          </h3>

                          <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
                            Choose a certification above to view its questions.
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <Separator />

              <div className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted-foreground">
                  No certification selected
                </p>

                <div className="flex items-center gap-1">
                  <Button type="button" variant="outline" size="icon" disabled>
                    <ChevronsLeft className="h-4 w-4" />
                  </Button>

                  <Button type="button" variant="outline" size="icon" disabled>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  <Button type="button" variant="outline" size="sm" disabled>
                    1
                  </Button>

                  <Button type="button" variant="outline" size="icon" disabled>
                    <ChevronRight className="h-4 w-4" />
                  </Button>

                  <Button type="button" variant="outline" size="icon" disabled>
                    <ChevronsRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* QUESTION BUILDER */}
        <TabsContent
          value="question-builder"
          className="m-0 min-h-0 flex-1 overflow-hidden py-5 data-[state=active]:flex data-[state=active]:flex-col"
        >
          <div className="grid min-h-0 w-full flex-1 overflow-hidden rounded-xl border border-border bg-background shadow-sm xl:grid-cols-[260px_minmax(0,1fr)_300px]">
            {/* LEFT PANEL */}
            <aside className="min-h-0 overflow-y-auto border-b border-border xl:border-r xl:border-b-0">
              <div className="space-y-4 p-4">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Course Structure
                  </p>

                  <Select defaultValue="topcit">
                    <SelectTrigger className="mt-3">
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      {sampleCertifications.map((certification) => (
                        <SelectItem
                          key={certification.id}
                          value={certification.id}
                        >
                          {certification.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="relative">
                  <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                  <Input placeholder="Search lessons..." className="pl-9" />
                </div>

                <Separator />

                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2 px-2 py-1.5 font-medium">
                    <ChevronDown className="h-4 w-4" />
                    TOPCIT
                  </div>

                  <div className="flex items-center gap-2 py-1.5 pl-6 text-muted-foreground">
                    <ChevronDown className="h-4 w-4" />
                    Software Development
                  </div>

                  <div className="flex items-center gap-2 py-1.5 pl-10 text-muted-foreground">
                    <ChevronDown className="h-4 w-4" />
                    Database Fundamentals
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    className="h-8 w-full justify-start pl-14 font-normal"
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Database Keys
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    className="h-8 w-full justify-start pl-14 font-normal"
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Normalization
                  </Button>

                  <Button
                    type="button"
                    variant="secondary"
                    className="h-8 w-full justify-start pl-14 font-medium"
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    ERD Fundamentals
                  </Button>

                  <div className="mt-3 flex items-center gap-2 px-2 py-1.5 text-muted-foreground">
                    <ChevronRight className="h-4 w-4" />
                    Software Engineering
                  </div>

                  <div className="flex items-center gap-2 px-2 py-1.5 text-muted-foreground">
                    <ChevronRight className="h-4 w-4" />
                    IT Business
                  </div>
                </div>

                <Card>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm">Selected Lesson</CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-3 p-4 pt-2 text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Certification
                      </p>
                      <p>TOPCIT</p>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground">
                        Category
                      </p>
                      <p>Software Development</p>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground">Lesson</p>
                      <p>ERD Fundamentals</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </aside>

            {/* CENTER PANEL */}
            <main className="min-w-0 min-h-0 overflow-y-auto bg-muted/20">
              <div className="mx-auto w-full max-w-4xl p-5 sm:p-6">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Selected Lesson
                  </p>

                  <h2 className="mt-1 font-heading text-2xl font-bold tracking-tight text-foreground">
                    ERD Fundamentals
                  </h2>

                  <p className="mt-2 text-sm text-muted-foreground">
                    Add questions for this lesson under Database Fundamentals.
                  </p>
                </div>

                <Card className="mt-6">
                  <CardContent className="flex min-h-[440px] flex-col items-center justify-center px-6 py-10 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                      <CircleHelp className="h-5 w-5 text-muted-foreground" />
                    </div>

                    <h3 className="mt-4 font-heading text-base font-bold text-foreground">
                      Start creating a question
                    </h3>

                    <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
                      Choose a question type from the panel on the right to
                      create a question for this lesson.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </main>

            {/* RIGHT PANEL */}
            <aside className="flex min-h-0 flex-col border-t border-border bg-background xl:border-t-0 xl:border-l">
              <div className="min-h-0 flex-1 overflow-y-auto">
                <div className="space-y-4 p-4">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Add Question
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                      Select a question type for this lesson.
                    </p>
                  </div>

                  <div className="space-y-2">
                    {questionTypes.map((questionType) => (
                      <QuestionTypeButton
                        key={questionType.title}
                        title={questionType.title}
                        description={questionType.description}
                        icon={questionType.icon}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="shrink-0 border-t border-border p-4">
                <Card>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm">Lesson Summary</CardTitle>
                  </CardHeader>

                  <CardContent className="grid grid-cols-3 gap-2 p-4 pt-2 text-center">
                    <div>
                      <p className="text-lg font-semibold">0</p>
                      <p className="text-xs text-muted-foreground">
                        Questions
                      </p>
                    </div>

                    <div>
                      <p className="text-lg font-semibold">0</p>
                      <p className="text-xs text-muted-foreground">
                        Points
                      </p>
                    </div>

                    <div>
                      <p className="text-lg font-semibold">—</p>
                      <p className="text-xs text-muted-foreground">
                        Difficulty
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </aside>
          </div>
        </TabsContent>
      </Tabs>
    </section>
  )
}

export default QuestionBank
