import { base } from "./base.js"

export function setLessonComponent(id, lessonComponent) {
  return base(`lessons/lesson/${id}`, {
    method: "PUT",
    data: {
      lessonComponentStructure: JSON.stringify(lessonComponent),
    },
  })
}
