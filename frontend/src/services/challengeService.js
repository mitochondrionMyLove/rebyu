import { base } from "./base.js"

export async function getChallengeGamificationData() {
  const [sessions, modes, learners] = await Promise.all([
    base("challenge-sessions"),
    base("challenge-modes"),
    base("learners"),
  ])

  return {
    sessions: Array.isArray(sessions) ? sessions : [],
    modes: Array.isArray(modes) ? modes : [],
    learners: Array.isArray(learners) ? learners : [],
  }
}
