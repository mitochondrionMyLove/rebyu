import { base } from "./base.js"

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
