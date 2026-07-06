import { base } from "./base"

// Transaction One (public): submit a partnership request from the landing page
// and check its status. No authentication required.
export function submitPublicPartnershipRequest(payload) {
  return base("public/partnership-requests", { method: "POST", data: payload })
}

export function getPublicPartnershipStatus({ referenceNumber, organizationEmail }) {
  return base("public/partnership-requests/status", {
    method: "POST",
    data: { referenceNumber, organizationEmail },
  })
}

// Transaction Two (admin): review partnership requests.
export function getAdminPartnershipRequests(status) {
  const query = status && status !== "ALL" ? `?status=${status}` : ""
  return base(`admin/partnership-requests${query}`)
}

export function getAdminPartnershipRequestDetail(requestId) {
  return base(`admin/partnership-requests/${requestId}`)
}

export function approvePartnershipRequest(requestId, remarks) {
  return base(`admin/partnership-requests/${requestId}/approve`, {
    method: "PUT",
    data: { remarks },
  })
}

export function rejectPartnershipRequest(requestId, remarks) {
  return base(`admin/partnership-requests/${requestId}/reject`, {
    method: "PUT",
    data: { remarks },
  })
}

// Transaction Three (enterprise): certification access + learner invitations.
export function getEnterpriseCertificationAccess(enterpriseId) {
  return base(`enterprise/certification-access?enterpriseId=${enterpriseId}`)
}

export function sendEnterpriseInvitations({ enterpriseId, orgCertId, emails }) {
  return base("enterprise/invitations", {
    method: "POST",
    data: { enterpriseId, orgCertId, emails },
  })
}

export function getEnterpriseInvitations(enterpriseId) {
  return base(`enterprise/invitations?enterpriseId=${enterpriseId}`)
}

export function cancelEnterpriseInvitation(invitationId, enterpriseId) {
  return base(
    `enterprise/invitations/${invitationId}/cancel?enterpriseId=${enterpriseId}`,
    { method: "PUT" }
  )
}
