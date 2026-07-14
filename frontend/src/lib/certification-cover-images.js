const pexelsImage = (photoId, width = 1600) =>
  `https://images.pexels.com/photos/${photoId}/pexels-photo-${photoId}.jpeg?auto=compress&cs=tinysrgb&w=${width}`

const SHARED_CERTIFICATION_COVER = pexelsImage(7174676)

export const CERTIFICATION_COVER_IMAGES = {
  topcit: SHARED_CERTIFICATION_COVER,
  itPassport: SHARED_CERTIFICATION_COVER,
  feExam: SHARED_CERTIFICATION_COVER,
}

export function getCuratedCertificationCover(title = "") {
  const normalizedTitle = String(title).trim().toLowerCase()

  if (normalizedTitle.includes("topcit")) return CERTIFICATION_COVER_IMAGES.topcit
  if (normalizedTitle.includes("it passport")) return CERTIFICATION_COVER_IMAGES.itPassport
  if (normalizedTitle.includes("fe exam") || normalizedTitle.includes("fundamental information")) {
    return CERTIFICATION_COVER_IMAGES.feExam
  }

  return null
}

export function getCertificationFallbackImage(title = "") {
  return getCuratedCertificationCover(title) ?? CERTIFICATION_COVER_IMAGES.topcit
}
