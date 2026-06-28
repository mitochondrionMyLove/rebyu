import React, { useState } from "react"
import { Plus, Trash2 } from "lucide-react"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

function createEmptyChoice() {
    return {
        id: `${Date.now()}-${Math.random()}`,
        choiceText: "",
        explanation: "",
        imageFile: null,
    }
}

function getLessonId(lesson) {
    return String(lesson.lessonId ?? lesson.id)
}

function getLessonLabel(lesson) {
    return (
        lesson.lessonName ??
        lesson.lessonTitle ??
        lesson.title ??
        lesson.name ??
        `Lesson #${getLessonId(lesson)}`
    )
}

const TEMPORARY_LESSONS = [
    {
        lessonId: 1,
        lessonName: "Introduction to TOPCIT",
    },
    {
        lessonId: 2,
        lessonName: "Software Development Fundamentals",
    },
    {
        lessonId: 3,
        lessonName: "Database Design and SQL",
    },
    {
        lessonId: 4,
        lessonName: "Network and Security Fundamentals",
    },
    {
        lessonId: 5,
        lessonName: "System Analysis and Design",
    },
    {
        lessonId: 6,
        lessonName: "IT Project Management",
    },
]

export default function CreateQuestionDialog({
                                                 onClickCreateQuestion,
                                                 onCreateQuestion,
                                                 lessons = TEMPORARY_LESSONS,
                                             }) {
    const [questionType, setQuestionType] = useState("MULTIPLE_CHOICE")
    const [difficultyLevel, setDifficultyLevel] = useState("")
    const [lessonId, setLessonId] = useState("")
    const [questionText, setQuestionText] = useState("")
    const [questionImage, setQuestionImage] = useState(null)

    const [choices, setChoices] = useState([
        createEmptyChoice(),
        createEmptyChoice(),
    ])

    const [correctChoiceId, setCorrectChoiceId] = useState("")

    // For Short Answer and Critical Thinking
    const [expectedAnswer, setExpectedAnswer] = useState("")
    const [explanation, setExplanation] = useState("")

    // For TOPCIT Descriptive Questions
    const [referenceAnswer, setReferenceAnswer] = useState("")
    const [evaluationRubric, setEvaluationRubric] = useState("")
    const [maxScore, setMaxScore] = useState("")

    const [errors, setErrors] = useState({})

    const isMultipleChoice = questionType === "MULTIPLE_CHOICE"
    const isDescriptive = questionType === "DESCRIPTIVE"
    const isNoChoiceQuestion = !isMultipleChoice && !isDescriptive

    function handleQuestionTypeChange(value) {
        setQuestionType(value)
        setErrors({})
    }

    function addChoice() {
        setChoices((currentChoices) => [
            ...currentChoices,
            createEmptyChoice(),
        ])
    }

    function removeChoice(choiceId) {
        if (choices.length <= 2) return

        setChoices((currentChoices) =>
            currentChoices.filter((choice) => choice.id !== choiceId)
        )

        if (correctChoiceId === choiceId) {
            setCorrectChoiceId("")
        }
    }

    function updateChoice(choiceId, field, value) {
        setChoices((currentChoices) =>
            currentChoices.map((choice) =>
                choice.id === choiceId
                    ? {
                        ...choice,
                        [field]: value,
                    }
                    : choice
            )
        )
    }

    function validateForm() {
        const nextErrors = {}

        if (!difficultyLevel) {
            nextErrors.difficultyLevel = "Please select a difficulty level."
        }

        if (!lessonId) {
            nextErrors.lessonId = "Please select a lesson."
        }

        if (!questionText.trim()) {
            nextErrors.questionText = "Question text is required."
        }

        if (isMultipleChoice) {
            const hasEmptyChoice = choices.some(
                (choice) => !choice.choiceText.trim()
            )

            if (hasEmptyChoice) {
                nextErrors.choices = "Every choice must have text."
            }

            if (!correctChoiceId) {
                nextErrors.correctChoice = "Select the correct answer."
            }
        }

        if (isNoChoiceQuestion && !expectedAnswer.trim()) {
            nextErrors.expectedAnswer = "Expected answer is required."
        }

        if (isDescriptive) {
            if (!referenceAnswer.trim()) {
                nextErrors.referenceAnswer =
                    "Reference answer is required for descriptive questions."
            }

            if (!evaluationRubric.trim()) {
                nextErrors.evaluationRubric =
                    "Evaluation rubric is required for descriptive questions."
            }

            if (!maxScore || Number(maxScore) <= 0) {
                nextErrors.maxScore = "Enter a valid maximum score."
            }
        }

        setErrors(nextErrors)

        return Object.keys(nextErrors).length === 0
    }

    function handleSubmit(event) {
        event.preventDefault()

        if (!validateForm()) return

        const questionPayload = {
            questionType,
            difficultyLevel,
            lessonId: Number(lessonId),
            questionText,
            questionImage,

            choices: isMultipleChoice
                ? choices.map((choice, index) => ({
                    choiceText: choice.choiceText,
                    imageFile: choice.imageFile,
                    explanation: choice.explanation,
                    isCorrect: choice.id === correctChoiceId,
                    displayOrder: index + 1,
                }))
                : [],

            noChoiceQuestion: isNoChoiceQuestion
                ? {
                    answerText: expectedAnswer,
                    explanation,
                }
                : null,

            descriptiveQuestion: isDescriptive
                ? {
                    referenceAnswer,
                    evaluationRubric,
                    maxScore: Number(maxScore),
                }
                : null,
        }

        console.log("Question payload:", questionPayload)

        onCreateQuestion?.(questionPayload)
    }

    function getExpectedAnswerLabel() {
        if (questionType === "SHORT_ANSWER") {
            return "Expected Short Answer"
        }

        if (questionType === "CRITICAL_THINKING") {
            return "Reference Answer"
        }

        return "Expected Answer"
    }

    function getExpectedAnswerPlaceholder() {
        if (questionType === "SHORT_ANSWER") {
            return "Enter the expected short answer..."
        }

        if (questionType === "CRITICAL_THINKING") {
            return "Enter the expected key concepts or reference answer..."
        }

        return "Enter the expected answer..."
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <button
                    type="button"
                    className="rounded-lg bg-zinc-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800"
                    onClick={onClickCreateQuestion}
                >
                    Create
                </button>
            </DialogTrigger>

            <DialogContent
                className="
          h-[calc(100dvh-2rem)]
          w-[calc(100vw-2rem)]
          max-w-none
          overflow-hidden
          rounded-2xl
          border-zinc-200
          bg-white
          p-0

          sm:h-[calc(100dvh-4rem)]
          sm:w-[80vw]
          sm:max-w-[80vw]

          md:w-[65vw]
          md:max-w-[65vw]

          lg:h-[min(700px,calc(100dvh-4rem))]
          lg:w-[55vw]
          lg:max-w-[55vw]
        "
            >
                <form
                    onSubmit={handleSubmit}
                    className="flex h-full min-h-0 flex-col"
                >
                    <DialogHeader className="border-b border-zinc-200 px-6 py-5">
                        <DialogTitle className="text-xl font-semibold text-zinc-950">
                            Create Question
                        </DialogTitle>

                        <DialogDescription className="text-sm text-zinc-500">
                            Add a question to your question bank.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
                        <div className="space-y-6">
                            <div className="grid gap-5 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>Question Type</Label>

                                    <Select
                                        value={questionType}
                                        onValueChange={handleQuestionTypeChange}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select question type" />
                                        </SelectTrigger>

                                        <SelectContent>
                                            <SelectItem value="MULTIPLE_CHOICE">
                                                Multiple Choice
                                            </SelectItem>

                                            <SelectItem value="DESCRIPTIVE">
                                                Descriptive
                                            </SelectItem>

                                            <SelectItem value="SHORT_ANSWER">
                                                Short Answer
                                            </SelectItem>

                                            <SelectItem value="CRITICAL_THINKING">
                                                Critical Thinking
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Difficulty Level</Label>

                                    <Select
                                        value={difficultyLevel}
                                        onValueChange={setDifficultyLevel}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select difficulty" />
                                        </SelectTrigger>

                                        <SelectContent>
                                            <SelectItem value="EASY">Easy</SelectItem>
                                            <SelectItem value="AVERAGE">Average</SelectItem>
                                            <SelectItem value="HARD">Hard</SelectItem>
                                        </SelectContent>
                                    </Select>

                                    {errors.difficultyLevel && (
                                        <p className="text-xs text-red-500">
                                            {errors.difficultyLevel}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Lesson</Label>

                                <Select value={lessonId} onValueChange={setLessonId}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select lesson" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        {lessons.length === 0 ? (
                                            <div className="px-2 py-6 text-center text-sm text-zinc-500">
                                                No lessons available.
                                            </div>
                                        ) : (
                                            lessons.map((lesson) => (
                                                <SelectItem
                                                    key={getLessonId(lesson)}
                                                    value={getLessonId(lesson)}
                                                >
                                                    {getLessonLabel(lesson)}
                                                </SelectItem>
                                            ))
                                        )}
                                    </SelectContent>
                                </Select>

                                {errors.lessonId && (
                                    <p className="text-xs text-red-500">{errors.lessonId}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="questionText">
                                    {isDescriptive ? "Scenario and Instruction" : "Question"}
                                </Label>

                                <Textarea
                                    id="questionText"
                                    value={questionText}
                                    onChange={(event) => setQuestionText(event.target.value)}
                                    placeholder={
                                        isDescriptive
                                            ? "Enter the scenario and instruction for the learner..."
                                            : "Type the question here..."
                                    }
                                    className="min-h-28 resize-y"
                                />

                                {errors.questionText && (
                                    <p className="text-xs text-red-500">
                                        {errors.questionText}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="questionImage">
                                    Question Image{" "}
                                    <span className="text-zinc-400">(optional)</span>
                                </Label>

                                <Input
                                    id="questionImage"
                                    type="file"
                                    accept="image/*"
                                    onChange={(event) =>
                                        setQuestionImage(event.target.files?.[0] ?? null)
                                    }
                                />
                            </div>

                            {isMultipleChoice && (
                                <section className="space-y-4 border-t border-zinc-200 pt-6">
                                    <div className="flex flex-wrap items-center justify-between gap-3">
                                        <div>
                                            <h3 className="text-base font-semibold text-zinc-950">
                                                Answer Choices
                                            </h3>

                                            <p className="mt-1 text-sm text-zinc-500">
                                                Add answer choices and select one correct answer.
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={addChoice}
                                            className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
                                        >
                                            <Plus className="h-4 w-4" />
                                            Add Choice
                                        </button>
                                    </div>

                                    {errors.choices && (
                                        <p className="text-sm text-red-500">{errors.choices}</p>
                                    )}

                                    {errors.correctChoice && (
                                        <p className="text-sm text-red-500">
                                            {errors.correctChoice}
                                        </p>
                                    )}

                                    <div className="space-y-4">
                                        {choices.map((choice, index) => (
                                            <div
                                                key={choice.id}
                                                className="rounded-xl border border-zinc-200 bg-zinc-50 p-4"
                                            >
                                                <div className="mb-4 flex items-center justify-between gap-3">
                                                    <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-zinc-700">
                                                        <input
                                                            type="radio"
                                                            name="correctChoice"
                                                            checked={correctChoiceId === choice.id}
                                                            onChange={() => setCorrectChoiceId(choice.id)}
                                                            className="h-4 w-4 accent-zinc-950"
                                                        />
                                                        Correct answer
                                                    </label>

                                                    <button
                                                        type="button"
                                                        onClick={() => removeChoice(choice.id)}
                                                        disabled={choices.length <= 2}
                                                        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-zinc-500 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                                                        aria-label={`Remove choice ${index + 1}`}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>

                                                <div className="space-y-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor={`choice-${choice.id}`}>
                                                            Choice {index + 1}
                                                        </Label>

                                                        <Input
                                                            id={`choice-${choice.id}`}
                                                            value={choice.choiceText}
                                                            onChange={(event) =>
                                                                updateChoice(
                                                                    choice.id,
                                                                    "choiceText",
                                                                    event.target.value
                                                                )
                                                            }
                                                            placeholder={`Type choice ${index + 1}`}
                                                        />
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor={`choice-image-${choice.id}`}>
                                                            Choice Image{" "}
                                                            <span className="text-zinc-400">
                                (optional)
                              </span>
                                                        </Label>

                                                        <Input
                                                            id={`choice-image-${choice.id}`}
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={(event) =>
                                                                updateChoice(
                                                                    choice.id,
                                                                    "imageFile",
                                                                    event.target.files?.[0] ?? null
                                                                )
                                                            }
                                                        />
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor={`choice-explanation-${choice.id}`}>
                                                            Explanation{" "}
                                                            <span className="text-zinc-400">
                                (optional)
                              </span>
                                                        </Label>

                                                        <Textarea
                                                            id={`choice-explanation-${choice.id}`}
                                                            value={choice.explanation}
                                                            onChange={(event) =>
                                                                updateChoice(
                                                                    choice.id,
                                                                    "explanation",
                                                                    event.target.value
                                                                )
                                                            }
                                                            placeholder="Explain why this choice is correct or incorrect..."
                                                            className="min-h-20 resize-y"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {isDescriptive && (
                                <section className="space-y-5 border-t border-zinc-200 pt-6">
                                    <div>
                                        <h3 className="text-base font-semibold text-zinc-950">
                                            Descriptive Question Evaluation
                                        </h3>

                                        <p className="mt-1 text-sm text-zinc-500">
                                            Add the reference answer and scoring criteria the AI will
                                            use when evaluating the learner’s response.
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="referenceAnswer">Reference Answer</Label>

                                        <Textarea
                                            id="referenceAnswer"
                                            value={referenceAnswer}
                                            onChange={(event) =>
                                                setReferenceAnswer(event.target.value)
                                            }
                                            placeholder="Enter a sample high-quality answer with expected key concepts..."
                                            className="min-h-36 resize-y"
                                        />

                                        <p className="text-xs text-zinc-500">
                                            Include the important technical concepts, solution steps,
                                            and expected details the learner should mention.
                                        </p>

                                        {errors.referenceAnswer && (
                                            <p className="text-xs text-red-500">
                                                {errors.referenceAnswer}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="evaluationRubric">
                                            Evaluation Rubric
                                        </Label>

                                        <Textarea
                                            id="evaluationRubric"
                                            value={evaluationRubric}
                                            onChange={(event) =>
                                                setEvaluationRubric(event.target.value)
                                            }
                                            placeholder={
                                                "Example:\n• Identifies the problem correctly — 3 points\n• Gives a valid technical solution — 4 points\n• Explains implementation steps — 3 points"
                                            }
                                            className="min-h-36 resize-y"
                                        />

                                        <p className="text-xs text-zinc-500">
                                            Write the criteria and points the AI must use when
                                            scoring the learner’s answer.
                                        </p>

                                        {errors.evaluationRubric && (
                                            <p className="text-xs text-red-500">
                                                {errors.evaluationRubric}
                                            </p>
                                        )}
                                    </div>

                                    <div className="max-w-xs space-y-2">
                                        <Label htmlFor="maxScore">Maximum Score</Label>

                                        <Input
                                            id="maxScore"
                                            type="number"
                                            min="1"
                                            value={maxScore}
                                            onChange={(event) => setMaxScore(event.target.value)}
                                            placeholder="Example: 5, 10, or 15"
                                        />

                                        {errors.maxScore && (
                                            <p className="text-xs text-red-500">
                                                {errors.maxScore}
                                            </p>
                                        )}
                                    </div>
                                </section>
                            )}

                            {isNoChoiceQuestion && (
                                <section className="space-y-5 border-t border-zinc-200 pt-6">
                                    <div>
                                        <h3 className="text-base font-semibold text-zinc-950">
                                            {getExpectedAnswerLabel()}
                                        </h3>

                                        <p className="mt-1 text-sm text-zinc-500">
                                            Add the expected answer or required key concepts for this
                                            question.
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="expectedAnswer">
                                            {getExpectedAnswerLabel()}
                                        </Label>

                                        <Textarea
                                            id="expectedAnswer"
                                            value={expectedAnswer}
                                            onChange={(event) =>
                                                setExpectedAnswer(event.target.value)
                                            }
                                            placeholder={getExpectedAnswerPlaceholder()}
                                            className="min-h-32 resize-y"
                                        />

                                        {errors.expectedAnswer && (
                                            <p className="text-xs text-red-500">
                                                {errors.expectedAnswer}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="explanation">
                                            Explanation{" "}
                                            <span className="text-zinc-400">(optional)</span>
                                        </Label>

                                        <Textarea
                                            id="explanation"
                                            value={explanation}
                                            onChange={(event) => setExplanation(event.target.value)}
                                            placeholder="Add feedback or an explanation for learners..."
                                            className="min-h-28 resize-y"
                                        />
                                    </div>
                                </section>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 border-t border-zinc-200 px-6 py-4">
                        <button
                            type="submit"
                            className="rounded-lg bg-zinc-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800"
                        >
                            Create Question
                        </button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}