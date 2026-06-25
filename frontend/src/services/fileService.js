import {base} from './base.js'

export function saveFile(lessonId, sectionName, toolId, folder){
  return base('files/upload',{
    method: 'POST',
    data: {lessonId, sectionName, toolId, folder},
  })
}