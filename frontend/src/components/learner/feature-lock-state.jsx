import { Link } from "react-router-dom"
import { LockIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
// Reusable lock card shown above a blurred premium-content preview.
export default function FeatureLockState({
  title = "Pro Feature",
  description = "This feature requires a Pro subscription. Upgrade to unlock it.",
}) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-5 rounded-2xl border bg-card/95 p-8 text-center shadow-2xl">
      <div className="flex size-14 items-center justify-center rounded-full bg-primary/10">
        <LockIcon className="size-6 text-primary" aria-hidden="true" />
      </div>

      <div className="space-y-1.5">
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      <Button asChild className="w-full sm:w-auto">
        <Link to="/learner/subscription">Upgrade to Pro</Link>
      </Button>
    </div>
  )
}
