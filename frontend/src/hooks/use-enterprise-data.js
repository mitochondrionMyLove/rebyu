import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"

import { getAllCertifications } from "@/services/certificationService"
import {
  getAllLearners,
  getEnterpriseInvoices,
  getLearnerInvitations,
  getOrganizationCertificates,
  getOrganizationCertificationLearners,
} from "@/services/enterpriseService.js"

function asArray(value) {
  return Array.isArray(value) ? value : []
}

// Shared tenant-scoped data for the organization portal. The backend exposes
// flat CRUD lists, so scoping to the current organization happens here.
export function useEnterpriseData(enterpriseId) {
  const enabled = enterpriseId != null

  const orgCertsQuery = useQuery({
    queryKey: ["organization-certificates"],
    queryFn: getOrganizationCertificates,
    enabled,
    retry: 1,
  })

  const certificationsQuery = useQuery({
    queryKey: ["certifications"],
    queryFn: getAllCertifications,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  })

  const invitationsQuery = useQuery({
    queryKey: ["learner-invitations"],
    queryFn: getLearnerInvitations,
    enabled,
    retry: 1,
  })

  const assignmentsQuery = useQuery({
    queryKey: ["organization-certification-learners"],
    queryFn: getOrganizationCertificationLearners,
    enabled,
    retry: 1,
  })

  const learnersQuery = useQuery({
    queryKey: ["learners"],
    queryFn: getAllLearners,
    enabled,
    retry: 1,
  })

  const invoicesQuery = useQuery({
    queryKey: ["enterprise-invoices"],
    queryFn: getEnterpriseInvoices,
    enabled,
    retry: 1,
  })

  const derived = useMemo(() => {
    const orgCerts = asArray(orgCertsQuery.data).filter(
      (cert) => cert.enterpriseId === enterpriseId
    )
    const orgCertIds = new Set(orgCerts.map((cert) => cert.orgCertId))

    const certificationById = new Map(
      asArray(certificationsQuery.data).map((certification) => [
        certification.certificationId,
        certification,
      ])
    )

    const invitations = asArray(invitationsQuery.data).filter((invitation) =>
      orgCertIds.has(invitation.orgCertId)
    )

    const assignments = asArray(assignmentsQuery.data).filter((assignment) =>
      orgCertIds.has(assignment.orgCertId)
    )

    const learnerById = new Map(
      asArray(learnersQuery.data).map((learner) => [
        learner.learnerId,
        learner,
      ])
    )

    const invoices = asArray(invoicesQuery.data).filter(
      (invoice) => invoice.enterpriseId === enterpriseId
    )

    const orgCertById = new Map(orgCerts.map((cert) => [cert.orgCertId, cert]))

    return {
      orgCerts,
      orgCertById,
      certificationById,
      invitations,
      assignments,
      learnerById,
      invoices,
    }
  }, [
    enterpriseId,
    orgCertsQuery.data,
    certificationsQuery.data,
    invitationsQuery.data,
    assignmentsQuery.data,
    learnersQuery.data,
    invoicesQuery.data,
  ])

  const queries = [
    orgCertsQuery,
    certificationsQuery,
    invitationsQuery,
    assignmentsQuery,
    learnersQuery,
    invoicesQuery,
  ]

  return {
    ...derived,
    isLoading: queries.some((query) => query.isLoading),
    isError: queries.some((query) => query.isError),
    refetchAll: () => queries.forEach((query) => query.refetch()),
    orgCertsQuery,
    certificationsQuery,
    invitationsQuery,
    assignmentsQuery,
    learnersQuery,
    invoicesQuery,
  }
}

export function getLearnerDisplayName(learner) {
  if (!learner) return "Unknown learner"
  const full = [learner.firstName, learner.lastName].filter(Boolean).join(" ")
  return full || learner.username || `Learner #${learner.learnerId}`
}
