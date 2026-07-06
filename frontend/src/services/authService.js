import {
  confirmResetPassword,
  confirmSignIn,
  confirmSignUp,
  fetchAuthSession,
  resendSignUpCode,
  resetPassword,
  signIn,
  signOut,
  signUp,
} from "aws-amplify/auth"

import { base } from "./base"

// Store the current sign-in context to handle multi-step challenges
// We use sessionStorage to persist the context across page navigation
let signInContext = null

function getStoredSignInContext() {
  try {
    const stored = sessionStorage.getItem("_amplify_signin_context")
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

function storeSignInContext(context) {
  try {
    if (context) {
      sessionStorage.setItem("_amplify_signin_context", JSON.stringify({
        ...context,
        // Keep only serializable data
        isSignedIn: context?.isSignedIn,
        nextStep: context?.nextStep,
      }))
    } else {
      sessionStorage.removeItem("_amplify_signin_context")
    }
    signInContext = context
  } catch {
    signInContext = context
  }
}

// ---------------------------------------------------------------------------
// Cognito auth wrapper. All provider errors are mapped to safe messages —
// raw Cognito exception names never reach the UI.
// ---------------------------------------------------------------------------

const ERROR_MESSAGES = {
  UsernameExistsException: "This email may already be registered.",
  InvalidPasswordException:
      "Your password does not meet the required requirements.",
  InvalidParameterException:
      "Unable to process your details. Please check them and try again.",
  CodeMismatchException: "Your verification code is invalid or expired.",
  ExpiredCodeException: "Your verification code is invalid or expired.",
  UserNotConfirmedException:
      "Your account must be verified before signing in.",
  NotAuthorizedException: "Incorrect email or password.",
  UserNotFoundException: "Incorrect email or password.",
  LimitExceededException:
      "Too many attempts. Please wait a moment and try again.",
  TooManyRequestsException:
      "Too many attempts. Please wait a moment and try again.",
  PasswordResetRequiredException:
      "A password reset is required. Use Forgot Password to continue.",
  UserAlreadyAuthenticatedException:
      "You are already signed in. Redirecting you now.",
  EmptySignInUsername: "Enter your email address.",
  EmptySignInPassword: "Enter your password.",
}

export function toSafeAuthMessage(error, fallback = "Something went wrong. Please try again.") {
  const name = error?.name ?? error?.code
  return ERROR_MESSAGES[name] ?? fallback
}

export async function registerAccount({ email, password, firstName, lastName }) {
  // A lingering session from an earlier/incomplete flow makes Cognito reject a
  // fresh sign-up; clear it first so registering always works.
  await signOut().catch(() => {})
  return signUp({
    username: email,
    password,
    options: {
      userAttributes: {
        email,
        ...(firstName ? { given_name: firstName } : {}),
        ...(lastName ? { family_name: lastName } : {}),
      },
    },
  })
}

export function confirmRegistration(email, code) {
  return confirmSignUp({ username: email, confirmationCode: code })
}

export function resendVerificationCode(email) {
  return resendSignUpCode({ username: email })
}

export async function loginWithCognito(email, password) {
  try {
    const result = await signIn({ username: email, password })
    // Store the sign-in context for handling challenges across page navigation
    storeSignInContext(result)
    return result
  } catch (error) {
    // A stale/lingering Cognito session blocks a new sign-in with
    // "There is already a signed in user." Clear it and retry once so the
    // learner isn't stuck on the login page.
    if (error?.name === "UserAlreadyAuthenticatedException") {
      await signOut().catch(() => {})
      const result = await signIn({ username: email, password })
      storeSignInContext(result)
      return result
    }
    throw error
  }
}

export function logoutFromCognito() {
  storeSignInContext(null)
  return signOut()
}

export function requestPasswordReset(email) {
  return resetPassword({ username: email })
}

export function confirmPasswordReset(email, code, newPassword) {
  return confirmResetPassword({
    username: email,
    confirmationCode: code,
    newPassword,
  })
}

// Returns the current Cognito access token, or null when signed out.
export async function getAccessToken() {
  try {
    const session = await fetchAuthSession()
    return session?.tokens?.accessToken?.toString() ?? null
  } catch {
    return null
  }
}

// Backend-confirmed identity: links/provisions the REBYU account for the
// validated token and returns the safe user DTO (the routing authority).
export function syncCurrentUser() {
  return base("auth/me")
}

// Completes the temporary password challenge from Cognito.
// This is called after a user signs in with a temporary password and receives
// a NEW_PASSWORD_REQUIRED challenge. Responds with the new password.
export async function completeTemporaryPassword(newPassword) {
  try {
    // Try to get sign-in context from memory or storage
    const context = signInContext || getStoredSignInContext()
    
    if (!context) {
      throw new Error("No active sign-in session. Please sign in again.")
    }

    console.log("Completing temporary password challenge...")
    console.log("Using sign-in context:", context)
    
    // In Amplify v6, when you get NEW_PASSWORD_REQUIRED, you respond by
    // calling confirmSignIn with the new password as the challengeResponse.
    // The current auth session context is maintained internally by Amplify.
    const result = await confirmSignIn({
      challengeResponse: newPassword,
    })
    
    console.log("confirmSignIn result:", result)
    console.log("isSignedIn:", result?.isSignedIn)
    console.log("nextStep:", result?.nextStep)
    
    // Clear the stored sign-in context after successful completion
    storeSignInContext(null)
    
    return result
  } catch (error) {
    console.error("completeTemporaryPassword failed with error:", error)
    storeSignInContext(null)
    throw error
  }
}
