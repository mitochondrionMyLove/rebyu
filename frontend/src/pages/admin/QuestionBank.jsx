import React, { useMemo, useState } from "react"
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Code2,
  FileQuestion,
  FileText,
  ListChecks,
  Plus,
  Search,
  Trash2,
  Workflow,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectGroup,
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
import { Textarea } from "@/components/ui/textarea"
import { useQuery } from "@tanstack/react-query"

import { getAllCertifications } from "../../services/certificationService.js"

const questionTypes = [
  {
    id: "MCQ",
    title: "Multiple Choice",
    description: "Choose from answer options",
    icon: ListChecks,
    component: MultipleChoices
  },
  {
    id: "SHORT_ANSWER",
    title: "Short Answer",
    description: "Brief text response",
    icon: FileText,
    component: ShortAnswer
  },
  {
    id: "DESCRIPTIVE",
    title: "Descriptive",
    description: "Written explanation or rubric-based answer",
    icon: FileQuestion,
    component: Descriptive
  },
  {
    id: "PROGRAMMING",
    title: "Programming",
    description: "Code-based problem",
    icon: Code2,
    component: Programming
  },
  {
    id: "DIAGRAM",
    title: "Diagram",
    description: "ERD, UML, flowchart, or DFD problem",
    icon: Workflow,
    component: Diagram
  },
]

function createLocalId() {
  return crypto.randomUUID()
}

function getQuestionFieldName(questionKey, fieldName) {
  return `questions[${questionKey}].${fieldName}`
}

function ImageUpload({
                       id,
                       name,
                       label = "Image",
                       description = "Upload a JPG, PNG, WebP, or GIF image.",
                     }) {
  return (
      <div className="space-y-2">
        <Label htmlFor={id} className="text-xs font-medium">
          {label}
        </Label>

        <Input
            id={id}
            name={name}
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
            className="h-9 cursor-pointer text-xs file:mr-3 file:rounded-md file:border-0 file:bg-muted file:px-3 file:py-1 file:text-xs file:font-medium file:text-foreground hover:file:bg-muted/80"
        />

        <p className="text-xs text-muted-foreground">
          {description}
        </p>
      </div>
  )
}

function CompactQuestionCard({ type, title, children }) {
  return (
      <Card className="overflow-hidden shadow-sm">
        <CardContent className="space-y-4 p-4">
          <div className="flex min-w-0 items-center gap-2 border-b border-border pb-3">
          <span className="rounded-md bg-muted px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            {type}
          </span>

            <p className="min-w-0 truncate text-sm font-semibold text-foreground">
              {title}
            </p>
          </div>

          {children}
        </CardContent>
      </Card>
  )
}

function DifficultySelect({ questionKey }) {
  const [difficulty, setDifficulty] = useState("average")

  return (
      <>
        <input
            type="hidden"
            name={getQuestionFieldName(questionKey, "difficulty_level")}
            value={difficulty}
        />

        <Select value={difficulty} onValueChange={setDifficulty}>
          <SelectTrigger className="w-full sm:w-36">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="easy">Easy</SelectItem>
            <SelectItem value="average">Average</SelectItem>
            <SelectItem value="hard">Hard</SelectItem>
          </SelectContent>
        </Select>
      </>
  )
}

function CheckingMethodSelect({
                                questionKey,
                                defaultValue = "EXACT_MATCH",
                              }) {
  const [checkingMethod, setCheckingMethod] = useState(defaultValue)

  return (
      <>
        <input
            type="hidden"
            name={getQuestionFieldName(questionKey, "checking_method")}
            value={checkingMethod}
        />

        <Select
            value={checkingMethod}
            onValueChange={setCheckingMethod}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Checking method" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="EXACT_MATCH">
              Exact Match
            </SelectItem>

            <SelectItem value="AI_SEMANTIC">
              AI Semantic
            </SelectItem>
          </SelectContent>
        </Select>
      </>
  )
}

function DiagramTypeSelect({ questionKey }) {
  const [diagramType, setDiagramType] = useState("ERD")

  return (
      <>
        <input
            type="hidden"
            name={getQuestionFieldName(questionKey, "diagram_type")}
            value={diagramType}
        />

        <Select value={diagramType} onValueChange={setDiagramType}>
          <SelectTrigger>
            <SelectValue placeholder="Select diagram type" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="ERD">ERD</SelectItem>

            <SelectItem value="UML_CLASS">
              UML Class Diagram
            </SelectItem>

            <SelectItem value="FLOWCHART">
              Flowchart
            </SelectItem>

            <SelectItem value="DFD">
              Data Flow Diagram
            </SelectItem>
          </SelectContent>
        </Select>
      </>
  )
}

function QuestionMetaFields({ questionKey }) {
  return (
      <div className="border-t border-border pt-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">
              Difficulty Level
            </p>

            <p className="mt-0.5 text-xs text-muted-foreground">
              Points are assigned later in quizzes, middle exams, or mock exams.
            </p>
          </div>

          <DifficultySelect questionKey={questionKey} />
        </div>
      </div>
  )
}

function QuestionPromptFields({ questionKey }) {
  return (
      <div className="space-y-3">
        <div className="space-y-2">
          <Label
              htmlFor={`${questionKey}-question-text`}
              className="text-sm font-medium"
          >
            Question Prompt
          </Label>

          <Textarea
              id={`${questionKey}-question-text`}
              name={getQuestionFieldName(questionKey, "question_text")}
              placeholder="Write the question, scenario, or instructions..."
              className="min-h-24 resize-y"
          />
        </div>

        <details className="rounded-md border border-dashed border-border px-3 py-2">
          <summary className="cursor-pointer text-xs font-medium text-muted-foreground">
            Add question image
          </summary>

          <div className="mt-3">
            <ImageUpload
                id={`${questionKey}-question-image`}
                name={getQuestionFieldName(questionKey, "image_file")}
                label="Question Image"
                description="Optional image displayed with the question."
            />
          </div>
        </details>
      </div>
  )
}

function MultipleChoices({ questionKey }) {
  const defaultChoices = ["A", "B", "C", "D"]

  return (
      <CompactQuestionCard type="MCQ" title="Multiple Choice Question">
        <input
            type="hidden"
            name={getQuestionFieldName(questionKey, "question_type")}
            value="MCQ"
        />

        <QuestionPromptFields questionKey={questionKey} />

        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium text-foreground">
              Answer Choices
            </p>

            <p className="text-xs text-muted-foreground">
              Select one correct answer.
            </p>
          </div>

          <RadioGroup
              name={getQuestionFieldName(
                  questionKey,
                  "correct_choice_index"
              )}
              className="grid gap-3 sm:grid-cols-2"
          >
            {defaultChoices.map((letter, index) => (
                <div
                    key={letter}
                    className="rounded-md border border-border bg-muted/20 p-3"
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem
                        id={`${questionKey}-correct-${index}`}
                        value={String(index)}
                        className="shrink-0"
                    />

                    <Label
                        htmlFor={`${questionKey}-correct-${index}`}
                        className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded border bg-background text-xs font-semibold"
                    >
                      {letter}
                    </Label>

                    <Input
                        name={getQuestionFieldName(
                            questionKey,
                            `choices[${index}].choice_text`
                        )}
                        placeholder={`Choice ${letter}`}
                        className="h-8 min-w-0"
                    />
                  </div>

                  <details className="mt-3">
                    <summary className="cursor-pointer text-xs text-muted-foreground">
                      Add image or explanation
                    </summary>

                    <div className="mt-3 space-y-3">
                      <ImageUpload
                          id={`${questionKey}-choice-image-${index}`}
                          name={getQuestionFieldName(
                              questionKey,
                              `choices[${index}].image_file`
                          )}
                          label="Choice Image"
                          description="Optional image for this answer choice."
                      />

                      <Textarea
                          name={getQuestionFieldName(
                              questionKey,
                              `choices[${index}].explanation`
                          )}
                          placeholder="Optional explanation..."
                          className="min-h-16 resize-y text-xs"
                      />
                    </div>
                  </details>
                </div>
            ))}
          </RadioGroup>
        </div>

        <QuestionMetaFields questionKey={questionKey} />
      </CompactQuestionCard>
  )
}

function ShortAnswer({ questionKey }) {
  return (
      <CompactQuestionCard type="Short Answer" title="Short Answer Question">
        <input
            type="hidden"
            name={getQuestionFieldName(questionKey, "question_type")}
            value="SHORT_ANSWER"
        />

        <QuestionPromptFields questionKey={questionKey} />

        <div className="grid gap-3 border-t border-border pt-4 sm:grid-cols-[minmax(0,1fr)_180px]">
          <div className="space-y-2">
            <Label
                htmlFor={`${questionKey}-correct-answer`}
                className="text-sm font-medium"
            >
              Correct Answer
            </Label>

            <Textarea
                id={`${questionKey}-correct-answer`}
                name={getQuestionFieldName(questionKey, "correct_answer")}
                placeholder="Accepted answer or keywords..."
                className="min-h-20 resize-y"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Checking Method
            </Label>

            <CheckingMethodSelect questionKey={questionKey} />
          </div>
        </div>

        <QuestionMetaFields questionKey={questionKey} />
      </CompactQuestionCard>
  )
}

function Descriptive({ questionKey }) {
  return (
      <CompactQuestionCard type="Descriptive" title="Descriptive Question">
        <input
            type="hidden"
            name={getQuestionFieldName(questionKey, "question_type")}
            value="DESCRIPTIVE"
        />

        <QuestionPromptFields questionKey={questionKey} />

        <div className="grid gap-3 border-t border-border pt-4 sm:grid-cols-[minmax(0,1fr)_180px]">
          <div className="space-y-2">
            <Label
                htmlFor={`${questionKey}-rubric`}
                className="text-sm font-medium"
            >
              Model Answer / Rubric
            </Label>

            <Textarea
                id={`${questionKey}-rubric`}
                name={getQuestionFieldName(questionKey, "correct_answer")}
                placeholder="Expected explanation, key points, or scoring guide..."
                className="min-h-24 resize-y"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Checking Method
            </Label>

            <CheckingMethodSelect
                questionKey={questionKey}
                defaultValue="AI_SEMANTIC"
            />
          </div>
        </div>

        <QuestionMetaFields questionKey={questionKey} />
      </CompactQuestionCard>
  )
}

function Programming({ questionKey }) {
  const [testCases, setTestCases] = useState(() => [
    {
      id: createLocalId(),
    },
  ])

  function addTestCase() {
    setTestCases((currentTestCases) => [
      ...currentTestCases,
      {
        id: createLocalId(),
      },
    ])
  }

  function removeTestCase(testCaseId) {
    setTestCases((currentTestCases) => {
      if (currentTestCases.length === 1) {
        return currentTestCases
      }

      return currentTestCases.filter(
          (testCase) => testCase.id !== testCaseId
      )
    })
  }

  return (
      <CompactQuestionCard type="Programming" title="Programming Question">
        <input
            type="hidden"
            name={getQuestionFieldName(questionKey, "question_type")}
            value="CRITICAL_THINKING"
        />

        <QuestionPromptFields questionKey={questionKey} />

        <div className="space-y-2 border-t border-border pt-4">
          <Label
              htmlFor={`${questionKey}-starter-code`}
              className="text-sm font-medium"
          >
            Starter Code
            <span className="ml-1 font-normal text-muted-foreground">
            (Optional)
          </span>
          </Label>

          <Textarea
              id={`${questionKey}-starter-code`}
              name={getQuestionFieldName(questionKey, "starter_code")}
              spellCheck={false}
              placeholder="// Optional code template..."
              className="min-h-32 resize-y font-mono text-sm"
          />
        </div>

        <div className="space-y-3 rounded-md border border-dashed border-border p-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-foreground">
                Programming Test Cases
              </p>

              <p className="mt-0.5 text-xs text-muted-foreground">
                Add the input and expected output for every test case.
              </p>
            </div>

            <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addTestCase}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Test Case
            </Button>
          </div>

          <div className="space-y-3">
            {testCases.map((testCase, index) => (
                <div
                    key={testCase.id}
                    className="rounded-md border border-border bg-muted/20 p-3"
                >
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-foreground">
                      Test Case {index + 1}
                    </p>

                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        disabled={testCases.length === 1}
                        onClick={() => removeTestCase(testCase.id)}
                        className="h-8 px-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                      Remove
                    </Button>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label
                          htmlFor={`${questionKey}-test-case-${testCase.id}-input`}
                          className="text-xs font-medium"
                      >
                        Input Data
                      </Label>

                      <Textarea
                          id={`${questionKey}-test-case-${testCase.id}-input`}
                          name={getQuestionFieldName(
                              questionKey,
                              `test_cases[${index}].input_data`
                          )}
                          spellCheck={false}
                          placeholder={"Example:\n5\n10 20 30 40 50"}
                          className="min-h-20 resize-y font-mono text-xs"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                          htmlFor={`${questionKey}-test-case-${testCase.id}-output`}
                          className="text-xs font-medium"
                      >
                        Expected Output
                      </Label>

                      <Textarea
                          id={`${questionKey}-test-case-${testCase.id}-output`}
                          name={getQuestionFieldName(
                              questionKey,
                              `test_cases[${index}].expected_output`
                          )}
                          spellCheck={false}
                          placeholder="Example: 150"
                          className="min-h-20 resize-y font-mono text-xs"
                      />
                    </div>
                  </div>
                </div>
            ))}
          </div>
        </div>

        <QuestionMetaFields questionKey={questionKey} />
      </CompactQuestionCard>
  )
}

function Diagram({ questionKey }) {
  return (
      <CompactQuestionCard type="Diagram" title="Diagram Question">
        <input
            type="hidden"
            name={getQuestionFieldName(questionKey, "question_type")}
            value="CRITICAL_THINKING"
        />

        <QuestionPromptFields questionKey={questionKey} />

        <div className="grid gap-3 border-t border-border pt-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Diagram Type
            </Label>

            <DiagramTypeSelect questionKey={questionKey} />
          </div>

          <div className="space-y-2">
            <Label
                htmlFor={`${questionKey}-instructions`}
                className="text-sm font-medium"
            >
              Instructions
              <span className="ml-1 font-normal text-muted-foreground">
              (Optional)
            </span>
            </Label>

            <Input
                id={`${questionKey}-instructions`}
                name={getQuestionFieldName(questionKey, "instructions")}
                placeholder="Example: Include PK and FK labels."
            />
          </div>
        </div>

        <div className="flex min-h-40 items-center justify-center rounded-md border border-dashed border-border bg-muted/20 px-4 py-6 text-center">
          <div>
            <Workflow className="mx-auto h-5 w-5 text-muted-foreground" />

            <p className="mt-2 text-sm font-medium text-foreground">
              Draw.io Editor Area
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Place your Draw.io diagram editor component here.
            </p>
          </div>
        </div>

        <details className="rounded-md border border-dashed border-border px-3 py-2">
          <summary className="cursor-pointer text-sm font-medium text-foreground">
            Reference Diagram Data
          </summary>

          <div className="mt-3 space-y-3">
            <div className="space-y-2">
              <Label
                  htmlFor={`${questionKey}-diagram-xml`}
                  className="text-xs font-medium"
              >
                Reference Diagram XML
              </Label>

              <Textarea
                  id={`${questionKey}-diagram-xml`}
                  name={getQuestionFieldName(
                      questionKey,
                      "reference_diagram_xml"
                  )}
                  spellCheck={false}
                  placeholder="<mxfile>...</mxfile>"
                  className="min-h-24 resize-y font-mono text-xs"
              />
            </div>

            <div className="space-y-2">
              <Label
                  htmlFor={`${questionKey}-diagram-json`}
                  className="text-xs font-medium"
              >
                Reference Diagram JSON
              </Label>

              <Textarea
                  id={`${questionKey}-diagram-json`}
                  name={getQuestionFieldName(
                      questionKey,
                      "reference_diagram_json"
                  )}
                  spellCheck={false}
                  placeholder={`{
  "nodes": [],
  "connections": []
}`}
                  className="min-h-24 resize-y font-mono text-xs"
              />
            </div>
          </div>
        </details>

        <QuestionMetaFields questionKey={questionKey} />
      </CompactQuestionCard>
  )
}

const getCertificationValue = (certification) =>
    String(
        certification.certificationId ??
        certification.id ??
        certification.title ??
        certification.name ??
        "unknown-certification"
    )

const getCertificationTitle = (certification) =>
    certification.title ?? certification.name ?? "Untitled Certification"

function QuestionTypeButton({ title, description, icon: Icon, setQuestions }) {
  return (
      <Button
          type="button"
          variant="outline"
          className="h-auto w-full justify-start gap-3 whitespace-normal px-3 py-3 text-left"
          onClick={() =>{
            const component = questionTypes.find(item => item.title === title)
            if(component) {
              setQuestions((prev) => [...prev, component.component])
            }
          }}
      >
        <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />

        <span className="min-w-0 text-left">
        <span className="block text-sm font-medium">
          {title}
        </span>

        <span className="mt-0.5 block text-xs font-normal leading-4 text-muted-foreground">
          {description}
        </span>
      </span>
      </Button>
  )
}

function QuestionBank() {
  const [activeTab, setActiveTab] = useState("all-questions")
  const [filterCertificationId, setFilterCertificationId] = useState("")
  const [selectedCertificationId, setSelectedCertificationId] = useState("")
  const [selectedLesson, setSelectedLesson] = useState({})
  const [lessonSearch, setLessonSearch] = useState("")
  const [questions, setQuestions] = useState([])
  const {
    data: certifications = [],
    isPending,
    isError,
  } = useQuery({
    queryKey: ["certifications"],
    queryFn: getAllCertifications,
  })

  const selectedCertification = useMemo(() => {
    return certifications.find(
        (certification) =>
            getCertificationValue(certification) === selectedCertificationId
    )
  }, [certifications, selectedCertificationId])

  const selectedFilterCertification = useMemo(() => {
    return certifications.find(
        (certification) =>
            getCertificationValue(certification) === filterCertificationId
    )
  }, [certifications, filterCertificationId])

  const normalizedLessonSearch = lessonSearch.trim().toLowerCase()

  const hasMatchingLesson =
      selectedCertification?.majorCategory?.some((majorCategory) =>
          majorCategory.middleCategory?.some((middleCategory) =>
              middleCategory.lessons?.some((lesson) =>
                  (lesson.name ?? lesson.title ?? "")
                      .toLowerCase()
                      .includes(normalizedLessonSearch)
              )
          )
      ) ?? false

  function handleBuilderCertificationChange(value) {
    setSelectedCertificationId(value)
    setSelectedLesson(null)
    setLessonSearch("")
  }

  function handleLessonSelect({
                                lesson,
                                lessonId,
                                majorCategoryTitle,
                                middleCategoryTitle,
                              }) {
    setSelectedLesson({
      id: lessonId,
      name: lesson.name ?? lesson.title ?? "Untitled Lesson",
      majorCategoryTitle,
      middleCategoryTitle,
    })
  }

  return (
      <section className="flex h-full min-h-0 flex-col overflow-hidden py-0">
        <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex h-full min-h-0 flex-1 flex-col"
        >
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

          <TabsContent
              value="all-questions"
              className="m-0 min-h-0 flex-1 overflow-y-auto py-5"
          >
            <div className="w-full">
              <div>
                <h2 className="font-heading text-xl font-bold tracking-tight text-foreground">
                  Questions
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Select a certification to view and manage its questions.
                </p>
              </div>

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

                    <Select
                        value={filterCertificationId}
                        onValueChange={setFilterCertificationId}
                        disabled={isPending}
                    >
                      <SelectTrigger className="min-w-0 [&>span]:truncate">
                        <SelectValue placeholder="Select certification" />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectGroup>
                          {certifications.map((certification, index) => (
                              <SelectItem
                                  key={
                                      certification.certificationId ??
                                      certification.id ??
                                      index
                                  }
                                  value={getCertificationValue(certification)}
                                  title={getCertificationTitle(certification)}
                                  className="min-w-0"
                              >
                            <span className="block truncate">
                              {getCertificationTitle(certification)}
                            </span>
                              </SelectItem>
                          ))}
                        </SelectGroup>
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

              <Card className="mt-4 overflow-hidden">
                <div className="overflow-x-auto">
                  <Table className="min-w-[880px]">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-72">
                          Question
                        </TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Lesson</TableHead>
                        <TableHead>Difficulty</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Updated</TableHead>
                        <TableHead className="text-right">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      <TableRow>
                        <TableCell colSpan={7} className="h-[390px]">
                          <div className="flex h-full flex-col items-center justify-center px-6 text-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                              <FileQuestion className="h-5 w-5 text-muted-foreground" />
                            </div>

                            <h3 className="mt-4 font-heading text-base font-bold text-foreground">
                              {selectedFilterCertification
                                  ? "No questions found"
                                  : "Select a certification"}
                            </h3>

                            <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
                              {selectedFilterCertification
                                  ? `Questions for ${getCertificationTitle(
                                      selectedFilterCertification
                                  )} will appear here.`
                                  : "Choose a certification above to view its questions."}
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>

                <Separator />

                <div className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="min-w-0 truncate text-sm text-muted-foreground">
                    {selectedFilterCertification
                        ? `No questions found for ${getCertificationTitle(
                            selectedFilterCertification
                        )}`
                        : "No certification selected"}
                  </p>

                  <div className="flex shrink-0 items-center gap-1">
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

          <TabsContent
              value="question-builder"
              className="m-0 min-h-0 flex-1 overflow-hidden py-5 data-[state=active]:flex data-[state=active]:flex-col "
          >
            <div className=" grid min-h-0 w-full flex-1 overflow-hidden rounded-xl border border-border bg-background shadow-sm xl:grid-cols-[360px_minmax(0,1fr)_300px]">
              <aside className=" min-h-0 overflow-y-auto border-b border-border bg-background xl:border-r xl:border-b-0">
                <div className="space-y-4 p-4">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Course Structure
                    </p>

                    <Select
                        value={selectedCertificationId}
                        onValueChange={handleBuilderCertificationChange}
                        disabled={isPending}
                    >
                      <SelectTrigger className="mt-3 w-full max-w-[328px] min-w-0 [&>span]:truncate">
                        <SelectValue placeholder="Select a certification" />
                      </SelectTrigger>

                      <SelectContent className="w-[var(--radix-select-trigger-width)] max-w-[328px]">
                        <SelectGroup>
                          {certifications.map((certification, index) => (
                              <SelectItem
                                  key={
                                      certification.certificationId ??
                                      certification.id ??
                                      index
                                  }
                                  value={getCertificationValue(certification)}
                                  title={getCertificationTitle(certification)}
                                  className="min-w-0"
                              >
                            <span className="block w-full truncate">
                              {getCertificationTitle(certification)}
                            </span>
                              </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="relative">
                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                    <Input
                        value={lessonSearch}
                        onChange={(event) => setLessonSearch(event.target.value)}
                        placeholder="Search lessons..."
                        className="pl-9"
                        disabled={!selectedCertification}
                    />
                  </div>

                  <Separator />

                  {isError ? (
                      <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-4 text-sm text-destructive">
                        Certifications could not be loaded.
                      </div>
                  ) : !selectedCertification ? (
                      <div className="rounded-lg border border-dashed border-border px-3 py-8 text-center">
                        <p className="text-sm font-medium text-foreground">
                          No certification selected
                        </p>

                        <p className="mt-1 text-xs leading-5 text-muted-foreground">
                          Select a certification to view its course structure.
                        </p>
                      </div>
                  ) : (
                      <div className="space-y-4">
                        {(selectedCertification.majorCategory ?? []).map(
                            (majorCategory, majorIndex) => {
                              const visibleMiddleCategories = (
                                  majorCategory.middleCategory ?? []
                              )
                                  .map((middleCategory) => ({
                                    ...middleCategory,
                                    visibleLessons: (
                                        middleCategory.lessons ?? []
                                    ).filter((lesson) => {
                                      const lessonName = (
                                          lesson.name ??
                                          lesson.title ??
                                          ""
                                      ).toLowerCase()

                                      return (
                                          !normalizedLessonSearch ||
                                          lessonName.includes(normalizedLessonSearch)
                                      )
                                    }),
                                  }))
                                  .filter(
                                      (middleCategory) =>
                                          middleCategory.visibleLessons.length > 0
                                  )

                              if (visibleMiddleCategories.length === 0) {
                                return null
                              }

                              return (
                                  <section
                                      key={`major-${majorIndex}`}
                                      className="overflow-hidden rounded-lg border border-border bg-background"
                                  >
                                    <div className="border-b border-border bg-muted/40 px-3 py-2.5">
                                      <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                                        Major Category
                                      </p>

                                      <p
                                          className="truncate text-sm font-semibold text-foreground"
                                          title={majorCategory.title}
                                      >
                                        {majorCategory.title}
                                      </p>
                                    </div>

                                    <div className="space-y-4 p-3">
                                      {visibleMiddleCategories.map(
                                          (middleCategory, middleIndex) => (
                                              <div
                                                  key={`middle-${majorIndex}-${middleIndex}`}
                                                  className="min-w-0"
                                              >
                                                <div className="mb-1.5 flex min-w-0 items-center gap-2 px-2">
                                                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />

                                                  <p
                                                      className="min-w-0 flex-1 truncate text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                                                      title={middleCategory.title}
                                                  >
                                                    {middleCategory.title}
                                                  </p>

                                                  <span className="shrink-0 text-[11px] text-muted-foreground">
                                        {
                                          middleCategory.visibleLessons
                                              .length
                                        }
                                      </span>
                                                </div>

                                                <div className="space-y-1">
                                                  {middleCategory.visibleLessons.map(
                                                      (lesson, lessonIndex) => {
                                                        const lessonId = String(
                                                            lesson.lessonId ??
                                                            lesson.id ??
                                                            `lesson-${majorIndex}-${middleIndex}-${lessonIndex}`
                                                        )

                                                        const lessonName =
                                                            lesson.name ??
                                                            lesson.title ??
                                                            "Untitled Lesson"

                                                        const isSelected =
                                                            selectedLesson?.id === lessonId

                                                        return (
                                                            <button
                                                                key={lessonId}
                                                                type="button"
                                                                aria-pressed={isSelected}
                                                                title={lessonName}
                                                                onClick={() =>
                                                                    handleLessonSelect({
                                                                      lesson,
                                                                      lessonId,
                                                                      majorCategoryTitle:
                                                                      majorCategory.title,
                                                                      middleCategoryTitle:
                                                                      middleCategory.title,
                                                                    })
                                                                }
                                                                className={`flex w-full min-w-0 items-center gap-2 rounded-md px-2 py-2 text-left text-sm transition ${
                                                                    isSelected
                                                                        ? "bg-primary text-primary-foreground"
                                                                        : "text-foreground hover:bg-muted"
                                                                }`}
                                                            >
                                                              <FileText
                                                                  className={`h-4 w-4 shrink-0 ${
                                                                      isSelected
                                                                          ? "text-primary-foreground"
                                                                          : "text-muted-foreground"
                                                                  }`}
                                                              />

                                                              <span className="min-w-0 flex-1 truncate">
                                                {lessonName}
                                              </span>
                                                            </button>
                                                        )
                                                      }
                                                  )}
                                                </div>
                                              </div>
                                          )
                                      )}
                                    </div>
                                  </section>
                              )
                            }
                        )}

                        {normalizedLessonSearch && !hasMatchingLesson && (
                            <div className="rounded-lg border border-dashed border-border px-3 py-6 text-center">
                              <p className="text-sm font-medium text-foreground">
                                No lessons found
                              </p>

                              <p className="mt-1 text-xs text-muted-foreground">
                                Try another lesson name.
                              </p>
                            </div>
                        )}
                      </div>
                  )}
                </div>
              </aside>

              <main className="min-w-0 min-h-0 overflow-y-auto bg-muted/20">

                <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 p-5 sm:p-6">
                  <p>
                    {!selectedLesson ? 'dfds' : selectedLesson.name}
                    fdsa
                  </p>
                  {
                    questions.length == 0 ? ('Use the tool from the right to add a question'):(
                        questions.map((question, index) =>{
                          const Question = question
                          return <Question key={index} />
                        })
                    )
                  }
                </div>
              </main>

              <aside className="flex min-h-0 flex-col border-t border-border bg-background xl:border-t-0 xl:border-l sticky">
                <div className="min-h-0 flex-1 overflow-y-auto">
                  <div className="space-y-4 p-4">
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Add Question
                      </p>

                      <p className="mt-1 text-sm text-muted-foreground">
                        Select a question type for the selected lesson.
                      </p>
                    </div>

                    <div className="space-y-2">

                      {questionTypes.map((questionType) => (
                          <QuestionTypeButton
                              key={questionType.id}
                              title={questionType.title}
                              description={questionType.description}
                              icon={questionType.icon}
                              setQuestions={setQuestions}
                          />
                      ))}
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </TabsContent>
        </Tabs>
      </section>
  )
}

export default QuestionBank