import React, {
    useEffect,
    useMemo,
    useState,
} from "react"

import {
    AlertCircle,
    BookOpen,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Code2,
    FileQuestion,
    FileText,
    ListChecks,
    Maximize,
    Plus,
    Search,
    Trash2,
    Workflow,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
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
import DiagramArea from "../../components/challenges/diagram-area.jsx"
import BigDialog from "../../components/commons/dialog.jsx"
import {
    extractDiagramData,
} from "../../utils/diagram-graph.js"
import {saveQuestions, saveDiagramQuestions, saveProgrammingQuestions, saveChoices, saveTextQuestion} from "../../services/questionService.js";

const ALLOWED_IMAGE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
]

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024


const questionTypes = [
    {
        id: "MCQ",
        title: "Multiple Choice",
        description: "Choose from answer options",
        icon: ListChecks,
        component: MultipleChoices,
        data: {
            questionType: "MCQ",
            question: "",
            image: null,
            choices: [
                {
                    choiceText: "",
                    image: null,
                    explanation: "",
                    isCorrect: false,
                },
                {
                    choiceText: "",
                    image: null,
                    explanation: "",
                    isCorrect: false,
                },
                {
                    choiceText: "",
                    image: null,
                    explanation: "",
                    isCorrect: false,
                },
                {
                    choiceText: "",
                    image: null,
                    explanation: "",
                    isCorrect: false,
                },
            ],
            correctChoiceIndex: null,
            difficulty: "average",
        },
    },
    {
        id: "SHORT_ANSWER",
        title: "Short Answer",
        description: "Brief text response",
        icon: FileText,
        component: ShortAnswer,
        data: {
            questionType: "SHORT_ANSWER",
            question: "",
            image: null,
            correctAnswer: "",
            checkingMethod: "EXACT_MATCH",
            difficulty: "average",
        },
    },
    {
        id: "DESCRIPTIVE",
        title: "Descriptive",
        description: "Written explanation or rubric-based answer",
        icon: FileQuestion,
        component: Descriptive,
        data: {
            questionType: "DESCRIPTIVE",
            question: "",
            image: null,
            rubricBasedAnswer: "",
            checkingMethod: "AI_SEMANTIC",
            difficulty: "average",
        },
    },
    {
        id: "PROGRAMMING",
        title: "Programming",
        description: "Code-based problem",
        icon: Code2,
        component: Programming,
        data: {
            questionType: "CRITICAL_THINKING",
            criticalThinkingType: "PROGRAMMING",
            question: "",
            image: null,
            starterCode: "",
            testCases: [
                {
                    inputData: "",
                    expectedOutput: "",
                },
            ],
            subQuestions: [],
            difficulty: "average",
        },
    },
    {
        id: "DIAGRAM",
        title: "Diagram",
        description: "ERD, UML, flowchart, or DFD problem",
        icon: Workflow,
        component: Diagram,
        data: {
            questionType: "CRITICAL_THINKING",
            criticalThinkingType: "DIAGRAM",
            question: "",
            image: null,

            diagramType: "ERD",
            instructions: "",

            referenceDiagramXml: "",

            /*
              Automatically filled from the XML.
              These are the fields you will compare with
              the learner's diagram later.
            */
            referenceDiagramNodes: [],
            referenceDiagramEdges: [],

            subQuestions: [],
            difficulty: "average",
        },
    },
]

function createLocalId() {
    if (
        typeof crypto !== "undefined" &&
        typeof crypto.randomUUID === "function"
    ) {
        return crypto.randomUUID()
    }

    return `${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}`
}

function getQuestionFieldName(questionKey, fieldName) {
    return `questions[${questionKey}].${fieldName}`
}

function cloneQuestionData(data) {
    if (typeof structuredClone === "function") {
        return structuredClone(data)
    }

    return JSON.parse(JSON.stringify(data))
}

function isBlank(value) {
    return typeof value !== "string" || value.trim() === ""
}

function updateDataAtPath(data, path, value) {
    const parts = path.split(".")

    function update(currentValue, index) {
        const key = parts[index]
        const isLastPart = index === parts.length - 1

        const copy = Array.isArray(currentValue)
            ? [...currentValue]
            : { ...currentValue }

        if (isLastPart) {
            copy[key] = value
            return copy
        }

        const nextKey = parts[index + 1]

        const defaultNextValue = /^\d+$/.test(nextKey)
            ? []
            : {}

        copy[key] = update(
            currentValue?.[key] ?? defaultNextValue,
            index + 1
        )

        return copy
    }

    return update(data, 0)
}

function validateOptionalImage(file, label) {
    if (!file) {
        return ""
    }

    if (
        typeof File !== "undefined" &&
        !(file instanceof File)
    ) {
        return `${label} is invalid. Please choose the image again.`
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        return `${label} must be a JPG, PNG, WebP, or GIF file.`
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
        return `${label} must be 5 MB or smaller.`
    }

    return ""
}

function hasSavedDiagram(xml) {
    return (
        typeof xml === "string" &&
        xml.trim().length > 0
    )
}

function validateSubQuestions(data, errors) {
    const subQuestions = data.subQuestions ?? []

    subQuestions.forEach((subQuestion, index) => {
        if (isBlank(subQuestion.question)) {
            errors[`subQuestions.${index}.question`] =
                `Sub-question ${index + 1} needs a question.`
        }

        if (isBlank(subQuestion.correctAnswer)) {
            errors[`subQuestions.${index}.correctAnswer`] =
                `Sub-question ${index + 1} needs an expected answer.`
        }
    })
}

function validateQuestionData(typeId, data) {
    const errors = {}

    if (isBlank(data.question)) {
        errors.question = "Question prompt is required."
    }

    const questionImageError = validateOptionalImage(
        data.image,
        "Question image"
    )

    if (questionImageError) {
        errors.image = questionImageError
    }

    if (typeId === "MCQ") {
        const choices = data.choices ?? []

        choices.forEach((choice, index) => {
            const letter = String.fromCharCode(65 + index)

            if (isBlank(choice.choiceText)) {
                errors[`choices.${index}.choiceText`] =
                    `Choice ${letter} is required.`
            }

            const choiceImageError = validateOptionalImage(
                choice.image,
                `Choice ${letter} image`
            )

            if (choiceImageError) {
                errors[`choices.${index}.image`] =
                    choiceImageError
            }
        })

        if (
            data.correctChoiceIndex === null ||
            data.correctChoiceIndex === undefined
        ) {
            errors.correctChoiceIndex =
                "Select which answer choice is correct."
        }
    }

    if (
        typeId === "SHORT_ANSWER" &&
        isBlank(data.correctAnswer)
    ) {
        errors.correctAnswer = "Correct answer is required."
    }

    if (
        typeId === "DESCRIPTIVE" &&
        isBlank(data.rubricBasedAnswer)
    ) {
        errors.rubricBasedAnswer =
            "Model answer or rubric is required."
    }

    if (typeId === "PROGRAMMING") {
        const testCases = data.testCases ?? []

        if (testCases.length === 0) {
            errors.testCases =
                "Add at least one programming test case."
        }

        testCases.forEach((testCase, index) => {
            if (isBlank(testCase.expectedOutput)) {
                errors[`testCases.${index}.expectedOutput`] =
                    `Test case ${index + 1} needs an expected output.`
            }
        })

        validateSubQuestions(data, errors)
    }

    if (typeId === "DIAGRAM") {
        const labeledNodes =
            data.referenceDiagramNodes?.filter(
                (node) => node.labelKey
            ) ?? []

        if (
            !hasSavedDiagram(data.referenceDiagramXml) ||
            labeledNodes.length === 0
        ) {
            errors.referenceDiagramXml =
                "Create a reference diagram with at least one labeled node."
        }

        validateSubQuestions(data, errors)
    }

    return errors
}

function FieldError({ message }) {
    if (!message) {
        return null
    }

    return (
        <p className="flex items-start gap-1.5 text-xs leading-5 text-destructive">
            <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span>{message}</span>
        </p>
    )
}

function ImageUpload({
                         id,
                         name,
                         label = "Image",
                         description = "Upload a JPG, PNG, WebP, or GIF image.",
                         file,
                         onFileChange,
                         error,
                     }) {
    const [inputKey, setInputKey] = useState(0)

    function clearImage() {
        onFileChange?.(null)
        setInputKey((currentKey) => currentKey + 1)
    }

    return (
        <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
                <Label htmlFor={id} className="text-xs font-medium">
                    {label}
                    <span className="ml-1 font-normal text-muted-foreground">
            (Optional)
          </span>
                </Label>

                {file?.name && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={clearImage}
                        className="h-7 px-2 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
                    >
                        Remove
                    </Button>
                )}
            </div>

            <Input
                key={inputKey}
                id={id}
                name={name}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
                aria-invalid={Boolean(error)}
                onChange={(event) => {
                    onFileChange?.(
                        event.target.files?.[0] ?? null
                    )
                }}
                className={`h-9 cursor-pointer text-xs file:mr-3 file:rounded-md file:border-0 file:bg-muted file:px-3 file:py-1 file:text-xs file:font-medium file:text-foreground hover:file:bg-muted/80 ${
                    error
                        ? "border-destructive focus-visible:ring-destructive"
                        : ""
                }`}
            />

            {file?.name ? (
                <p className="truncate text-xs text-muted-foreground">
                    Selected: {file.name}
                </p>
            ) : (
                <p className="text-xs text-muted-foreground">
                    {description}
                </p>
            )}

            <FieldError message={error} />
        </div>
    )
}

function CompactQuestionCard({
                                 type,
                                 title,
                                 questionNumber,
                                 onRemove,
                                 errors = {},
                                 children,
                             }) {
    const errorCount = Object.keys(errors).length
    const hasErrors = errorCount > 0

    return (
        <Card
            data-question-invalid={
                hasErrors ? "true" : undefined
            }
            className={`overflow-hidden shadow-sm ${
                hasErrors ? "border-destructive/70" : ""
            }`}
        >
            <CardContent className="space-y-4 p-4">
                <div className="flex min-w-0 items-center gap-2 border-b border-border pb-3">
          <span className="shrink-0 text-xs font-semibold text-muted-foreground">
            {questionNumber}.
          </span>

                    <span className="shrink-0 rounded-md bg-muted px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            {type}
          </span>

                    <p className="min-w-0 flex-1 truncate text-sm font-semibold text-foreground">
                        {title}
                    </p>

                    {hasErrors && (
                        <span className="hidden shrink-0 items-center gap-1 rounded-md bg-destructive/10 px-2 py-1 text-xs font-medium text-destructive sm:flex">
              <AlertCircle className="h-3.5 w-3.5" />
                            {errorCount} issue{errorCount === 1 ? "" : "s"}
            </span>
                    )}

                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={onRemove}
                        aria-label="Remove question"
                        className="h-8 shrink-0 px-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    >
                        <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                        Remove
                    </Button>
                </div>

                {children}
            </CardContent>
        </Card>
    )
}

function DifficultySelect({
                              questionKey,
                              value,
                              onValueChange,
                          }) {
    return (
        <>
            <input
                type="hidden"
                name={getQuestionFieldName(
                    questionKey,
                    "difficulty"
                )}
                value={value}
            />

            <Select value={value} onValueChange={onValueChange}>
                <SelectTrigger className="w-full sm:w-36">
                    <SelectValue placeholder="Difficulty" />
                </SelectTrigger>

                <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="average">
                        Average
                    </SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
            </Select>
        </>
    )
}

function DiagramTypeSelect({
                               questionKey,
                               value,
                               onValueChange,
                           }) {
    return (
        <>
            <input
                type="hidden"
                name={getQuestionFieldName(
                    questionKey,
                    "diagramType"
                )}
                value={value}
            />

            <Select value={value} onValueChange={onValueChange}>
                <SelectTrigger className="w-full">
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

function QuestionMetaFields({
                                questionKey,
                                data,
                                onFieldChange,
                            }) {
    return (
        <div className="border-t border-border pt-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm font-medium text-foreground">
                        Difficulty Level
                    </p>

                    <p className="mt-0.5 text-xs text-muted-foreground">
                        Points are assigned later in quizzes, middle exams,
                        or mock exams.
                    </p>
                </div>

                <DifficultySelect
                    questionKey={questionKey}
                    value={data.difficulty}
                    onValueChange={(value) =>
                        onFieldChange("difficulty", value)
                    }
                />
            </div>
        </div>
    )
}

function QuestionPromptFields({
                                  questionKey,
                                  data,
                                  onFieldChange,
                                  errors = {},
                              }) {
    return (
        <div className="space-y-3">
            <div className="space-y-2">
                <Label
                    htmlFor={`${questionKey}-question-text`}
                    className="text-sm font-medium"
                >
                    Question Prompt
                    <span className="ml-1 text-destructive">*</span>
                </Label>

                <Textarea
                    id={`${questionKey}-question-text`}
                    name={getQuestionFieldName(
                        questionKey,
                        "question"
                    )}
                    value={data.question ?? ""}
                    aria-invalid={Boolean(errors.question)}
                    onChange={(event) =>
                        onFieldChange("question", event.target.value)
                    }
                    placeholder="Write the question, scenario, or instructions..."
                    className={`min-h-24 resize-y ${
                        errors.question
                            ? "border-destructive focus-visible:ring-destructive"
                            : ""
                    }`}
                />

                <FieldError message={errors.question} />
            </div>

            <details className="rounded-md border border-dashed border-border px-3 py-2">
                <summary className="cursor-pointer text-xs font-medium text-muted-foreground">
                    Add question image
                </summary>

                <div className="mt-3">
                    <ImageUpload
                        id={`${questionKey}-question-image`}
                        name={getQuestionFieldName(
                            questionKey,
                            "image"
                        )}
                        label="Question Image"
                        file={data.image}
                        error={errors.image}
                        onFileChange={(file) =>
                            onFieldChange("image", file)
                        }
                        description="Optional image displayed with the question."
                    />
                </div>
            </details>
        </div>
    )
}

function SubQuestions({
                          questionKey,
                          data,
                          onDataChange,
                          onFieldChange,
                          errors = {},
                      }) {
    const subQuestions = data.subQuestions ?? []

    function addSubQuestion() {
        onDataChange((currentData) => ({
            ...currentData,
            subQuestions: [
                ...(currentData.subQuestions ?? []),
                {
                    question: "",
                    correctAnswer: "",
                },
            ],
        }))
    }

    function removeSubQuestion(indexToRemove) {
        onDataChange((currentData) => ({
            ...currentData,
            subQuestions: currentData.subQuestions.filter(
                (_, index) => index !== indexToRemove
            ),
        }))
    }

    return (
        <div className="space-y-3 rounded-md border border-dashed border-border p-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <p className="text-sm font-medium text-foreground">
                        Sub-Questions
                        <span className="ml-1 text-xs font-normal text-muted-foreground">
              (Optional)
            </span>
                    </p>

                    <p className="mt-0.5 text-xs text-muted-foreground">
                        Add follow-up questions based on the main problem.
                    </p>
                </div>

                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addSubQuestion}
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Sub-Question
                </Button>
            </div>

            {subQuestions.length > 0 && (
                <div className="space-y-3">
                    {subQuestions.map((subQuestion, index) => {
                        const questionError =
                            errors[`subQuestions.${index}.question`]

                        const answerError =
                            errors[`subQuestions.${index}.correctAnswer`]

                        return (
                            <div
                                key={`${questionKey}-sub-question-${index}`}
                                className={`rounded-md border bg-muted/20 p-3 ${
                                    questionError || answerError
                                        ? "border-destructive/70"
                                        : "border-border"
                                }`}
                            >
                                <div className="mb-3 flex items-center justify-between gap-3">
                                    <p className="text-sm font-medium text-foreground">
                                        Sub-Question {index + 1}
                                    </p>

                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeSubQuestion(index)}
                                        className="h-8 px-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
                                    >
                                        <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                                        Remove
                                    </Button>
                                </div>

                                <div className="space-y-3">
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor={`${questionKey}-sub-question-${index}`}
                                            className="text-xs font-medium"
                                        >
                                            Question
                                            <span className="ml-1 text-destructive">*</span>
                                        </Label>

                                        <Textarea
                                            id={`${questionKey}-sub-question-${index}`}
                                            value={subQuestion.question ?? ""}
                                            aria-invalid={Boolean(questionError)}
                                            onChange={(event) =>
                                                onFieldChange(
                                                    `subQuestions.${index}.question`,
                                                    event.target.value
                                                )
                                            }
                                            placeholder="Write the follow-up question..."
                                            className={`min-h-16 resize-y ${
                                                questionError
                                                    ? "border-destructive focus-visible:ring-destructive"
                                                    : ""
                                            }`}
                                        />

                                        <FieldError message={questionError} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label
                                            htmlFor={`${questionKey}-sub-answer-${index}`}
                                            className="text-xs font-medium"
                                        >
                                            Expected Answer
                                            <span className="ml-1 text-destructive">*</span>
                                        </Label>

                                        <Textarea
                                            id={`${questionKey}-sub-answer-${index}`}
                                            value={subQuestion.correctAnswer ?? ""}
                                            aria-invalid={Boolean(answerError)}
                                            onChange={(event) =>
                                                onFieldChange(
                                                    `subQuestions.${index}.correctAnswer`,
                                                    event.target.value
                                                )
                                            }
                                            placeholder="Accepted answer, keywords, or key points..."
                                            className={`min-h-16 resize-y ${
                                                answerError
                                                    ? "border-destructive focus-visible:ring-destructive"
                                                    : ""
                                            }`}
                                        />

                                        <FieldError message={answerError} />
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

function MultipleChoices({
                             questionKey,
                             questionNumber,
                             onRemove,
                             data,
                             onDataChange,
                             errors = {},
                         }) {
    const choices = data.choices ?? []

    function onFieldChange(path, value) {
        onDataChange((currentData) =>
            updateDataAtPath(currentData, path, value)
        )
    }

    function chooseCorrectChoice(correctIndex) {
        onDataChange((currentData) => ({
            ...currentData,
            correctChoiceIndex: correctIndex,
            choices: currentData.choices.map((choice, index) => ({
                ...choice,
                isCorrect: index === correctIndex,
            })),
        }))
    }

    return (
        <CompactQuestionCard
            type="MCQ"
            title="Multiple Choice Question"
            questionNumber={questionNumber}
            onRemove={onRemove}
            errors={errors}
        >
            <QuestionPromptFields
                questionKey={questionKey}
                data={data}
                onFieldChange={onFieldChange}
                errors={errors}
            />

            <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                        <p className="text-sm font-medium text-foreground">
                            Answer Choices
                            <span className="ml-1 text-destructive">*</span>
                        </p>

                        <p className="mt-0.5 text-xs text-muted-foreground">
                            Fill every choice and select one correct answer.
                        </p>
                    </div>

                    {errors.correctChoiceIndex && (
                        <span className="text-xs font-medium text-destructive">
              Correct answer required
            </span>
                    )}
                </div>

                <RadioGroup
                    value={
                        data.correctChoiceIndex === null
                            ? ""
                            : String(data.correctChoiceIndex)
                    }
                    onValueChange={(value) =>
                        chooseCorrectChoice(Number(value))
                    }
                    className="grid gap-3 sm:grid-cols-2"
                >
                    {choices.map((choice, index) => {
                        const letter = String.fromCharCode(65 + index)

                        const choiceError =
                            errors[`choices.${index}.choiceText`]

                        const imageError =
                            errors[`choices.${index}.image`]

                        const isCorrect =
                            data.correctChoiceIndex === index

                        return (
                            <div
                                key={`${questionKey}-choice-${index}`}
                                className={`rounded-md border p-3 transition ${
                                    isCorrect
                                        ? "border-primary bg-primary/5"
                                        : choiceError || imageError
                                            ? "border-destructive/70 bg-destructive/5"
                                            : "border-border bg-muted/20"
                                }`}
                            >
                                <div className="flex items-center gap-2">
                                    <RadioGroupItem
                                        id={`${questionKey}-correct-${index}`}
                                        value={String(index)}
                                        className="shrink-0"
                                    />

                                    <Label
                                        htmlFor={`${questionKey}-correct-${index}`}
                                        className={`flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded border text-xs font-semibold ${
                                            isCorrect
                                                ? "border-primary bg-primary text-primary-foreground"
                                                : "bg-background"
                                        }`}
                                    >
                                        {letter}
                                    </Label>

                                    <Input
                                        name={getQuestionFieldName(
                                            questionKey,
                                            `choices[${index}].choiceText`
                                        )}
                                        value={choice.choiceText ?? ""}
                                        aria-invalid={Boolean(choiceError)}
                                        onChange={(event) =>
                                            onFieldChange(
                                                `choices.${index}.choiceText`,
                                                event.target.value
                                            )
                                        }
                                        placeholder={`Choice ${letter}`}
                                        className={`h-8 min-w-0 ${
                                            choiceError
                                                ? "border-destructive focus-visible:ring-destructive"
                                                : ""
                                        }`}
                                    />
                                </div>

                                <div className="ml-9 mt-2">
                                    <FieldError message={choiceError} />
                                </div>

                                <details className="mt-3">
                                    <summary className="cursor-pointer text-xs text-muted-foreground">
                                        Add image or explanation
                                        <span className="ml-1">(Optional)</span>
                                    </summary>

                                    <div className="mt-3 space-y-3">
                                        <ImageUpload
                                            id={`${questionKey}-choice-image-${index}`}
                                            name={getQuestionFieldName(
                                                questionKey,
                                                `choices[${index}].image`
                                            )}
                                            label="Choice Image"
                                            file={choice.image}
                                            error={imageError}
                                            onFileChange={(file) =>
                                                onFieldChange(
                                                    `choices.${index}.image`,
                                                    file
                                                )
                                            }
                                            description="Optional image for this answer choice."
                                        />

                                        <Textarea
                                            value={choice.explanation ?? ""}
                                            onChange={(event) =>
                                                onFieldChange(
                                                    `choices.${index}.explanation`,
                                                    event.target.value
                                                )
                                            }
                                            placeholder="Optional explanation shown after answering..."
                                            className="min-h-16 resize-y text-xs"
                                        />
                                    </div>
                                </details>
                            </div>
                        )
                    })}
                </RadioGroup>

                <FieldError message={errors.correctChoiceIndex} />
            </div>

            <QuestionMetaFields
                questionKey={questionKey}
                data={data}
                onFieldChange={onFieldChange}
            />
        </CompactQuestionCard>
    )
}

function ShortAnswer({
                         questionKey,
                         questionNumber,
                         onRemove,
                         data,
                         onDataChange,
                         errors = {},
                     }) {
    function onFieldChange(path, value) {
        onDataChange((currentData) =>
            updateDataAtPath(currentData, path, value)
        )
    }

    return (
        <CompactQuestionCard
            type="Short Answer"
            title="Short Answer Question"
            questionNumber={questionNumber}
            onRemove={onRemove}
            errors={errors}
        >
            <QuestionPromptFields
                questionKey={questionKey}
                data={data}
                onFieldChange={onFieldChange}
                errors={errors}
            />

            <div className="space-y-2 border-t border-border pt-4">
                <Label
                    htmlFor={`${questionKey}-correct-answer`}
                    className="text-sm font-medium"
                >
                    Correct Answer
                    <span className="ml-1 text-destructive">*</span>
                </Label>

                <Textarea
                    id={`${questionKey}-correct-answer`}
                    value={data.correctAnswer ?? ""}
                    aria-invalid={Boolean(errors.correctAnswer)}
                    onChange={(event) =>
                        onFieldChange(
                            "correctAnswer",
                            event.target.value
                        )
                    }
                    placeholder="Enter the exact answer or accepted keywords..."
                    className={`min-h-20 resize-y ${
                        errors.correctAnswer
                            ? "border-destructive focus-visible:ring-destructive"
                            : ""
                    }`}
                />

                <p className="text-xs text-muted-foreground">
                    Short answers use exact-match checking automatically.
                </p>

                <FieldError message={errors.correctAnswer} />
            </div>

            <QuestionMetaFields
                questionKey={questionKey}
                data={data}
                onFieldChange={onFieldChange}
            />
        </CompactQuestionCard>
    )
}

function Descriptive({
                         questionKey,
                         questionNumber,
                         onRemove,
                         data,
                         onDataChange,
                         errors = {},
                     }) {
    function onFieldChange(path, value) {
        onDataChange((currentData) =>
            updateDataAtPath(currentData, path, value)
        )
    }

    return (
        <CompactQuestionCard
            type="Descriptive"
            title="Descriptive Question"
            questionNumber={questionNumber}
            onRemove={onRemove}
            errors={errors}
        >
            <QuestionPromptFields
                questionKey={questionKey}
                data={data}
                onFieldChange={onFieldChange}
                errors={errors}
            />

            <div className="space-y-2 border-t border-border pt-4">
                <Label
                    htmlFor={`${questionKey}-rubric`}
                    className="text-sm font-medium"
                >
                    Model Answer / Rubric
                    <span className="ml-1 text-destructive">*</span>
                </Label>

                <Textarea
                    id={`${questionKey}-rubric`}
                    value={data.rubricBasedAnswer ?? ""}
                    aria-invalid={Boolean(errors.rubricBasedAnswer)}
                    onChange={(event) =>
                        onFieldChange(
                            "rubricBasedAnswer",
                            event.target.value
                        )
                    }
                    placeholder="Write the expected explanation, key points, or grading guide..."
                    className={`min-h-28 resize-y ${
                        errors.rubricBasedAnswer
                            ? "border-destructive focus-visible:ring-destructive"
                            : ""
                    }`}
                />

                <p className="text-xs text-muted-foreground">
                    Descriptive answers use the rubric automatically.
                </p>

                <FieldError
                    message={errors.rubricBasedAnswer}
                />
            </div>

            <QuestionMetaFields
                questionKey={questionKey}
                data={data}
                onFieldChange={onFieldChange}
            />
        </CompactQuestionCard>
    )
}

function Programming({
                         questionKey,
                         questionNumber,
                         onRemove,
                         data,
                         onDataChange,
                         errors = {},
                     }) {
    const testCases = data.testCases ?? []

    function onFieldChange(path, value) {
        onDataChange((currentData) =>
            updateDataAtPath(currentData, path, value)
        )
    }

    function addTestCase() {
        onDataChange((currentData) => ({
            ...currentData,
            testCases: [
                ...(currentData.testCases ?? []),
                {
                    inputData: "",
                    expectedOutput: "",
                },
            ],
        }))
    }

    function removeTestCase(indexToRemove) {
        if (testCases.length === 1) {
            return
        }

        onDataChange((currentData) => ({
            ...currentData,
            testCases: currentData.testCases.filter(
                (_, index) => index !== indexToRemove
            ),
        }))
    }

    return (
        <CompactQuestionCard
            type="Programming"
            title="Programming Question"
            questionNumber={questionNumber}
            onRemove={onRemove}
            errors={errors}
        >
            <QuestionPromptFields
                questionKey={questionKey}
                data={data}
                onFieldChange={onFieldChange}
                errors={errors}
            />

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
                    value={data.starterCode ?? ""}
                    onChange={(event) =>
                        onFieldChange(
                            "starterCode",
                            event.target.value
                        )
                    }
                    spellCheck={false}
                    placeholder="// Optional code template..."
                    className="min-h-32 resize-y font-mono text-sm"
                />
            </div>

            <div
                className={`space-y-3 rounded-md border border-dashed p-3 ${
                    errors.testCases
                        ? "border-destructive/70 bg-destructive/5"
                        : "border-border"
                }`}
            >
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <p className="text-sm font-medium text-foreground">
                            Programming Test Cases
                            <span className="ml-1 text-destructive">*</span>
                        </p>

                        <p className="mt-0.5 text-xs text-muted-foreground">
                            Input is optional. Every test case needs an expected
                            output.
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

                <FieldError message={errors.testCases} />

                <div className="space-y-3">
                    {testCases.map((testCase, index) => {
                        const expectedOutputError =
                            errors[`testCases.${index}.expectedOutput`]

                        return (
                            <div
                                key={`${questionKey}-test-case-${index}`}
                                className={`rounded-md border p-3 ${
                                    expectedOutputError
                                        ? "border-destructive/70 bg-destructive/5"
                                        : "border-border bg-muted/20"
                                }`}
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
                                        onClick={() => removeTestCase(index)}
                                        className="h-8 px-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
                                    >
                                        <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                                        Remove
                                    </Button>
                                </div>

                                <div className="grid gap-3 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor={`${questionKey}-test-case-${index}-input`}
                                            className="text-xs font-medium"
                                        >
                                            Input Data
                                            <span className="ml-1 font-normal text-muted-foreground">
                        (Optional)
                      </span>
                                        </Label>

                                        <Textarea
                                            id={`${questionKey}-test-case-${index}-input`}
                                            value={testCase.inputData ?? ""}
                                            onChange={(event) =>
                                                onFieldChange(
                                                    `testCases.${index}.inputData`,
                                                    event.target.value
                                                )
                                            }
                                            spellCheck={false}
                                            placeholder={"Example:\n5\n10 20 30 40 50"}
                                            className="min-h-20 resize-y font-mono text-xs"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label
                                            htmlFor={`${questionKey}-test-case-${index}-output`}
                                            className="text-xs font-medium"
                                        >
                                            Expected Output
                                            <span className="ml-1 text-destructive">*</span>
                                        </Label>

                                        <Textarea
                                            id={`${questionKey}-test-case-${index}-output`}
                                            value={testCase.expectedOutput ?? ""}
                                            aria-invalid={Boolean(
                                                expectedOutputError
                                            )}
                                            onChange={(event) =>
                                                onFieldChange(
                                                    `testCases.${index}.expectedOutput`,
                                                    event.target.value
                                                )
                                            }
                                            spellCheck={false}
                                            placeholder="Example: 150"
                                            className={`min-h-20 resize-y font-mono text-xs ${
                                                expectedOutputError
                                                    ? "border-destructive focus-visible:ring-destructive"
                                                    : ""
                                            }`}
                                        />

                                        <FieldError
                                            message={expectedOutputError}
                                        />
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            <SubQuestions
                questionKey={questionKey}
                data={data}
                onDataChange={onDataChange}
                onFieldChange={onFieldChange}
                errors={errors}
            />

            <QuestionMetaFields
                questionKey={questionKey}
                data={data}
                onFieldChange={onFieldChange}
            />
        </CompactQuestionCard>
    )
}

function Diagram({
                     questionKey,
                     questionNumber,
                     onRemove,
                     data,
                     onDataChange,
                     errors = {},
                 }) {
    function onFieldChange(path, value) {
        onDataChange((currentData) =>
            updateDataAtPath(currentData, path, value)
        )
    }

    function handleReferenceDiagramChange(xml) {
        try {
            const { nodes, edges } = extractDiagramData(xml)

            onDataChange((currentData) => ({
                ...currentData,
                referenceDiagramXml: xml,
                referenceDiagramNodes: nodes,
                referenceDiagramEdges: edges,
            }))
        } catch (error) {
            console.error(
                "Could not extract diagram nodes and connections:",
                error
            )

            /*
              Keep the XML so the admin's work is not lost.
              Nodes and edges are hidden from this UI but remain
              part of question.data for learner-answer comparison.
            */
            onDataChange((currentData) => ({
                ...currentData,
                referenceDiagramXml: xml,
                referenceDiagramNodes: [],
                referenceDiagramEdges: [],
            }))
        }
    }

    const diagramTypeLabel =
        {
            ERD: "Entity Relationship Diagram",
            UML_CLASS: "UML Class Diagram",
            FLOWCHART: "Flowchart",
            DFD: "Data Flow Diagram",
        }[data.diagramType] ?? "Diagram"

    const hasDiagram = hasSavedDiagram(
        data.referenceDiagramXml
    )

    return (
        <CompactQuestionCard
            type="Diagram"
            title="Diagram Question"
            questionNumber={questionNumber}
            onRemove={onRemove}
            errors={errors}
        >
            <QuestionPromptFields
                questionKey={questionKey}
                data={data}
                onFieldChange={onFieldChange}
                errors={errors}
            />

            <div className="grid gap-3 border-t border-border pt-4 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label className="text-sm font-medium">
                        Diagram Type
                    </Label>

                    <DiagramTypeSelect
                        questionKey={questionKey}
                        value={data.diagramType}
                        onValueChange={(value) =>
                            onFieldChange("diagramType", value)
                        }
                    />
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
                        value={data.instructions ?? ""}
                        onChange={(event) =>
                            onFieldChange(
                                "instructions",
                                event.target.value
                            )
                        }
                        placeholder="Example: Include PK and FK labels."
                    />
                </div>
            </div>

            <section
                className={`overflow-hidden rounded-xl border bg-background ${
                    errors.referenceDiagramXml
                        ? "border-destructive/70"
                        : "border-border"
                }`}
            >
                <div className="flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex min-w-0 items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/30">
                            <Workflow className="h-5 w-5 text-primary" />
                        </div>

                        <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                                <p className="text-sm font-semibold text-foreground">
                                    Reference Diagram
                                    <span className="ml-1 text-destructive">*</span>
                                </p>

                                <span className="rounded-full border border-border bg-background px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                                    {data.diagramType}
                                </span>
                            </div>

                            <p className="mt-1 text-sm leading-5 text-muted-foreground">
                                Create the correct {diagramTypeLabel.toLowerCase()} that learners will be compared against.
                            </p>

                            <p
                                className={`mt-2 text-xs font-medium ${
                                    hasDiagram
                                        ? "text-primary"
                                        : "text-muted-foreground"
                                }`}
                            >
                                {hasDiagram
                                    ? "Reference diagram saved automatically."
                                    : "No reference diagram created yet."}
                            </p>
                        </div>
                    </div>

                    <BigDialog
                        title={`${diagramTypeLabel} Editor`}
                        description="Your diagram is saved automatically while you edit."
                        trigger={
                            <Button
                                type="button"
                                size="sm"
                                className="shrink-0"
                            >
                                <Maximize className="mr-2 h-4 w-4" />
                                Open Editor
                            </Button>
                        }
                        content={
                            <div className="h-full w-full overflow-hidden rounded-lg border border-border bg-white shadow-sm">
                                <DiagramArea
                                    initialXml={
                                        data.referenceDiagramXml || undefined
                                    }
                                    onChange={handleReferenceDiagramChange}
                                />
                            </div>
                        }
                    />
                </div>

                {errors.referenceDiagramXml && (
                    <div className="border-t border-destructive/30 bg-destructive/5 px-4 py-3">
                        <FieldError
                            message={errors.referenceDiagramXml}
                        />
                    </div>
                )}
            </section>

            <SubQuestions
                questionKey={questionKey}
                data={data}
                onDataChange={onDataChange}
                onFieldChange={onFieldChange}
                errors={errors}
            />

            <QuestionMetaFields
                questionKey={questionKey}
                data={data}
                onFieldChange={onFieldChange}
            />
        </CompactQuestionCard>
    )
}

function QuestionTypeButton({
                                questionType,
                                onAdd,
                                disabled,
                            }) {
    const Icon = questionType.icon

    return (
        <Button
            type="button"
            variant="outline"
            disabled={disabled}
            className="h-auto w-full justify-start gap-3 whitespace-normal px-3 py-3 text-left"
            onClick={() => onAdd(questionType)}
        >
            <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />

            <span className="min-w-0 text-left">
        <span className="block text-sm font-medium">
          {questionType.title}
        </span>

        <span className="mt-0.5 block text-xs font-normal leading-4 text-muted-foreground">
          {questionType.description}
        </span>
      </span>
        </Button>
    )
}

function EmptyState({
                        icon: Icon,
                        title,
                        description,
                        size = "lg",
                    }) {
    if (size === "sm") {
        return (
            <div className="rounded-lg border border-dashed border-border px-3 py-8 text-center">
                <p className="text-sm font-medium text-foreground">
                    {title}
                </p>

                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    {description}
                </p>
            </div>
        )
    }

    return (
        <div className="rounded-lg border border-dashed border-border bg-background px-6 py-16 text-center">
            <Icon className="mx-auto h-7 w-7 text-muted-foreground" />

            <h3 className="mt-4 text-base font-semibold text-foreground">
                {title}
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
                {description}
            </p>
        </div>
    )
}

function FeedbackDialog({
                            open,
                            type,
                            title,
                            description,
                            onClose,
                        }) {
    const isSuccess = type === "success"

    return (
        <Dialog
            open={open}
            onOpenChange={(nextOpen) => {
                if (!nextOpen) {
                    onClose()
                }
            }}
        >
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div
                        className={`mb-2 flex h-11 w-11 items-center justify-center rounded-full ${
                            isSuccess
                                ? "bg-primary/10 text-primary"
                                : "bg-amber-500/10 text-amber-600"
                        }`}
                    >
                        {isSuccess ? (
                            <CheckCircle2 className="h-6 w-6" />
                        ) : (
                            <AlertCircle className="h-6 w-6" />
                        )}
                    </div>

                    <DialogTitle>{title}</DialogTitle>

                    <DialogDescription className="leading-6">
                        {description}
                    </DialogDescription>
                </DialogHeader>

                <div className="flex justify-end pt-2">
                    <Button type="button" onClick={onClose}>
                        Okay
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

function getCertificationValue(certification) {
    return String(
        certification.certificationId ??
        certification.id ??
        certification.title ??
        certification.name ??
        "unknown-certification"
    )
}

function getCertificationTitle(certification) {
    return (
        certification.title ??
        certification.name ??
        "Untitled Certification"
    )
}

function QuestionBank() {
    const [activeTab, setActiveTab] = useState("all-questions")

    const [filterCertificationId, setFilterCertificationId] =
        useState("")

    const [
        selectedCertificationId,
        setSelectedCertificationId,
    ] = useState("")

    const [selectedLesson, setSelectedLesson] =
        useState(null)

    const [lessonSearch, setLessonSearch] =
        useState("")

    const [questions, setQuestions] = useState([])

    const [validationErrors, setValidationErrors] =
        useState({})

    const [feedbackDialog, setFeedbackDialog] = useState({
        open: false,
        type: "success",
        title: "",
        description: "",
    })

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
                getCertificationValue(certification) ===
                selectedCertificationId
        )
    }, [certifications, selectedCertificationId])

    const selectedFilterCertification = useMemo(() => {
        return certifications.find(
            (certification) =>
                getCertificationValue(certification) ===
                filterCertificationId
        )
    }, [certifications, filterCertificationId])

    const normalizedLessonSearch = lessonSearch
        .trim()
        .toLowerCase()

    const visibleStructure = useMemo(() => {
        if (!selectedCertification) {
            return []
        }

        return (selectedCertification.majorCategory ?? [])
            .map((majorCategory, majorIndex) => ({
                ...majorCategory,
                key: `major-${majorIndex}`,
                visibleMiddleCategories: (
                    majorCategory.middleCategory ?? []
                )
                    .map((middleCategory, middleIndex) => ({
                        ...middleCategory,
                        key: `middle-${majorIndex}-${middleIndex}`,
                        visibleLessons: (
                            middleCategory.lessons ?? []
                        ).filter((lesson) =>
                            (lesson.name ?? lesson.title ?? "")
                                .toLowerCase()
                                .includes(normalizedLessonSearch)
                        ),
                    }))
                    .filter(
                        (middleCategory) =>
                            middleCategory.visibleLessons.length > 0
                    ),
            }))
            .filter(
                (majorCategory) =>
                    majorCategory.visibleMiddleCategories.length > 0
            )
    }, [selectedCertification, normalizedLessonSearch])

    const hasMatchingLesson = visibleStructure.length > 0

    useEffect(() => {
        setValidationErrors((currentErrors) => {
            if (Object.keys(currentErrors).length === 0) {
                return currentErrors
            }

            const nextErrors = {}

            questions.forEach((question) => {
                if (!currentErrors[question.id]) {
                    return
                }

                const errors = validateQuestionData(
                    question.typeId,
                    question.data
                )

                if (Object.keys(errors).length > 0) {
                    nextErrors[question.id] = errors
                }
            })

            return nextErrors
        })
    }, [questions])

    function showFeedbackDialog({
                                    type = "success",
                                    title,
                                    description,
                                }) {
        setFeedbackDialog({
            open: true,
            type,
            title,
            description,
        })
    }

    function closeFeedbackDialog() {
        setFeedbackDialog((currentDialog) => ({
            ...currentDialog,
            open: false,
        }))
    }

    function handleBuilderCertificationChange(value) {
        const isChangingCertification =
            selectedCertificationId &&
            selectedCertificationId !== value

        if (isChangingCertification && questions.length > 0) {
            showFeedbackDialog({
                type: "warning",
                title: "Unsaved Questions",
                description:
                    "Save or remove the current questions before changing certifications.",
            })

            return
        }

        setSelectedCertificationId(value)
        setSelectedLesson(null)
        setLessonSearch("")
        setQuestions([])
        setValidationErrors({})
    }

    function handleLessonSelect({
                                    lesson,
                                    lessonId,
                                    majorCategoryTitle,
                                    middleCategoryTitle,
                                }) {
        if (selectedLesson?.id === lessonId) {
            return
        }

        const isChangingLesson =
            selectedLesson &&
            selectedLesson.id !== lessonId

        if (isChangingLesson && questions.length > 0) {
            showFeedbackDialog({
                type: "warning",
                title: "Unsaved Questions",
                description:
                    "Save or remove the current questions before selecting another lesson.",
            })

            return
        }

        setSelectedLesson({
            id: lessonId,
            name: lesson.name ?? lesson.title ?? "Untitled Lesson",
            majorCategoryTitle,
            middleCategoryTitle,
        })

        setQuestions([])
        setValidationErrors({})
    }

    function addQuestion(questionType) {
        setQuestions((previousQuestions) => [
            ...previousQuestions,
            {
                id: createLocalId(),
                typeId: questionType.id,
                questionTypeName: questionType.title,
                data: cloneQuestionData(questionType.data),
            },
        ])
    }

    function updateQuestionData(questionId, updater) {
        setQuestions((previousQuestions) =>
            previousQuestions.map((question) => {
                if (question.id !== questionId) {
                    return question
                }

                return {
                    ...question,
                    data:
                        typeof updater === "function"
                            ? updater(question.data)
                            : updater,
                }
            })
        )
    }

    function removeQuestion(questionId) {
        setQuestions((previousQuestions) =>
            previousQuestions.filter(
                (question) => question.id !== questionId
            )
        )

        setValidationErrors((currentErrors) => {
            const nextErrors = { ...currentErrors }
            delete nextErrors[questionId]
            return nextErrors
        })
    }

    const submitQuestions = () => {
        console.log(selectedLesson)
        console.log(questions)

        questions.map((question) =>{
            switch (question.typeId) {
                case 'MCQ':
                    const savedMCQ = saveQuestions({
                        questionType: question.typeId,
                        difficultyLevel: question.difficultyLevel,
                        questionText: question.question,
                        imageKey: ''+image,
                        lessonId: selectedLesson.lessonId,
                        choices: [
                            question.choices.map((choice) => {
                                return {
                                    questionId: savedMCQ.questionId,
                                    choiceText: choice.choiceText,
                                    imageKey: ''+choice.image,
                                    correct: choice.isCorrect,
                                    explanation: choice.explanation,
                                }
                            })
                        ]
                    })


                    break;
                case 'SHORT_ANSWER':
                    const savedShortAnswer = saveQuestions({
                        questionType: question.typeId,
                        difficultyLevel: question.difficultyLevel,
                        questionText: question.question,
                        imageKey: ''+image,
                        lessonId: selectedLesson.lessonId,
                    })
                    const textQuestionConfigShort = saveTextQuestion({
                        questionId: savedShortAnswer.questionId,
                        correctAnswer: question.correctAnswer,
                        checkingMethod: question.checkingMethod,
                    })

                    break;
                case 'DESCRIPTIVE':
                    const savedDescriptive = saveQuestions({
                        questionType: question.typeId,
                        difficultyLevel: question.difficultyLevel,
                        questionText: question.question,
                        imageKey: ''+image,
                        lessonId: selectedLesson.lessonId,
                    })
                    const textQuestionConfigDescriptive = saveTextQuestion({
                        questionId: savedShortAnswer.questionId,
                        correctAnswer: question.rubricBasedAnswer,
                        checkingMethod: question.checkingMethod,
                    })

                    break;
                case 'PROGRAMMING':
                    const savedProgramming = saveQuestions({
                        questionType: question.criticalThinkingType,
                        difficultyLevel: question.difficultyLevel,
                        questionText: question.question,
                        imageKey: ''+image,
                        lessonId: selectedLesson.lessonId,
                    })
                    const programmingConfig = saveProgrammingQuestions({
                        questionId: savedProgramming.questionId,
                        starterCode: question.starterCode,
                        testCases: [
                            question.testCases.map((testCase) => {
                                return {
                                    inputData: testCase.inputData,
                                    expectedOutput: testCase.expectedOutput,
                                }
                            }),
                        ]
                    })

                    question.subQuestions.map(subQuestion => {
                        const subQuestions = saveQuestions({
                            parentQuestionId: savedProgramming.id,
                            questionText: subQuestion.question,
                        })
                        saveTextQuestion({
                            questionId: subQuestions.questionId,
                            correctAnswer: question.rubricBasedAnswer,
                        })
                    })
                    break;
                case 'DIAGRAM':

                    break;
            }
        })
    }

    function handleSave() {
        const nextValidationErrors = {}

        questions.forEach((question) => {
            const errors = validateQuestionData(
                question.typeId,
                question.data
            )

            if (Object.keys(errors).length > 0) {
                nextValidationErrors[question.id] = errors
            }
        })

        setValidationErrors(nextValidationErrors)

        if (Object.keys(nextValidationErrors).length > 0) {
            window.setTimeout(() => {
                document
                    .querySelector('[data-question-invalid="true"]')
                    ?.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                    })
            }, 0)

            return
        }

        submitQuestions()

        showFeedbackDialog({
            type: "success",
            title: "Questions Ready",
            description: `${questions.length} question${
                questions.length === 1 ? "" : "s"
            } passed validation and are ready to submit.`,
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
                            Create and manage questions for certifications,
                            quizzes, and exams.
                        </p>
                    </div>
                </header>

                <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-border bg-background">
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
                        <div className="flex shrink-0 items-center gap-2 py-1.5">
                            <Button
                                type="button"
                                size="sm"
                                disabled={
                                    !selectedLesson || questions.length === 0
                                }
                                onClick={handleSave}
                            >
                                Save
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
                                Select a certification to view and manage its
                                questions.
                            </p>
                        </div>

                        <Card className="mt-5">
                            <CardContent className="p-4">
                                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(220px,1fr)_190px_170px_150px_160px]">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

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
                                                {certifications.map(
                                                    (certification, index) => (
                                                        <SelectItem
                                                            key={
                                                                certification.certificationId ??
                                                                certification.id ??
                                                                index
                                                            }
                                                            value={getCertificationValue(
                                                                certification
                                                            )}
                                                            title={getCertificationTitle(
                                                                certification
                                                            )}
                                                        >
                              <span className="block truncate">
                                {getCertificationTitle(
                                    certification
                                )}
                              </span>
                                                        </SelectItem>
                                                    )
                                                )}
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
                                            <SelectItem value="easy">
                                                Easy
                                            </SelectItem>
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
                                            <TableCell
                                                colSpan={7}
                                                className="h-[390px]"
                                            >
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
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        aria-label="First page"
                                        disabled
                                    >
                                        <ChevronsLeft className="h-4 w-4" />
                                    </Button>

                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        aria-label="Previous page"
                                        disabled
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>

                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        disabled
                                    >
                                        1
                                    </Button>

                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        aria-label="Next page"
                                        disabled
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>

                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        aria-label="Last page"
                                        disabled
                                    >
                                        <ChevronsRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent
                    value="question-builder"
                    className="m-0 min-h-0 flex-1 overflow-hidden py-5 data-[state=active]:flex data-[state=active]:flex-col"
                >
                    <div className="grid min-h-0 w-full flex-1 overflow-y-auto rounded-xl border border-border bg-background shadow-sm xl:grid-cols-[360px_minmax(0,1fr)_300px] xl:grid-rows-[minmax(0,1fr)] xl:overflow-hidden">
                        <aside className="min-h-0 border-b border-border bg-background xl:overflow-y-auto xl:border-b-0 xl:border-r">
                            <div className="space-y-4 p-4">
                                <div>
                                    <p className="text-sm font-medium text-foreground">
                                        Course Structure
                                    </p>

                                    <Select
                                        value={selectedCertificationId}
                                        onValueChange={
                                            handleBuilderCertificationChange
                                        }
                                        disabled={isPending}
                                    >
                                        <SelectTrigger className="mt-3 w-full min-w-0 [&>span]:truncate">
                                            <SelectValue placeholder="Select a certification" />
                                        </SelectTrigger>

                                        <SelectContent className="w-[var(--radix-select-trigger-width)]">
                                            <SelectGroup>
                                                {certifications.map(
                                                    (certification, index) => (
                                                        <SelectItem
                                                            key={
                                                                certification.certificationId ??
                                                                certification.id ??
                                                                index
                                                            }
                                                            value={getCertificationValue(
                                                                certification
                                                            )}
                                                            title={getCertificationTitle(
                                                                certification
                                                            )}
                                                        >
                              <span className="block w-full truncate">
                                {getCertificationTitle(
                                    certification
                                )}
                              </span>
                                                        </SelectItem>
                                                    )
                                                )}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                                    <Input
                                        value={lessonSearch}
                                        onChange={(event) =>
                                            setLessonSearch(event.target.value)
                                        }
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
                                    <EmptyState
                                        size="sm"
                                        title="No certification selected"
                                        description="Select a certification to view its course structure."
                                    />
                                ) : (
                                    <div className="space-y-4">
                                        {visibleStructure.map((majorCategory) => (
                                            <section
                                                key={majorCategory.key}
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
                                                    {majorCategory.visibleMiddleCategories.map(
                                                        (middleCategory) => (
                                                            <div
                                                                key={middleCategory.key}
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
                                        middleCategory
                                            .visibleLessons.length
                                    }
                                  </span>
                                                                </div>

                                                                <div className="space-y-1">
                                                                    {middleCategory.visibleLessons.map(
                                                                        (lesson, lessonIndex) => {
                                                                            const lessonId = String(
                                                                                lesson.lessonId ??
                                                                                lesson.id ??
                                                                                `${middleCategory.key}-lesson-${lessonIndex}`
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
                                        ))}

                                        {normalizedLessonSearch &&
                                            !hasMatchingLesson && (
                                                <EmptyState
                                                    size="sm"
                                                    title="No lessons found"
                                                    description="Try another lesson name."
                                                />
                                            )}
                                    </div>
                                )}
                            </div>
                        </aside>

                        <main className="min-h-0 min-w-0 bg-muted/20 xl:overflow-y-auto">
                            <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 p-5 sm:p-6">
                                {!selectedLesson ? (
                                    <EmptyState
                                        icon={BookOpen}
                                        title="Select a lesson first"
                                        description="Choose a lesson from the course structure to create questions."
                                    />
                                ) : (
                                    <>
                                        <div className="flex flex-wrap items-end justify-between gap-2">
                                            <div className="min-w-0">
                                                <p className="truncate text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                                    {selectedLesson.majorCategoryTitle} /{" "}
                                                    {selectedLesson.middleCategoryTitle}
                                                </p>

                                                <h2 className="mt-1 truncate text-lg font-bold text-foreground">
                                                    {selectedLesson.name}
                                                </h2>
                                            </div>

                                            <p className="shrink-0 text-sm text-muted-foreground">
                                                {questions.length}{" "}
                                                {questions.length === 1
                                                    ? "question"
                                                    : "questions"}
                                            </p>
                                        </div>

                                        {Object.keys(validationErrors).length > 0 && (
                                            <div className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                                                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />

                                                <div>
                                                    <p className="font-semibold">
                                                        Some required question details are missing.
                                                    </p>

                                                    <p className="mt-1 text-xs leading-5">
                                                        Review the highlighted question cards,
                                                        complete the required fields, then save
                                                        again.
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {questions.length === 0 ? (
                                            <EmptyState
                                                icon={FileQuestion}
                                                title="No questions added yet"
                                                description="Use the Add Question panel to add your first question."
                                            />
                                        ) : (
                                            questions.map((question, index) => {
                                                const questionType = questionTypes.find(
                                                    (item) => item.id === question.typeId
                                                )

                                                if (!questionType) {
                                                    return null
                                                }

                                                const QuestionComponent =
                                                    questionType.component

                                                return (
                                                    <QuestionComponent
                                                        key={question.id}
                                                        questionKey={question.id}
                                                        questionNumber={index + 1}
                                                        data={question.data}
                                                        errors={
                                                            validationErrors[question.id] ?? {}
                                                        }
                                                        onRemove={() =>
                                                            removeQuestion(question.id)
                                                        }
                                                        onDataChange={(updater) =>
                                                            updateQuestionData(
                                                                question.id,
                                                                updater
                                                            )
                                                        }
                                                    />
                                                )
                                            })
                                        )}
                                    </>
                                )}
                            </div>
                        </main>

                        <aside className="min-h-0 border-t border-border bg-background xl:overflow-y-auto xl:border-l xl:border-t-0">
                            <div className="space-y-4 p-4">
                                <div>
                                    <p className="text-sm font-medium text-foreground">
                                        Add Question
                                    </p>

                                    <p className="mt-1 text-sm text-muted-foreground">
                                        {selectedLesson
                                            ? `Add a question to ${selectedLesson.name}.`
                                            : "Select a lesson to start adding questions."}
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    {questionTypes.map((questionType) => (
                                        <QuestionTypeButton
                                            key={questionType.id}
                                            questionType={questionType}
                                            onAdd={addQuestion}
                                            disabled={!selectedLesson}
                                        />
                                    ))}
                                </div>
                            </div>
                        </aside>
                    </div>
                </TabsContent>
            </Tabs>

            <FeedbackDialog
                open={feedbackDialog.open}
                type={feedbackDialog.type}
                title={feedbackDialog.title}
                description={feedbackDialog.description}
                onClose={closeFeedbackDialog}
            />
        </section>
    )
}

export default QuestionBank