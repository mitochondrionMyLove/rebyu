import { FlagIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// Item grid + summary shown on the right side of an attempt (or inside a
// sheet on smaller screens).
export default function QuestionNavigator({
  questions,
  currentIndex,
  answeredIds,
  flaggedIds,
  onJump,
  onFinish,
  finishDisabled = false,
}) {
  const answered = questions.filter((question) =>
    answeredIds.has(question.questionId)
  ).length
  const flagged = flaggedIds.size

  return (
    <div className="flex h-full flex-col gap-4">
      <div>
        <h3 className="text-sm font-semibold">Item Navigation</h3>
        <div className="mt-3 grid grid-cols-5 gap-1.5">
          {questions.map((question, index) => {
            const isCurrent = index === currentIndex
            const isAnswered = answeredIds.has(question.questionId)
            const isFlagged = flaggedIds.has(question.questionId)
            return (
              <button
                key={question.questionId}
                type="button"
                onClick={() => onJump(index)}
                aria-label={`Go to question ${index + 1}${
                  isAnswered ? ", answered" : ", unanswered"
                }${isFlagged ? ", flagged" : ""}`}
                aria-current={isCurrent ? "true" : undefined}
                className={cn(
                  "relative flex h-9 items-center justify-center rounded-lg border text-sm font-medium transition outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  isCurrent
                    ? "border-primary bg-primary text-primary-foreground"
                    : isAnswered
                      ? "border-primary/40 bg-primary/10"
                      : "bg-background text-muted-foreground hover:bg-muted"
                )}
              >
                {index + 1}
                {isFlagged ? (
                  <FlagIcon
                    aria-hidden="true"
                    className="absolute -right-1 -top-1 size-3 fill-amber-400 text-amber-500"
                  />
                ) : null}
              </button>
            )
          })}
        </div>
      </div>

      <dl className="space-y-1.5 rounded-xl bg-muted/40 p-3 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Total</dt>
          <dd className="font-medium tabular-nums">{questions.length}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Answered</dt>
          <dd className="font-medium tabular-nums">{answered}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Unanswered</dt>
          <dd className="font-medium tabular-nums">
            {questions.length - answered}
          </dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Flagged</dt>
          <dd className="font-medium tabular-nums">{flagged}</dd>
        </div>
      </dl>

      <div className="mt-auto">
        <Button
          type="button"
          className="w-full"
          onClick={onFinish}
          disabled={finishDisabled}
        >
          Finish Attempt
        </Button>
      </div>
    </div>
  )
}
