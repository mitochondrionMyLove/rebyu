import { useEffect, useState } from "react"
import { AlertTriangleIcon, Trash2Icon } from "lucide-react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils"

function isValidPoints(value) {
  const number = Number(value)
  return Number.isFinite(number) && number > 0
}

/**
 * Per-question points configuration (spec §10–16). Modes: same-for-all or
 * per-question. Points live on the exam-question relationship, so a value is
 * kept for every question. `value` is a map { [questionId]: number }; `onChange`
 * receives the next map.
 */
export default function QuestionPointsConfiguration({
  questions = [],
  value = {},
  onChange,
  passingPercentage = 70,
  onRemove,
}) {
  const [mode, setMode] = useState("SAME")
  const [samePoints, setSamePoints] = useState(2)
  const [bulkPoints, setBulkPoints] = useState(2)
  const [pendingMode, setPendingMode] = useState(null)
  const [confirmBulk, setConfirmBulk] = useState(false)

  // Ensure every question carries a point value (default 2 for new ones).
  useEffect(() => {
    let changed = false
    const next = { ...value }
    for (const question of questions) {
      if (next[question.questionId] == null) {
        next[question.questionId] = mode === "SAME" ? samePoints : 2
        changed = true
      }
    }
    if (changed) onChange?.(next)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questions])

  const values = questions.map((question) => Number(value[question.questionId]))
  const configured = values.filter(isValidPoints).length
  const unconfigured = questions.length - configured
  const totalPoints = values.reduce(
    (sum, points) => sum + (isValidPoints(points) ? points : 0),
    0
  )
  const requiredPassing = Math.ceil((totalPoints * passingPercentage) / 100)

  function applyToAll(points) {
    const next = {}
    for (const question of questions) next[question.questionId] = points
    onChange?.(next)
  }

  function setOne(questionId, points) {
    onChange?.({ ...value, [questionId]: points })
  }

  function requestModeChange(nextMode) {
    if (nextMode === mode) return
    if (nextMode === "SAME") {
      const distinct = new Set(values.filter(Number.isFinite))
      if (distinct.size > 1) {
        setPendingMode("SAME")
        return
      }
      setMode("SAME")
      applyToAll(samePoints)
    } else {
      setMode("INDIVIDUAL") // keep existing values
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border p-4">
        <h4 className="text-sm font-semibold">Question Points Configuration</h4>
        <RadioGroup
          value={mode}
          onValueChange={requestModeChange}
          className="mt-3 gap-2"
        >
          <label className="flex items-center gap-2 text-sm">
            <RadioGroupItem value="SAME" />
            Same points for all questions
          </label>
          <label className="flex items-center gap-2 text-sm">
            <RadioGroupItem value="INDIVIDUAL" />
            Configure points per question
          </label>
        </RadioGroup>

        {mode === "SAME" ? (
          <div className="mt-3 flex items-end gap-2">
            <div className="space-y-1">
              <Label htmlFor="same-points" className="text-xs">
                Points per question
              </Label>
              <Input
                id="same-points"
                type="number"
                min="0.01"
                step="0.5"
                value={samePoints}
                onChange={(event) => {
                  const next = event.target.value
                  setSamePoints(next)
                  if (isValidPoints(next)) applyToAll(Number(next))
                }}
                className="h-9 w-28"
                aria-invalid={!isValidPoints(samePoints)}
              />
            </div>
            {!isValidPoints(samePoints) ? (
              <p className="pb-1 text-xs text-destructive">
                Points must be greater than zero.
              </p>
            ) : null}
          </div>
        ) : (
          <div className="mt-3 flex flex-wrap items-end gap-2 rounded-lg bg-muted/40 p-3">
            <div className="space-y-1">
              <Label htmlFor="bulk-points" className="text-xs">
                Bulk points
              </Label>
              <Input
                id="bulk-points"
                type="number"
                min="0.01"
                step="0.5"
                value={bulkPoints}
                onChange={(event) => setBulkPoints(event.target.value)}
                className="h-9 w-28"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={!isValidPoints(bulkPoints)}
              onClick={() => setConfirmBulk(true)}
            >
              Apply to All Questions
            </Button>
          </div>
        )}
      </div>

      {/* Selected questions */}
      <ul className="space-y-2">
        {questions.map((question, index) => {
          const points = value[question.questionId]
          const invalid = !isValidPoints(points)
          const source = [question.majorTitle, question.middleTitle, question.lessonTitle]
            .filter(Boolean)
            .join(" → ")
          return (
            <li
              key={question.questionId}
              className={cn(
                "flex items-start gap-3 rounded-lg border p-3 text-sm",
                invalid && "border-destructive/60"
              )}
            >
              <span className="mt-0.5 text-xs font-semibold text-muted-foreground">
                {index + 1}.
              </span>
              <div className="min-w-0 flex-1">
                <p className="line-clamp-2 font-medium">{question.questionText}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {question.questionType}
                  {question.difficultyLevel ? ` · ${question.difficultyLevel}` : ""}
                  {source ? ` · ${source}` : ""}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min="0.01"
                  step="0.5"
                  value={points ?? ""}
                  onChange={(event) => setOne(question.questionId, event.target.value)}
                  readOnly={mode === "SAME"}
                  disabled={mode === "SAME"}
                  className="h-8 w-20"
                  aria-label={`Points for question ${index + 1}`}
                  aria-invalid={invalid}
                />
                {onRemove ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onRemove(question.questionId)}
                    aria-label="Remove question"
                  >
                    <Trash2Icon className="size-4" aria-hidden="true" />
                  </Button>
                ) : null}
              </div>
            </li>
          )
        })}
      </ul>

      {/* Live scoring summary (§16) */}
      <dl className="grid grid-cols-2 gap-x-6 gap-y-1 rounded-xl border p-3 text-sm sm:grid-cols-3">
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Selected</dt>
          <dd className="font-medium tabular-nums">{questions.length}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Configured</dt>
          <dd className="font-medium tabular-nums">{configured}</dd>
        </div>
        <div className="flex justify-between">
          <dt
            className={cn(
              "text-muted-foreground",
              unconfigured > 0 && "text-destructive"
            )}
          >
            Unconfigured
          </dt>
          <dd
            className={cn(
              "font-medium tabular-nums",
              unconfigured > 0 && "text-destructive"
            )}
          >
            {unconfigured}
          </dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Total points</dt>
          <dd className="font-medium tabular-nums">{totalPoints}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Passing</dt>
          <dd className="font-medium tabular-nums">{passingPercentage}%</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Required points</dt>
          <dd className="font-medium tabular-nums">{requiredPassing}</dd>
        </div>
      </dl>

      {unconfigured > 0 ? (
        <p className="flex items-center gap-1.5 text-xs text-destructive">
          <AlertTriangleIcon className="size-3.5" aria-hidden="true" />
          {unconfigured} question(s) need a valid point value greater than zero.
        </p>
      ) : null}

      {/* Confirm switching to same-points (would overwrite individual values) */}
      <AlertDialog
        open={pendingMode === "SAME"}
        onOpenChange={(open) => !open && setPendingMode(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Apply {samePoints} points to all questions?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This replaces the existing point values for all {questions.length}{" "}
              question(s).
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setMode("SAME")
                applyToAll(Number(samePoints))
                setPendingMode(null)
              }}
            >
              Apply to All Questions
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Confirm bulk apply-to-all */}
      <AlertDialog open={confirmBulk} onOpenChange={setConfirmBulk}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apply {bulkPoints} points to all?</AlertDialogTitle>
            <AlertDialogDescription>
              This replaces the existing point values for all {questions.length}{" "}
              question(s).
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                applyToAll(Number(bulkPoints))
                setConfirmBulk(false)
              }}
            >
              Apply to All Questions
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
