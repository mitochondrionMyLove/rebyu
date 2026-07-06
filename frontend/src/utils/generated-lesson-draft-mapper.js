function normalizeToolData(tool) {
  const data = {
    ...(tool?.data ?? {}),
  }

  if (tool?.type === "image" || tool?.type === "image-left-text" || tool?.type === "image-right-text") {
    return {
      ...data,
      file: null,
      imageKey: data.imageKey ?? "",
    }
  }

  if (tool?.type === "video") {
    return {
      ...data,
      file: null,
      videoKey: data.videoKey ?? "",
    }
  }

  return data
}

export function mapGeneratedLessonDraftsToSections(draftResponse) {
  const responseData = draftResponse?.data ?? draftResponse ?? {}
  const sections = responseData.sections ?? []

  if (!Array.isArray(sections)) {
    return []
  }

  return sections.map((section) => ({
    id: section.id || crypto.randomUUID(),
    sectionName: section.sectionName ?? "",
    content: Array.isArray(section.content)
      ? section.content.map((tool) => ({
          id: tool.id || crypto.randomUUID(),
          type: tool.type ?? "",
          data: normalizeToolData(tool),
        }))
      : [],
  }))
}

export function getGeneratedLessonWarnings(draftResponse) {
  const responseData = draftResponse?.data ?? draftResponse ?? {}
  return Array.isArray(responseData.warnings) ? responseData.warnings : []
}
