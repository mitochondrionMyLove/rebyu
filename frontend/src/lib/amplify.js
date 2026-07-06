import { Amplify } from "aws-amplify"

// Configured once at startup (imported from main.jsx). The frontend uses the
// public Cognito app client — never the backend client secret.
export function configureAmplify() {
  const userPoolId = import.meta.env.VITE_COGNITO_USER_POOL_ID
  const userPoolClientId = import.meta.env.VITE_COGNITO_USER_POOL_CLIENT_ID

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
