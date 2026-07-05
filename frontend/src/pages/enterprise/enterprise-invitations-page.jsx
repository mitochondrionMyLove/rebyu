import { useMemo, useState } from "react"
import { useOutletContext } from "react-router-dom"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { MailPlusIcon } from "lucide-react"
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
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  EnterpriseEmptyState,
  EnterpriseErrorState,
  EnterpriseLoadingSkeleton,
  EnterprisePageHeader,
  EnterpriseStatCard,
  EnterpriseStatusBadge,
  formatDateTime,
} from "@/components/enterprise/enterprise-ui.jsx"
import { useEnterpriseData } from "@/hooks/use-enterprise-data.js"
import {
  createLearnerInvitation,
  updateLearnerInvitation,
} from "@/services/enterpriseService.js"

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// LocalDateTime-compatible timestamp (no timezone suffix).
function toLocalDateTime(date) {
  return date.toISOString().slice(0, 19)
}

function InviteLearnerDialog({ open, onOpenChange, data }) {
  const queryClient = useQueryClient()
  const [email, setEmail] = useState("")
  const [orgCertId, setOrgCertId] = useState("")
  const [error, setError] = useState("")

  const availableOrgCerts = data.orgCerts.filter(
    (orgCert) =>
      orgCert.status === "active" &&
      (orgCert.totalSlots ?? 0) - (orgCert.usedSlots ?? 0) > 0
  )

  const inviteMutation = useMutation({
    mutationFn: createLearnerInvitation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["learner-invitations"] })
      toast.success("Invitation sent successfully.")
      setEmail("")
      setOrgCertId("")
      setError("")
      onOpenChange(false)
    },
    onError: () => {
      toast.error("Unable to send the invitation. Please try again.")
    },
  })

  const handleSubmit = (event) => {
    event.preventDefault()
    const trimmed = email.trim().toLowerCase()

    if (!EMAIL_PATTERN.test(trimmed)) {
      setError("Enter a valid email address.")
      return
    }
    if (!orgCertId) {
      setError("Select a certification for this invitation.")
      return
    }
    const duplicate = data.invitations.some(
      (invitation) =>
        invitation.email?.toLowerCase() === trimmed &&
        invitation.orgCertId === Number(orgCertId) &&
        invitation.status === "PENDING"
    )
    if (duplicate) {
      setError("A pending invitation for this email already exists.")
      return
    }

    setError("")
    const now = new Date()
    const expires = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000)
    inviteMutation.mutate({
      orgCertId: Number(orgCertId),
      email: trimmed,
      tokenHash: crypto.randomUUID(),
      sentAt: toLocalDateTime(now),
      expiresAt: toLocalDateTime(expires),
      status: "PENDING",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite learner</DialogTitle>
          <DialogDescription>
            Send an invitation and assign the learner to one of your
            certification allocations.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="invite-email">Email address</Label>
            <Input
              id="invite-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="learner@example.com"
              autoComplete="off"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="invite-cert">Certification</Label>
            <Select value={orgCertId} onValueChange={setOrgCertId}>
              <SelectTrigger id="invite-cert" className="w-full">
                <SelectValue placeholder="Select a certification allocation" />
              </SelectTrigger>
              <SelectContent>
                {availableOrgCerts.length === 0 ? (
                  <div className="px-3 py-2 text-sm text-muted-foreground">
                    No allocations with remaining slots.
                  </div>
                ) : (
                  availableOrgCerts.map((orgCert) => {
                    const certification = data.certificationById.get(
                      orgCert.certificationId
                    )
                    const remaining =
                      (orgCert.totalSlots ?? 0) - (orgCert.usedSlots ?? 0)
                    return (
                      <SelectItem
                        key={orgCert.orgCertId}
                        value={String(orgCert.orgCertId)}
                      >
                        {certification?.title ??
                          `Certification #${orgCert.certificationId}`}{" "}
                        · {remaining} slot(s) left
                      </SelectItem>
                    )
                  })
                )}
              </SelectContent>
            </Select>
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
              onClick={() => onOpenChange(false)}
              disabled={inviteMutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={inviteMutation.isPending}>
              {inviteMutation.isPending ? "Sending..." : "Send Invitation"}
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
  const data = useEnterpriseData(enterprise?.enterpriseId)
  const queryClient = useQueryClient()

  const [inviteOpen, setInviteOpen] = useState(false)
  const [revokeTarget, setRevokeTarget] = useState(null)

  const revokeMutation = useMutation({
    mutationFn: (invitation) =>
      updateLearnerInvitation(invitation.invitationId, {
        ...invitation,
        status: "REVOKED",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["learner-invitations"] })
      toast.success("Invitation revoked.")
      setRevokeTarget(null)
    },
    onError: () => {
      toast.error("Unable to revoke the invitation. Please try again.")
    },
  })

  const sortedInvitations = useMemo(
    () =>
      [...data.invitations].sort(
        (a, b) => new Date(b.sentAt ?? 0) - new Date(a.sentAt ?? 0)
      ),
    [data.invitations]
  )

  if (enterpriseLoading || (enterprise && data.isLoading)) {
    return <EnterpriseLoadingSkeleton />
  }
  if (enterpriseError) {
    return <EnterpriseErrorState onRetry={refetchEnterprise} />
  }
  if (!enterprise) {
    return (
      <EnterpriseEmptyState
        title="No organization found"
        description="Invitations appear here once your organization is registered."
      />
    )
  }

  const totalSlots = data.orgCerts.reduce(
    (sum, cert) => sum + (cert.totalSlots ?? 0),
    0
  )
  const usedSlots = data.orgCerts.reduce(
    (sum, cert) => sum + (cert.usedSlots ?? 0),
    0
  )

  return (
    <div className="space-y-6">
      <EnterprisePageHeader
        title="Invitations"
        subtitle="Invite learners to join your organization's certification programs."
        actions={
          <Button onClick={() => setInviteOpen(true)}>
            <MailPlusIcon aria-hidden="true" />
            Invite Learner
          </Button>
        }
      />

      {data.isError ? (
        <EnterpriseErrorState onRetry={data.refetchAll} />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <EnterpriseStatCard
              label="Total slots"
              value={totalSlots}
              hint="Across all certification allocations"
            />
            <EnterpriseStatCard
              label="Used slots"
              value={usedSlots}
              hint={`${Math.max(totalSlots - usedSlots, 0)} remaining`}
            />
            <EnterpriseStatCard
              label="Pending invitations"
              value={
                sortedInvitations.filter((inv) => inv.status === "PENDING")
                  .length
              }
              hint={`${sortedInvitations.length} sent in total`}
            />
          </div>

          {sortedInvitations.length === 0 ? (
            <EnterpriseEmptyState
              icon={MailPlusIcon}
              title="No invitations yet"
              description="Invitations you send will appear here with their status."
              action={
                <Button size="sm" onClick={() => setInviteOpen(true)}>
                  Invite Learner
                </Button>
              }
            />
          ) : (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Certification</TableHead>
                      <TableHead>Sent</TableHead>
                      <TableHead>Expires</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedInvitations.map((invitation) => {
                      const orgCert = data.orgCertById.get(invitation.orgCertId)
                      const certification = orgCert
                        ? data.certificationById.get(orgCert.certificationId)
                        : null
                      return (
                        <TableRow key={invitation.invitationId}>
                          <TableCell className="font-medium">
                            {invitation.email}
                          </TableCell>
                          <TableCell className="max-w-[220px] truncate">
                            {certification?.title ?? "—"}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {formatDateTime(invitation.sentAt)}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {formatDateTime(invitation.expiresAt)}
                          </TableCell>
                          <TableCell>
                            <EnterpriseStatusBadge status={invitation.status} />
                          </TableCell>
                          <TableCell className="text-right">
                            {invitation.status === "PENDING" ? (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setRevokeTarget(invitation)}
                              >
                                Revoke
                              </Button>
                            ) : null}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </>
      )}

      <InviteLearnerDialog
        open={inviteOpen}
        onOpenChange={setInviteOpen}
        data={data}
      />

      <AlertDialog
        open={revokeTarget != null}
        onOpenChange={(open) => {
          if (!open) setRevokeTarget(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Revoke this invitation?</AlertDialogTitle>
            <AlertDialogDescription>
              {revokeTarget?.email} will no longer be able to accept this
              invitation. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={revokeMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(event) => {
                event.preventDefault()
                revokeMutation.mutate(revokeTarget)
              }}
              disabled={revokeMutation.isPending}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {revokeMutation.isPending ? "Revoking..." : "Revoke Invitation"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
