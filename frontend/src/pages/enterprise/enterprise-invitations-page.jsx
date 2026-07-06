import { useMemo, useState } from "react"
import { useOutletContext } from "react-router-dom"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Loader2, MailPlus, Ticket, X } from "lucide-react"
import { toast } from "sonner"

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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  EnterpriseEmptyState,
  EnterpriseErrorState,
  EnterpriseLoadingSkeleton,
  EnterprisePageHeader,
  EnterpriseStatusBadge,
  formatDateTime,
} from "@/components/enterprise/enterprise-ui.jsx"
import {
  cancelEnterpriseInvitation,
  getEnterpriseCertificationAccess,
  getEnterpriseInvitations,
  sendEnterpriseInvitations,
} from "@/services/partnershipService.js"

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function InviteDialog({ open, onOpenChange, enterpriseId, access }) {
  const queryClient = useQueryClient()
  const [orgCertId, setOrgCertId] = useState("")
  const [draft, setDraft] = useState("")
  const [emails, setEmails] = useState([])
  const [error, setError] = useState("")

  const selectedAccess = access.find((a) => String(a.orgCertId) === orgCertId)
  const remaining = selectedAccess?.remainingSlots ?? 0

  const reset = () => {
    setOrgCertId("")
    setDraft("")
    setEmails([])
    setError("")
  }

  const addEmail = (value) => {
    const email = value.trim().toLowerCase()
    if (!email) return
    if (!EMAIL_PATTERN.test(email)) {
      setError(`"${email}" is not a valid email.`)
      return
    }
    if (emails.includes(email)) {
      setError("That email is already in the list.")
      return
    }
    if (emails.length >= remaining) {
      setError(`Only ${remaining} slot(s) remaining for this certification.`)
      return
    }
    setEmails((current) => [...current, email])
    setDraft("")
    setError("")
  }

  const sendMutation = useMutation({
    mutationFn: () =>
      sendEnterpriseInvitations({
        enterpriseId,
        orgCertId: Number(orgCertId),
        emails,
      }),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["enterprise-invitations"] })
      queryClient.invalidateQueries({ queryKey: ["enterprise-cert-access"] })
      toast.success(
        `${response.created} invitation(s) sent.` +
          (response.skipped?.length ? ` ${response.skipped.length} skipped.` : "")
      )
      reset()
      onOpenChange(false)
    },
    onError: (err) => {
      const message =
        err?.response?.data?.message ?? "Unable to send invitations. Please try again."
      setError(message)
      toast.error(message)
    },
  })

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!orgCertId) {
      setError("Select a certification.")
      return
    }
    if (emails.length === 0) {
      setError("Add at least one learner email.")
      return
    }
    sendMutation.mutate()
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) reset()
        onOpenChange(next)
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite learners</DialogTitle>
          <DialogDescription>
            Invitations reserve one learner slot each.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="invite-cert">Certification</Label>
            <Select value={orgCertId} onValueChange={setOrgCertId}>
              <SelectTrigger id="invite-cert" className="w-full">
                <SelectValue placeholder="Select certification access" />
              </SelectTrigger>
              <SelectContent>
                {access
                  .filter((a) => a.status === "active")
                  .map((a) => (
                    <SelectItem key={a.orgCertId} value={String(a.orgCertId)}>
                      {a.certificationTitle} · {a.remainingSlots} left
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {orgCertId ? (
            <p className="text-xs text-muted-foreground">
              {emails.length} selected · {Math.max(remaining - emails.length, 0)} slot(s)
              still available
            </p>
          ) : null}

          <div className="space-y-2">
            <Label htmlFor="invite-email">Learner emails</Label>
            <div className="flex gap-2">
              <Input
                id="invite-email"
                type="email"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === ",") {
                    e.preventDefault()
                    addEmail(draft)
                  }
                }}
                placeholder="learner@example.com"
                disabled={!orgCertId}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => addEmail(draft)}
                disabled={!orgCertId || !draft.trim()}
              >
                Add
              </Button>
            </div>
            {emails.length > 0 ? (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {emails.map((email) => (
                  <Badge key={email} variant="secondary" className="gap-1 py-1">
                    {email}
                    <button
                      type="button"
                      onClick={() =>
                        setEmails((current) => current.filter((e) => e !== email))
                      }
                      aria-label={`Remove ${email}`}
                      className="rounded-full outline-none hover:text-destructive"
                    >
                      <X className="size-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            ) : null}
          </div>

          {error ? (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          ) : null}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset()
                onOpenChange(false)
              }}
              disabled={sendMutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={sendMutation.isPending}>
              {sendMutation.isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                  Sending invitations...
                </>
              ) : (
                "Send Invitations"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default function EnterpriseInvitationsPage() {
  const { enterprise, enterpriseLoading, enterpriseError, refetchEnterprise } =
    useOutletContext()
  const queryClient = useQueryClient()
  const enterpriseId = enterprise?.enterpriseId
  const [inviteOpen, setInviteOpen] = useState(false)
  const [cancelTarget, setCancelTarget] = useState(null)

  const accessQuery = useQuery({
    queryKey: ["enterprise-cert-access", enterpriseId],
    queryFn: () => getEnterpriseCertificationAccess(enterpriseId),
    enabled: enterpriseId != null,
    retry: 1,
  })

  const invitationsQuery = useQuery({
    queryKey: ["enterprise-invitations", enterpriseId],
    queryFn: () => getEnterpriseInvitations(enterpriseId),
    enabled: enterpriseId != null,
    retry: 1,
  })

  const cancelMutation = useMutation({
    mutationFn: (invitation) =>
      cancelEnterpriseInvitation(invitation.invitationId, enterpriseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enterprise-invitations"] })
      queryClient.invalidateQueries({ queryKey: ["enterprise-cert-access"] })
      toast.success("Invitation cancelled. Slot restored.")
      setCancelTarget(null)
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message ?? "Unable to cancel the invitation.")
    },
  })

  const access = Array.isArray(accessQuery.data) ? accessQuery.data : []
  const invitations = Array.isArray(invitationsQuery.data) ? invitationsQuery.data : []
  const hasAccess = access.length > 0

  const totals = useMemo(
    () =>
      access.reduce(
        (acc, a) => ({
          total: acc.total + (a.totalSlots ?? 0),
          used: acc.used + (a.usedSlots ?? 0),
          remaining: acc.remaining + (a.remainingSlots ?? 0),
        }),
        { total: 0, used: 0, remaining: 0 }
      ),
    [access]
  )

  if (enterpriseLoading) return <EnterpriseLoadingSkeleton />
  if (enterpriseError) return <EnterpriseErrorState onRetry={refetchEnterprise} />
  if (!enterprise) {
    return (
      <EnterpriseEmptyState
        title="No organization found"
        description="Learner invitations appear here once your organization is approved."
      />
    )
  }

  return (
    <div className="space-y-6">
      <EnterprisePageHeader
        title="Learner Invitations"
        subtitle="Invite learners to your organization's certifications using available slots."
        actions={
          <Button onClick={() => setInviteOpen(true)} disabled={!hasAccess}>
            <MailPlus aria-hidden="true" />
            Invite Learners
          </Button>
        }
      />

      {accessQuery.isError ? (
        <EnterpriseErrorState onRetry={accessQuery.refetch} />
      ) : !hasAccess ? (
        <EnterpriseEmptyState
          icon={Ticket}
          title="No active certification access yet"
          description="Once an approved partnership grants your organization certification slots, you can invite learners here."
        />
      ) : (
        <>
          {/* Certification access cards */}
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {access.map((a) => {
              const used = a.usedSlots ?? 0
              const total = a.totalSlots ?? 0
              const pct = total > 0 ? (used / total) * 100 : 0
              return (
                <Card key={a.orgCertId}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-base">{a.certificationTitle}</CardTitle>
                      <EnterpriseStatusBadge status={a.status} />
                    </div>
                    <CardDescription>
                      {a.remainingSlots} of {total} slots available
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Progress value={pct} aria-label="Slot usage" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{used} used</span>
                      <span>{a.remainingSlots} remaining</span>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Invitation list */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Invitations ({invitations.length})
              </CardTitle>
              <CardDescription>
                {totals.used} slot(s) reserved across {access.length} certification(s).
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {invitationsQuery.isLoading ? (
                <div className="space-y-2 p-4">
                  <EnterpriseLoadingSkeleton rows={3} />
                </div>
              ) : invitations.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  No invitations sent yet.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Certification</TableHead>
                      <TableHead>Sent</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invitations.map((inv) => (
                      <TableRow key={inv.invitationId}>
                        <TableCell className="font-medium">{inv.email}</TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {inv.certificationTitle}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDateTime(inv.sentAt)}
                        </TableCell>
                        <TableCell>
                          <EnterpriseStatusBadge status={inv.status} />
                        </TableCell>
                        <TableCell className="text-right">
                          {inv.status === "PENDING" ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setCancelTarget(inv)}
                            >
                              Cancel
                            </Button>
                          ) : null}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </>
      )}

      <InviteDialog
        open={inviteOpen}
        onOpenChange={setInviteOpen}
        enterpriseId={enterpriseId}
        access={access}
      />

      <AlertDialog
        open={cancelTarget != null}
        onOpenChange={(open) => !open && setCancelTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel this invitation?</AlertDialogTitle>
            <AlertDialogDescription>
              {cancelTarget?.email} will no longer be able to accept this invitation,
              and its reserved slot will be restored.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={cancelMutation.isPending}>
              Keep invitation
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault()
                cancelMutation.mutate(cancelTarget)
              }}
              disabled={cancelMutation.isPending}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {cancelMutation.isPending ? "Cancelling invitation..." : "Cancel Invitation"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
