import {
  CheckIcon,
  CircleDashedIcon,
  CircleDotIcon,
  FlagIcon,
  SkipForwardIcon,
} from "lucide-react"

// Single source of truth for item states so the navigator cards, the legend,
// and screen-reader labels never drift. States are conveyed with icon + border
// + text, never color alone.
export const ITEM_STATUS = {
  current: {
    key: "current",
    label: "Current",
    icon: CircleDotIcon,
    card: "border-primary bg-primary text-primary-foreground ring-2 ring-primary/40",
    dot: "text-primary",
  },
  answered: {
    key: "answered",
    label: "Answered",
    icon: CheckIcon,
    card: "border-primary/50 bg-primary/10 text-foreground",
    dot: "text-primary",
  },
  partial: {
    key: "partial",
    label: "Partially answered",
    icon: CircleDotIcon,
    card: "border-amber-400 bg-amber-50 text-amber-900 dark:bg-amber-950/40 dark:text-amber-200",
    dot: "text-amber-500",
  },
  skipped: {
    key: "skipped",
    label: "Skipped",
    icon: SkipForwardIcon,
    card: "border-dashed border-muted-foreground/50 bg-muted/40 text-muted-foreground",
    dot: "text-muted-foreground",
  },
  unanswered: {
    key: "unanswered",
    label: "Not answered",
    icon: CircleDashedIcon,
    card: "border-border bg-background text-muted-foreground",
    dot: "text-muted-foreground/60",
  },
}

export const FLAG_META = { label: "Flagged", icon: FlagIcon }

// Derives the base status of an item (current/flagged are overlays applied
// on top of this by the card component).
export function deriveItemStatus(item) {
  const hasSubs = (item.subQuestionCount ?? 0) > 0
  if (item.answered && hasSubs && item.subAnsweredCount < item.subQuestionCount) {
    return ITEM_STATUS.partial
  }
  if (item.answered) return ITEM_STATUS.answered
  if (item.skipped) return ITEM_STATUS.skipped
  return ITEM_STATUS.unanswered
}
