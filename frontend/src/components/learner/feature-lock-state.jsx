import { Link } from "react-router-dom"
import { ArrowLeftIcon, LockIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import ProBadge from "./pro-badge.jsx"

// Reusable "this feature needs REBYU Pro" state. Shown instead of premium
// content — never rendered on top of already-fetched protected data.
export default function FeatureLockState({
  title = "This is a REBYU Pro feature",
  description = "Detailed analytics are available through REBYU Pro or an eligible institutional license.",
  benefits = [],
  accessSource = "FREE",
  returnTo = "/learner/learning",
  returnLabel = "Return to Lessons",
}) {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-4 rounded-2xl border bg-card p-8 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
        <LockIcon className="size-5 text-primary" aria-hidden="true" />
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-center gap-2">
          <h2 className="text-lg font-semibold">{title}</h2>
          <ProBadge />
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      {benefits.length > 0 ? (
        <ul className="w-full space-y-1.5 rounded-xl bg-muted/40 p-3 text-left text-sm">
          {benefits.map((benefit) => (
            <li key={benefit} className="flex items-start gap-2">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
      ) : null}

      <p className="text-xs text-muted-foreground">
        Current access level: {accessSource.replace(/_/g, " ").toLowerCase()}
      </p>

      <div className="flex w-full flex-col gap-2 sm:flex-row">
        <Button asChild className="flex-1">
          <Link to="/learner/subscription">Upgrade to REBYU Pro</Link>
        </Button>
        <Button asChild variant="outline" className="flex-1">
          <Link to={returnTo}>
            <ArrowLeftIcon aria-hidden="true" />
            {returnLabel}
          </Link>
        </Button>
      </div>
    </div>
  )
}
