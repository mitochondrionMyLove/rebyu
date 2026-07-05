import { base } from "./base"

export function getExamTypes() {
  return base("exam-types")
}

export function createExamType(examTypeText) {
  return base("exam-types", { method: "POST", data: { examTypeText } })
}

export async function ensureExamType(examTypeText) {
  const types = await getExamTypes()
  const existing = (Array.isArray(types) ? types : []).find(
    (type) => type.examTypeText === examTypeText
  )
  if (existing) return existing
  return createExamType(examTypeText)
}

export function getExams() {
  return base("exams")
}

export function getExamById(examId) {
  return base(`exams/${examId}`)
}

export function createExam(exam) {
  return base("exams", { method: "POST", data: exam })
}

export function updateExam(examId, exam) {
  return base(`exams/${examId}`, { method: "PUT", data: exam })
}

export function deleteExam(examId) {
  return base(`exams/${examId}`, { method: "DELETE" })
}

// Exam questions (join between exam and question bank)
export function getExamQuestions() {
  return base("exam-questions")
}

export function createExamQuestion(examQuestion) {
  return base("exam-questions", { method: "POST", data: examQuestion })
}

export function updateExamQuestion(examQuestionId, examQuestion) {
  return base(`exam-questions/${examQuestionId}`, {
    method: "PUT",
    data: examQuestion,
  })
}

export function deleteExamQuestion(examQuestionId) {
  return base(`exam-questions/${examQuestionId}`, { method: "DELETE" })
}

// Question configs used when rendering attempt workspaces
export function getTextQuestionConfig(questionId) {
  return base(`text-question-configs/by-question/${questionId}`)
}

export function getDiagramQuestionConfig(questionId) {
  return base(`diagram-question-configs/by-question/${questionId}`)
}

export function getProgrammingQuestionConfig(questionId) {
  return base(`programming-question-configs/by-question/${questionId}`)
}

// Results and attempt details
export function getExamResults() {
  return base("exam-results")
}

export function getExamResult(learnerId, examId, attemptNo) {
  return base(`exam-results/${learnerId}/${examId}/${attemptNo}`)
}

export function createExamResult(result) {
  return base("exam-results", { method: "POST", data: result })
}

export function createLearnerExamDetail(detail) {
  return base("learner-exam-details", { method: "POST", data: detail })
}

export function getLearnerExamDetailsByAttempt(learnerId, examId, attemptNo) {
  return base(`learner-exam-details/by-attempt/${learnerId}/${examId}/${attemptNo}`)
}

export function createMcqAnswer(answer) {
  return base("learner-mcq-answers", { method: "POST", data: answer })
}

export function createTextAnswer(answer) {
  return base("learner-text-answers", { method: "POST", data: answer })
}

export function createDiagramAnswer(answer) {
  return base("learner-diagram-answers", { method: "POST", data: answer })
}

export function createProgrammingAnswer(answer) {
  return base("learner-programming-answers", { method: "POST", data: answer })
}

// Well-known assessment type labels stored in exam_types.exam_type_text.
export const ASSESSMENT_TYPES = [
  { value: "DIAGNOSTIC", label: "Diagnostic" },
  { value: "QUIZ", label: "Lesson Quiz" },
  { value: "MODULE_EXAM", label: "Module Exam" },
  { value: "MOCK_EXAM", label: "Mock Exam" },
]

export function getAssessmentTypeLabel(examTypeText) {
  return (
    ASSESSMENT_TYPES.find((type) => type.value === examTypeText)?.label ??
    examTypeText ??
    "Assessment"
  )
}
