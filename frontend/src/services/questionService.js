import { base } from "./base"


export async function saveQuestions(questions){
    return await base('questions', {method: 'POST',data:questions})
}
export async function saveChoices(choices){
    return await base('choices ', {method: 'POST',data:choices})
}
export async function saveTextQuestion(textQuestion){
    return await base('text-question-configs ', {method: 'POST',data:textQuestion})
}
export async function saveDiagramQuestions(diagramQuestions){
    return await base('diagram-question-configs', {method: 'POST',data:diagramQuestions})
}
export async function saveProgrammingQuestions(programmingQuestions){
    return await base('programming-question-configs',{method:'POST',data: programmingQuestions})
}
