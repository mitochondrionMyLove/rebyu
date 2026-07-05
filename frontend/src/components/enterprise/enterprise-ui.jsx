import { AlertCircle, Inbox, RefreshCw } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function EnterprisePageHeader({ title, subtitle, actions }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {subtitle ? (
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        ) : null}
      </div>
      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
    </div>
  )
}

export function EnterpriseStatCard({ icon: Icon, label, value, hint }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription className="flex items-center gap-2">
          {Icon ? <Icon className="size-4" aria-hidden="true" /> : null}
          {label}
        </CardDescription>
        <CardTitle className="text-3xl tabular-nums">{value}</CardTitle>
      </CardHeader>
      {hint ? (
        <CardContent className="pt-0 text-xs text-muted-foreground">
          {hint}
        </CardContent>
      ) : null}
    </Card>
  )
}

export function EnterpriseLoadingSkeleton({ rows = 4 }) {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Loading">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-28 rounded-xl" />
        ))}
      </div>
      <div className="space-y-2">
        {Array.from({ length: rows }).map((_, index) => (
          <Skeleton key={index} className="h-12 rounded-lg" />
        ))}
      </div>
    </div>
  )
}

export function EnterpriseErrorState({ title, description, onRetry }) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
        <AlertCircle className="size-8 text-destructive" aria-hidden="true" />
        <div>
          <p className="font-medium">{title ?? "Unable to load this data"}</p>
          <p className="mt-1 max-w-md text-sm text-muted-foreground">
            {description ??
              "The organization data could not be loaded right now. It may require a signed-in organization account."}
          </p>
        </div>
        {onRetry ? (
          <Button variant="outline" size="sm" onClick={onRetry}>
            <RefreshCw aria-hidden="true" />
            Try again
          </Button>
        ) : null}
      </CardContent>
    </Card>
  )
}

export function EnterpriseEmptyState({ icon: Icon = Inbox, title, description, action }) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
        <Icon className="size-8 text-muted-foreground" aria-hidden="true" />
        <div>
          <p className="font-medium">{title}</p>
          {description ? (
            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
        {action ?? null}
      </CardContent>
    </Card>
  )
}

const STATUS_BADGE_VARIANTS = {
  // invitation
  PENDING: "secondary",
  ACCEPTED: "default",
  DECLINED: "destructive",
  EXPIRED: "outline",
  REVOKED: "outline",
  // partnership
  UNDER_REVIEW: "secondary",
  MEETING_SCHEDULED: "secondary",
  APPROVED: "default",
  REJECTED: "destructive",
  CANCELLED: "outline",
  // invoice / allocation (lowercase enums in backend)
  issued: "secondary",
  paid: "default",
  overdue: "destructive",
  cancelled: "outline",
  draft: "outline",
  active: "default",
  expired: "outline",
}

export function EnterpriseStatusBadge({ status }) {
  if (!status) return null
  const variant = STATUS_BADGE_VARIANTS[status] ?? "secondary"
  const label = String(status).replaceAll("_", " ").toLowerCase()
  return (
    <Badge variant={variant} className="capitalize">
      {label}
    </Badge>
  )
}

export function formatDate(value) {
  if (!value) return "—"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "—"
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export function formatDateTime(value) {
  if (!value) return "—"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "—"
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function formatMoney(value) {
  const amount = Number(value)
  if (!Number.isFinite(amount)) return "—"
  return amount.toLocaleString(undefined, {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 2,
  })
}
