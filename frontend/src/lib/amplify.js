import { Amplify } from "aws-amplify"

// Configured once at startup (imported from main.jsx). The frontend uses the
// public Cognito app client — never the backend client secret.
export function configureAmplify() {
  const userPoolId = "us-east-1_YhXCAZ9HF"
  const userPoolClientId = "2i0hnkt4vukphadv3a4513p8sg"

  if (!userPoolId || !userPoolClientId) {
    console.warn(
      "Cognito is not configured (missing VITE_COGNITO_* env vars); auth features are disabled."
    )
    return false
  }

  Amplify.configure({
    Auth: {
      Cognito: {
        userPoolId,
        userPoolClientId,
      },
    },
  })
  return true
}
