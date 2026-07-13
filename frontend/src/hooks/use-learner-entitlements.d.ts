export interface LearnerEntitlements {
  isLoading: boolean
  isError: boolean
  accessSource: string
  personalProActive: boolean
  institutionalActive: boolean
  hasPremium: boolean
  hasFeature: (code: string) => boolean
  features: Set<string>
  personalPlanCode: string
  personalStatus: string | null
  currentPeriodEnd: string | null
  cancelAtPeriodEnd: boolean
  refetch: () => unknown
}

export function useLearnerEntitlements(
  certificationId?: string | number | null
): LearnerEntitlements
