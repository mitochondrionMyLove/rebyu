import { base } from "./base"

// Organization / tenant
export function getAllEnterprises() {
  return base("enterprises")
}

export function getEnterpriseById(enterpriseId) {
  return base(`enterprises/${enterpriseId}`)
}

export function updateEnterprise(enterpriseId, enterprise) {
  return base(`enterprises/${enterpriseId}`, { method: "PUT", data: enterprise })
}

export function getEnterpriseMembers(enterpriseId) {
  return base(`enterprise-members/enterprise/${enterpriseId}`)
}

// Certification allocations (slots per certification for an organization)
export function getOrganizationCertificates() {
  return base("organization-certificates")
}

export function getOrganizationCertificationLearners() {
  return base("organization-certification-learners")
}

// Learner invitations
export function getLearnerInvitations() {
  return base("learner-invitations")
}

export function createLearnerInvitation(invitation) {
  return base("learner-invitations", { method: "POST", data: invitation })
}

export function updateLearnerInvitation(invitationId, invitation) {
  return base(`learner-invitations/${invitationId}`, {
    method: "PUT",
    data: invitation,
  })
}

export function deleteLearnerInvitation(invitationId) {
  return base(`learner-invitations/${invitationId}`, { method: "DELETE" })
}

// Billing
export function getEnterpriseInvoices() {
  return base("enterprise-invoices")
}

export function getEnterpriseInvoiceItems() {
  return base("enterprise-invoice-items")
}

// Partnership
export function getPartnershipRequests() {
  return base("partnership-requests")
}

export function createPartnershipRequest(request) {
  return base("partnership-requests", { method: "POST", data: request })
}

export function updatePartnershipRequest(requestId, request) {
  return base(`partnership-requests/${requestId}`, {
    method: "PUT",
    data: request,
  })
}

export function getPartnershipRequestItems() {
  return base("partnership-request-items")
}

export function createPartnershipRequestItem(item) {
  return base("partnership-request-items", { method: "POST", data: item })
}

export function getPartnershipMeetings() {
  return base("partnership-meetings")
}

// Renewals
export function getRenewalRequestsByOrgCert(orgCertId) {
  return base(`enterprise-certification-renewal-requests/org-cert/${orgCertId}`)
}

export function createRenewalRequest(request) {
  return base("enterprise-certification-renewal-requests", {
    method: "POST",
    data: request,
  })
}

// People (shared endpoints, filtered client-side to the organization)
export function getAllLearners() {
  return base("learners")
}

export function getAllUsers() {
  return base("users")
}
