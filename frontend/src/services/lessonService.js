import { base } from "./base.js"

export function setLessonComponent(id, lessonComponent) {
  return base(`lessons/lesson/${id}`, {
    method: "POST",
    data: JSON.stringify({
      lessonComponentStructure: lessonComponent
    }),
  })
}