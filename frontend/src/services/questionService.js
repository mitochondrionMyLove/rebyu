import { base } from "./base"

export async function saveQuestion(question) {
    return await base("questions", {
        method: "POST",
        data: question,
    })
}

export async function updateQuestion(questionId, question) {
    return await base(`questions/${questionId}`, {
        method: "PUT",
        data: question,
    })
}

export async function deleteQuestion(questionId) {
    return await base(`questions/${questionId}`, {
        method: "DELETE",
    })
}

export async function getQuestionsByLesson(lessonId) {
    return await base(`questions?lessonId=${lessonId}`, {
        method: "GET",
    })
}

export async function getQuestions() {
    return await base("questions", {
        method: "GET",
    })
}

export async function generateQuestionsFromFiles(
    certificationId,
    files,
    questionCounts
) {
    const formData = new FormData()

    formData.append("certificationId", String(certificationId))

    formData.append(
        "questionCountsJson",
        JSON.stringify(questionCounts)
    )

    files.forEach((file) => {
        formData.append("files", file)
    })

    return await base("ai/questions/generate", {
        method: "POST",
        data: formData,
    })
}

export async function saveChoices(choices) {
    return await base("choices", {
        method: "POST",
        data: choices,
    })
}

export async function saveTextQuestion(textQuestion) {
    return await base("text-question-configs", {
        method: "POST",
        data: textQuestion,
    })
}

export async function saveDiagramQuestion(diagramQuestion) {
    return await base("diagram-question-configs", {
        method: "POST",
        data: diagramQuestion,
    })
}

export async function saveProgrammingQuestion(programmingQuestion) {
    return await base("programming-question-configs", {
        method: "POST",
        data: programmingQuestion,
    })
}
