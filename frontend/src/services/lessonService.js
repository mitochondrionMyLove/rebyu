import { base } from "./base.js"

export function setLessonComponent(id, lessonComponent) {
  return base(`lessons/lesson/${id}`, {
    method: "PUT",
    data: {
      lessonComponentStructure: JSON.stringify(lessonComponent),
    },
  })
}

export function getLessonComponent(id) {
  return base(`lessons/lesson/${id}`, {
    method: "GET",
  })
}
