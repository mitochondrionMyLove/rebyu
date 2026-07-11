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

// Enterprise learner groups (per certification allocation)
export function getEnterpriseGroups({ enterpriseId, orgCertId } = {}) {
  const params = new URLSearchParams()
  if (enterpriseId != null) params.set("enterpriseId", enterpriseId)
  if (orgCertId != null) params.set("orgCertId", orgCertId)
  const query = params.toString()
  return base(`enterprise-groups${query ? `?${query}` : ""}`)
}

export function getEnterpriseGroupById(groupId) {
  return base(`enterprise-groups/${groupId}`)
}

export function createEnterpriseGroup(group) {
  return base("enterprise-groups", { method: "POST", data: group })
}

export function updateEnterpriseGroup(groupId, group) {
  return base(`enterprise-groups/${groupId}`, { method: "PUT", data: group })
}

export function archiveEnterpriseGroup(groupId) {
  return base(`enterprise-groups/${groupId}`, { method: "DELETE" })
}

// Group authorities (teacher / co-admin assigned by the enterprise to a group)
export function getEnterpriseGroupAuthorities({ groupId, userId } = {}) {
  const params = new URLSearchParams()
  if (groupId != null) params.set("groupId", groupId)
  if (userId != null) params.set("userId", userId)
  const query = params.toString()
  return base(`enterprise-group-authorities${query ? `?${query}` : ""}`)
}

export function assignEnterpriseGroupAuthority(authority) {
  return base("enterprise-group-authorities", {
    method: "POST",
    data: authority,
  })
}

export function removeEnterpriseGroupAuthority(authorityId) {
  return base(`enterprise-group-authorities/${authorityId}`, {
    method: "DELETE",
  })
}

// Group assignees (learners added to a group by its assigned authority)
export function getEnterpriseGroupAssignees({ groupId } = {}) {
  const query = groupId != null ? `?groupId=${groupId}` : ""
  return base(`enterprise-group-assignees${query}`)
}

export function addEnterpriseGroupAssignee(assignee) {
  return base("enterprise-group-assignees", { method: "POST", data: assignee })
}

export function removeEnterpriseGroupAssignee(assigneeId) {
  return base(`enterprise-group-assignees/${assigneeId}`, { method: "DELETE" })
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

// Transaction Three: submit a partnership request and all of its line items
// atomically, with idempotency to prevent duplicate submissions.
export function submitPartnershipRequestTransaction(request) {
  return base("enterprise/partnership-requests", {
    method: "POST",
    data: request,
  })
}

export function getPartnershipRequestTransactions(enterpriseId) {
  return base(`enterprise/partnership-requests?enterpriseId=${enterpriseId}`)
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
