import { base, API } from "./base.js"

export function saveFile(lessonId, sectionName, toolId, folderName, file) {
  const formData = new FormData()

  formData.append("lessonId", lessonId)
  formData.append("sectionName", sectionName)
  formData.append("toolId", toolId)
  formData.append("folderName", folderName)
  formData.append("file", file)

  return base("files/upload", {
    method: "POST",
    data: formData,
  })
}

export function savePhotoCertification(file) {
  const formData = new FormData()

  formData.append("file", file)

  return base("files/upload/certification", {
    method: "POST",
    data: formData,
  })
}

export function getFileViewUrl(key) {
  return `${API}/files/view?key=${encodeURIComponent(key)}`
}

export function getFileDownloadUrl(key) {
  return `${API}/files/download?key=${encodeURIComponent(key)}`
}
